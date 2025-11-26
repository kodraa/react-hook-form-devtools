# React Hook Form Devtools

A custom devtools plugin for React Hook Form built on TanStack Devtools infrastructure.

## Features

- 🔍 **Real-time Form Inspection**: Monitor form state, values, and errors as they change
- 📊 **Multiple Forms Support**: Track and inspect multiple form instances simultaneously
- 🎯 **Type-Safe**: Full TypeScript support with type inference
- 🚀 **Easy Integration**: Drop-in replacement for `useForm` with automatic devtools registration
- 🎨 **Beautiful UI**: Clean, modern interface built with Tailwind CSS

## Quick Start

### 1. Installation

The devtools are already installed as part of this project. If setting up in a new project:

```bash
bun add @tanstack/react-devtools react-hook-form
```

### 2. Setup Devtools

Add the TanStack Devtools component with the React Hook Form plugin to your app root:

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactHookFormDevtoolsPlugin } from "@/devtools/react-hook-form-plugin";

function App() {
  return (
    <>
      {/* Your app content */}
      <TanStackDevtools 
        position="bottom-right"
        plugins={[ReactHookFormDevtoolsPlugin()]} 
      />
    </>
  );
}
```

### 3. Use the Enhanced Hook

Replace `useForm` with `useFormWithDevtools`:

```tsx
import { useFormWithDevtools } from "@/devtools/use-form-with-devtools";

function MyForm() {
  const form = useFormWithDevtools({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Use the form as normal
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Your form fields */}
    </form>
  );
}
```

That's it! The form will automatically register with the devtools.

## API Reference

### `useFormWithDevtools<T>(options)`

A drop-in replacement for React Hook Form's `useForm` hook that automatically registers the form with devtools.

**Type Parameters:**
- `T` - The shape of your form data (extends `FieldValues`)

**Parameters:**
- Same as React Hook Form's `useForm`

**Returns:**
- Same as React Hook Form's `useForm`

**Example:**

```tsx
interface FormData {
  username: string;
  email: string;
  age: number;
}

const form = useFormWithDevtools<FormData>({
  defaultValues: {
    username: "",
    email: "",
    age: 0,
  },
  mode: "onChange",
});
```

### `registerForm(formId, form)`

Manually register a form instance with the devtools. Usually, you don't need to call this directly - use `useFormWithDevtools` instead.

**Parameters:**
- `formId` (string) - Unique identifier for the form
- `form` (UseFormReturn) - React Hook Form instance

**Returns:**
- Cleanup function to unregister the form

**Example:**

```tsx
import { useForm } from "react-hook-form";
import { registerForm } from "@/devtools/react-hook-form-plugin";
import { useEffect, useId } from "react";

function MyForm() {
  const form = useForm();
  const formId = useId();

  useEffect(() => {
    const cleanup = registerForm(formId, form);
    return cleanup;
  }, [formId, form]);

  return <form>{/* ... */}</form>;
}
```

### `ReactHookFormDevtoolsPlugin()`

The TanStack Devtools plugin for React Hook Form.

**Returns:**
- DevtoolsPlugin instance

**Example:**

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactHookFormDevtoolsPlugin } from "@/devtools/react-hook-form-plugin";

<TanStackDevtools plugins={[ReactHookFormDevtoolsPlugin()]} />
```

## What You Can Inspect

The devtools panel provides the following information for each registered form:

### Form State
- **Is Dirty**: Whether the form has been modified from default values
- **Is Valid**: Whether all validation rules pass
- **Is Submitting**: Whether the form is currently being submitted
- **Is Submitted**: Whether the form has been submitted at least once
- **Submit Successful**: Whether the last submission was successful
- **Submit Count**: Number of times the form has been submitted

### Values
Real-time display of all form field values in JSON format.

### Errors
Live validation errors for each field, displayed when validation fails.

## Architecture

### How It Works

1. **Form Registration**: When `useFormWithDevtools` is called, it wraps the standard `useForm` hook and registers the form instance in a global registry
2. **State Polling**: The devtools panel polls the registry at regular intervals (500ms) to detect changes
3. **State Extraction**: For each form, the plugin extracts state, values, and errors from the form instance
4. **UI Rendering**: The custom panel component renders the form data in an easy-to-read format

### File Structure

```
src/devtools/
├── react-hook-form-plugin.tsx  # Main plugin with panel UI
├── use-form-with-devtools.ts   # Enhanced useForm hook
├── index.ts                     # Public API exports
└── README.md                    # This file
```

