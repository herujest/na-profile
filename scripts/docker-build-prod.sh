#!/bin/bash

set -e

# Docker Build Script for Production
# Usage: 
#   ./scripts/docker-build-prod.sh [version] --push        # Multi-platform (amd+arm)
#   ./scripts/docker-build-prod.sh [version] --push-amd   # Push only amd64 (recommended for VPS)
#   ./scripts/docker-build-prod.sh [version] --local      # Local build (no push)

# Get version from package.json if not provided
if [ -z "$1" ] || [ "$1" == "--local" ] || [ "$1" == "--push" ] || [ "$1" == "--push-amd" ]; then
  # No version provided, read from package.json
  if [ -f "package.json" ]; then
    VERSION=$(node -p "require('./package.json').version")
    echo "📦 Using version from package.json: ${VERSION}"
  else
    VERSION="latest"
    echo "⚠️  package.json not found, using 'latest'"
  fi
  # Shift arguments if first arg was a mode flag
  if [ "$1" == "--local" ] || [ "$1" == "--push" ] || [ "$1" == "--push-amd" ]; then
    MODE=$1
  else
    MODE=${2:-""}
  fi
else
  VERSION=$1
  MODE=${2:-""}
fi

REGISTRY="registry.gigsnow.in"
IMAGE_NAME="nisa-profile"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${VERSION}"

echo "🚀 Building Docker image for PRODUCTION: ${FULL_IMAGE}"
echo "🏷️  Version: ${VERSION}"
echo "🐳 Dockerfile: Dockerfile"

# Ensure buildx builder
if ! docker buildx ls | grep -q "nisa-profile-builder"; then
  echo "📦 Creating buildx builder..."
  docker buildx create --name nisa-profile-builder --use --bootstrap
else
  echo "✅ Using existing buildx builder"
  docker buildx use nisa-profile-builder 2>/dev/null || docker buildx create --name nisa-profile-builder --use --bootstrap
fi

# Select build mode
if [ "$MODE" == "--local" ]; then
  echo "📦 Building for local machine only"
  BUILD_CMD="docker build --build-arg BUILD_VERSION=${VERSION} -t ${FULL_IMAGE}"
  PUSH_MODE=false
elif [ "$MODE" == "--push" ]; then
  echo "📦 Building for platforms: linux/amd64, linux/arm64"
  echo "📤 Pushing multi-arch image"
  BUILD_CMD="docker buildx build --build-arg BUILD_VERSION=${VERSION} --platform linux/amd64,linux/arm64 -t ${FULL_IMAGE} --push --provenance=false --sbom=false"
  PUSH_MODE=true
elif [ "$MODE" == "--push-amd" ]; then
  echo "📦 Building for linux/amd64 ONLY (recommended for VPS)"
  echo "📤 Pushing amd64 image to registry"
  BUILD_CMD="docker buildx build --build-arg BUILD_VERSION=${VERSION} --platform linux/amd64 -t ${FULL_IMAGE} --push --provenance=false --sbom=false"
  PUSH_MODE=true
else
  echo "⚠️  Unknown mode. Using local build."
  BUILD_CMD="docker build --build-arg BUILD_VERSION=${VERSION} -t ${FULL_IMAGE}"
  PUSH_MODE=false
fi

echo ""
echo "🔨 Executing build..."
echo "Command: ${BUILD_CMD} ."
echo ""

eval "${BUILD_CMD} ."

echo ""

if [ "$PUSH_MODE" == "true" ]; then
  echo "✅ Build and push completed!"
  echo "📦 Available at:"
  echo "   ${FULL_IMAGE}"
else
  echo "✅ Local build completed"
  echo "📦 Image: ${FULL_IMAGE}"
fi

