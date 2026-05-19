<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Guidelines for Restaurant Management Next.js Project

## Project Overview

This is a restaurant management system built with Next.js 16.2.6, React 19, TypeScript, and Tailwind CSS 4. The system includes admin dashboard, public website, and authentication flows.

## Key Technologies

- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: Shadcn UI components built on Radix UI
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **State Management**: React Query (TanStack) for server state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Cookies**: js-cookie

## File Structure Conventions

````
app/
  (admin)/          # Admin dashboard routes (protected)
  (public)(auth)/   # Public routes with auth (login, register, etc.)
  (public)/         # Public website routes
  layout.tsx        # Root layout
  globals.css       # Global styles
  favicon.ico       # Website favicon

components/
  ui/               # Reusable UI components (buttons, inputs, modals, etc.)
  layouts/          # Layout components (AdminSidebar, AdminHeader, etc.)
  sections/         # Page sections (Hero, FeaturedMenu, Gallery, etc.)
  auth/             # Authentication forms
  permissions/      # Permission management components
  roles/            # Role management components
  users/            # User management components
  actions/          # Action management components
  menucategories/    # Menu category management components

features/
  [domain]/         # Domain-specific modules (auth, permissions, roles, user, actions,...)
    api.ts          # API endpoint definitions
    index.ts        # Barrel exports
    mutations.ts    # React Query mutations
    queries.ts      # React Query queries
    types.ts        # TypeScript types
    validator.ts    # Zod validation schemas

providers/
  AuthProvider.tsx      # Authentication context
  PermissionProvider.tsx # Permission context
  QueryProvider.tsx     # React Query client provider

lib/
  axios.ts              # Axios instance configuration
  utils.ts              # Utility functions

hooks/
  use-mobile.ts         # Custom hook for mobile detection
  useDebounce.ts        # Custom debounce hook

utils/
  currency.ts           # Currency formatting utilities
  formatTime.ts         # Time formatting utilities

constants/
  api.ts                # API base URLs
  index.ts              # Barrel export
  message.ts            # Message constants
  routes.ts             # Route path constants

data/
  restaurant.ts         # Restaurant data constants

## Important Conventions & Patterns

### 1. Component Development
- Use Shadcn UI components from `@/components/ui/*` as base
- Extend components with variants using `class-variance-authority`
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Follow Radix UI component composition patterns
- Export components as named exports, not default exports when possible

### 2. Styling
- Use Tailwind CSS 4 utility classes
- Leverage CSS variables for theming (defined in layouts)
- Use `class-variance-authority` for component variants
- Avoid arbitrary values when possible; use design system tokens
- Dark mode support via `dark:` variants

### 3. TypeScript
- Strict TypeScript mode enabled
- Define types in `features/[domain]/types.ts` or `types/index.d.ts`
- Use interfaces for object types, type aliases for primitives/unions
- Generic components should be properly typed
- Avoid `any` type; use `unknown` with type guards when necessary

### 4. State Management
- Server state: React Query (`@tanstack/react-query`)
- Client state: React Context (AuthProvider, PermissionProvider)
- Form state: React Hook Form with Zod validation
- Query keys should be arrays for granular invalidation
- Use `useMutation` and `useQuery` hooks from React Query
- Handle loading, error, and success states appropriately

### 5. Forms
- Use React Hook Form (`react-hook-form`)
- Validation with Zod schemas (`zod`)
- Place validation schemas in `features/[domain]/validator.ts`
- Use `useForm` hook with resolver from `@hookform/resolvers/zod`
- Show validation errors using form state
- Handle form submission with `handleSubmit`

### 6. API Communication
- Axios instance configured in `@/lib/axios.ts`
- API endpoints defined in `features/[domain]/api.ts`
- Use relative URLs (axios instance handles base URL)
- Handle authentication via request interceptors (if implemented)
- Error handling should be consistent

### 7. Authentication & Authorization
- Authentication context: `AuthProvider`
- Authorization context: `PermissionProvider`
- Protected routes should check authentication/authorization
- Use `next/navigation` for redirects in client components
- Use route protection patterns in layouts

### 8. Next.js Specific
- Use App Router (`app/` directory)
- Route groups denoted by parentheses `( )`
- Server Components by default; use `'use client'` when needed
- Loading states: use `loading.tsx` for Suspense boundaries
- Error handling: use `error.tsx` for error boundaries
- Metadata: export `metadata` or `generateMetadata` in layout/page files
- Image optimization: use `next/image` component

### 9. Accessibility
- Use semantic HTML elements
- Ensure proper ARIA labels and attributes
- Keyboard navigation support
- Focus management in modals/dialogs
- Color contrast compliance

### 10. Performance
- Optimize images with `next/image`
- Lazy load components when appropriate
- Use React.memo for expensive components
- Implement pagination for large datasets
- Use skeletons for loading states

## Common Patterns to Follow

### Component Structure
```tsx
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

export interface MyComponentProps extends VariantProps<typeof myComponentVariants> {
  // props definition
}

const myComponentVariants = cva(
  // base classes
  {
    variants: {
      // variants definition
    },
    defaultVariants: {
      // default variants
    }
  }
)

export function MyComponent({ className, ...props }: MyComponentProps) {
  return (
    <div className={cn('base-class', className)}>
      {/* component content */}
    </div>
  )
}
````

### React Query Usage

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/providers/QueryProvider';
import { api } from '@/features/user/api';

// Query
function useGetUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.getUser(id),
  });
}

// Mutation
function useUpdateUser() {
  return useMutation({
    mutationFn: (data: UserData) => api.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/features/auth/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await api.login(values);
      // handle success
    } catch (error) {
      // handle error
    }
  });

  return (
    <form {...form.handleSubmit(onSubmit)}>
      {/* form fields */}
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Critical Reminders

1. **Next.js Version**: This is Next.js 16.2.6 - NOT the older versions you may be familiar with
2. **App Router**: Use the `app/` directory structure, NOT `pages/`
3. **Server Components**: Components are Server Components by default - add `'use client'` only when needed
4. **TypeScript**: Strict typing is enforced - leverage the type system
5. **Tailwind 4**: Uses newer syntax and features - refer to Tailwind CSS 4 documentation
6. **Shadcn UI**: Customize the Shadcn components rather than recreating from scratch
7. **React Query**: Follow the established patterns for data fetching and mutations
8. **Authentication**: Always check auth state in protected routes
9. **Error Handling**: Implement proper error boundaries and user feedback
10. **Accessibility**: Ensure all components are accessible

## When in Doubt

- Look at existing components in `@/components/ui/` for patterns
- Check feature modules in `/features/` for domain-specific implementations
- Follow the established coding standards in the codebase
- When modifying existing files, maintain consistency with surrounding code
