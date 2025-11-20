import React from "react";
import MainLayout from "@/components/layouts/MainLayout";

interface BlogLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  title,
  description,
  image,
}) => {
  return (
    <MainLayout
      title={title}
      description={description}
      isBlog={true}
      showHeader={true}
      showFooter={true}
    >
      {children}
    </MainLayout>
  );
};

export default BlogLayout;
