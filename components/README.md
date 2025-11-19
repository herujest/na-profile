# Atomic Design System

This project uses Atomic Design methodology for component organization. All components are organized into three main categories:

## Structure

```
components/
├── atoms/          # Basic building blocks
├── molecules/      # Simple combinations of atoms
├── organisms/      # Complex UI components
└── [legacy]/       # Existing components (to be migrated)
```

## Atoms

Basic, indivisible components that cannot be broken down further.

### Text
Typography component with variants and dark mode support.

```tsx
import { Text } from '@/components/atoms';

<Text variant="h1">Heading 1</Text>
<Text variant="body">Body text</Text>
<Text variant="small">Small text</Text>
```

**Variants:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body`, `small`, `caption`, `label`

### Button
Button component with variants and sizes.

```tsx
import { Button } from '@/components/atoms';

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" href="/page">Link Button</Button>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`
**Sizes:** `sm`, `md`, `lg`

### Input
Form input with label, error, and helper text support.

```tsx
import { Input } from '@/components/atoms';

<Input 
  label="Email" 
  type="email" 
  error="Invalid email"
  helperText="Enter your email address"
/>
```

### Textarea
Textarea component with label, error, and helper text support.

```tsx
import { Textarea } from '@/components/atoms';

<Textarea 
  label="Description" 
  rows={4}
  helperText="Enter a description"
/>
```

### Card
Container component with padding and hover effects.

```tsx
import { Card } from '@/components/atoms';

<Card padding="md" hover>
  Content here
</Card>
```

**Padding:** `none`, `sm`, `md`, `lg`

### Badge
Badge component for labels and tags.

```tsx
import { Badge } from '@/components/atoms';

<Badge variant="primary" size="md">New</Badge>
```

**Variants:** `default`, `primary`, `success`, `warning`, `danger`, `info`
**Sizes:** `sm`, `md`, `lg`

## Molecules

Simple combinations of atoms that form more complex UI elements.

### FormField
Wrapper for form inputs with label and error handling.

```tsx
import { FormField } from '@/components/molecules';
import { Input } from '@/components/atoms';

<FormField label="Email" required error="Invalid email">
  <Input type="email" />
</FormField>
```

### CardHeader
Header component for cards with icon and description.

```tsx
import { CardHeader } from '@/components/molecules';

<CardHeader 
  title="Settings" 
  icon="⚙️" 
  description="Manage your settings"
  gradient
/>
```

## Organisms

Complex UI components composed of molecules and atoms.

### PageContainer
Container component for page layouts with dark mode support.

```tsx
import { PageContainer } from '@/components/organisms';

<PageContainer maxWidth="2xl">
  Page content
</PageContainer>
```

**MaxWidth:** `sm`, `md`, `lg`, `xl`, `2xl`, `full`

## Dark Mode Support

All atomic design components support dark mode automatically through Tailwind's `dark:` classes. The theme is managed by `next-themes` in `_app.tsx`.

### Usage

```tsx
// Dark mode classes are automatically applied
<Text variant="h1">This text adapts to dark mode</Text>
<Button variant="primary">Button adapts to dark mode</Button>
```

## Migration Guide

When updating existing components:

1. Replace hardcoded text with `<Text>` component
2. Replace buttons with `<Button>` component
3. Replace form inputs with `<Input>` or `<Textarea>`
4. Wrap pages with `<PageContainer>` for consistent layout
5. Use `<Card>` for container components
6. Use `<Badge>` for labels and tags

## Best Practices

1. **Always use atomic components** for text, buttons, and form elements
2. **Consistent spacing** - Use Tailwind spacing utilities
3. **Dark mode first** - Always include dark mode classes
4. **Accessibility** - Include proper labels and ARIA attributes
5. **Type safety** - Use TypeScript interfaces for all props