## Advanced Usage

### Custom Form IDs

If you need to provide custom form IDs (instead of auto-generated ones):

```tsx
import { useForm } from "react-hook-form";
import { registerForm } from "@/devtools/react-hook-form-plugin";
import { useEffect } from "react";

function MyForm() {
  const form = useForm();

  useEffect(() => {
    const cleanup = registerForm("my-custom-form-id", form);
    return cleanup;
  }, [form]);

  return <form>{/* ... */}</form>;
}
```

### Multiple Plugins

You can combine the React Hook Form plugin with other TanStack plugins:

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactHookFormDevtoolsPlugin } from "@/devtools/react-hook-form-plugin";
import { FormDevtoolsPlugin } from "@tanstack/react-form-devtools";

<TanStackDevtools 
  plugins={[
    ReactHookFormDevtoolsPlugin(),
    FormDevtoolsPlugin(), // For TanStack Form
    // Add more plugins...
  ]} 
/>
```

## Creating Your Own Devtools

This implementation serves as a template for creating devtools for any library. Here's the general pattern:

### 1. Create a Plugin

```tsx
import type { DevtoolsPlugin } from "@tanstack/react-devtools";

export function MyCustomDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "my-plugin",
    name: "My Plugin",
    devtools: {
      getInstanceKey: (instance) => {
        // Return unique key for instance
      },
      getInstanceLabel: (instance) => {
        // Return label for instance
      },
      getInstanceData: (instance) => {
        // Return data to display
      },
    },
    panelComponent: MyCustomPanel,
  };
}
```

### 2. Create a Panel Component

```tsx
function MyCustomPanel() {
  const [instances, setInstances] = useState([]);
  
  // Your UI logic here
  
  return (
    <div>
      {/* Your custom panel UI */}
    </div>
  );
}
```

### 3. Create a Registration System

```tsx
const instanceRegistry = new Map();

export function registerInstance(id: string, instance: any) {
  instanceRegistry.set(id, instance);
  return () => instanceRegistry.delete(id);
}

export function getInstances() {
  return Array.from(instanceRegistry.entries());
}
```

### 4. Create Helper Hooks

```tsx
export function useMyLibraryWithDevtools(...args) {
  const instance = useMyLibrary(...args);
  const id = useId();

  useEffect(() => {
    const cleanup = registerInstance(id, instance);
    return cleanup;
  }, [id, instance]);

  return instance;
}
```

## Production Considerations

### Performance

The current implementation polls for changes every 500ms. For production use with many forms, consider:

1. **Conditional Loading**: Only load devtools in development
2. **Event-based Updates**: Use React Hook Form's `watch` API instead of polling
3. **Debouncing**: Reduce update frequency for better performance

### Example: Development-only Devtools

```tsx
function App() {
  return (
    <>
      {/* Your app */}
      {process.env.NODE_ENV === 'development' && (
        <TanStackDevtools 
          plugins={[ReactHookFormDevtoolsPlugin()]} 
        />
      )}
    </>
  );
}
```

### Example: Event-based Updates

```tsx
// Instead of polling, subscribe to form state changes
const subscription = form.watch((data) => {
  // Update devtools
});
```

## Troubleshooting

### Forms not appearing in devtools

- Ensure you're using `useFormWithDevtools` instead of `useForm`
- Check that the TanStack Devtools component is rendered in your app
- Verify the plugin is properly registered in the `plugins` array

### State not updating

- The panel polls every 500ms - wait a moment after making changes
- Check browser console for any errors
- Ensure the form instance is not being recreated on every render

### TypeScript errors

- Make sure you have the correct type parameters on `useFormWithDevtools<T>`
- Ensure `T` extends `FieldValues` from React Hook Form
- Check that all dependencies are properly installed

## Contributing

To improve these devtools:

1. **Add Features**: Extend the panel UI to show more form state
2. **Optimize Performance**: Replace polling with event-based subscriptions
3. **Add Actions**: Allow modifying form state from the devtools
4. **Improve Styling**: Enhance the visual design of the panel

## License

Same as the parent project.

## Resources

- [TanStack Devtools Documentation](https://tanstack.com/devtools/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [TanStack Form Devtools Example](https://github.com/tanstack/form/tree/main/packages/react-form-devtools)

---

Built with ❤️ using TanStack Devtools

