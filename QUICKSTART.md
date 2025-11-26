# Quick Start Guide: Creating Your Own Devtools with TanStack

This guide walks you through the process of creating custom devtools for any library using TanStack Devtools.

## Overview

We've created a fully functional React Hook Form devtools as an example. Here's what you need to know to create your own.

## What's Been Set Up

### ✅ Installed Packages

- `@tanstack/react-devtools` - Core devtools infrastructure
- `react-hook-form` - Example library we're creating devtools for

### ✅ Created Files

1. **`apps/web/src/devtools/react-hook-form-plugin.tsx`**

   - Main plugin implementation
   - Custom panel UI component
   - Form registry for tracking instances

2. **`apps/web/src/devtools/use-form-with-devtools.ts`**

   - Enhanced hook that auto-registers with devtools
   - Drop-in replacement for `useForm`

3. **`apps/web/src/devtools/index.ts`**
   - Public API exports

### ✅ Integration

- Added TanStack Devtools to root component (`__root.tsx`)
- Created example form page (`routes/index.tsx`)
- Positioned devtools in bottom-right corner

## Running the Project

```bash
# Start the development server
bun run dev

# Visit http://localhost:3000
```

## Testing the Devtools

1. **Fill out the form** on the home page
2. **Click the TanStack logo** in the bottom-right corner
3. **Navigate to "React Hook Form" tab** in the devtools
4. **Watch the magic happen** - form state updates in real-time!

## Understanding the Architecture

### 1. Plugin Structure

Every TanStack devtools plugin has this structure:

```tsx
export function MyDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "unique-id", // Unique identifier
    name: "Display Name", // Human-readable name
    devtools: {
      getInstanceKey: (instance) => string, // Generate unique key
      getInstanceLabel: (instance) => string, // Display label
      getInstanceData: (instance) => object, // Extract data
    },
    panelComponent: YourPanelComponent, // Custom UI
  };
}
```

### 2. Instance Registry

Track all instances of your library:

```tsx
const registry = new Map<string, YourLibraryInstance>();

export function register(id: string, instance: YourLibraryInstance) {
  registry.set(id, instance);
  return () => registry.delete(id); // Cleanup function
}

export function getAll() {
  return Array.from(registry.entries());
}
```

### 3. Enhanced Hook

Make it easy for users:

```tsx
export function useYourLibraryWithDevtools(...args) {
  const instance = useYourLibrary(...args);
  const id = useId();

  useEffect(() => {
    return register(id, instance);
  }, [id, instance]);

  return instance;
}
```

### 4. Custom Panel

Build your UI to display the data:

```tsx
function YourPanel() {
  const [instances, setInstances] = useState([]);

  useEffect(() => {
    // Poll or subscribe to updates
    const interval = setInterval(() => {
      setInstances(getAll());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Your custom UI */}
      {instances.map(([id, instance]) => (
        <div key={id}>{/* Display instance data */}</div>
      ))}
    </div>
  );
}
```

## Creating Devtools for Your Library

Let's say you want to create devtools for a library called `awesome-lib`.

### Step 1: Install TanStack Devtools

```bash
bun add @tanstack/react-devtools
```

### Step 2: Create the Plugin File

Create `src/devtools/awesome-lib-plugin.tsx`:

```tsx
import type { DevtoolsPlugin } from "@tanstack/react-devtools";
import { useState, useEffect } from "react";
import type { AwesomeLibInstance } from "awesome-lib";

// Registry
const registry = new Map<string, AwesomeLibInstance>();

export function registerAwesomeLib(id: string, instance: AwesomeLibInstance) {
  registry.set(id, instance);
  return () => registry.delete(id);
}

export function getAwesomeLibInstances() {
  return Array.from(registry.entries());
}

// Plugin
export function AwesomeLibDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "awesome-lib",
    name: "Awesome Lib",
    devtools: {
      getInstanceKey: (instance: AwesomeLibInstance) => instance.id,
      getInstanceLabel: (instance: AwesomeLibInstance) => "Instance",
      getInstanceData: (instance: AwesomeLibInstance) => ({
        // Extract relevant data from your library instance
        state: instance.getState(),
        config: instance.config,
        // ... whatever you want to show
      }),
    },
    panelComponent: AwesomeLibPanel,
  };
}

// Panel Component
function AwesomeLibPanel() {
  const [instances, setInstances] = useState<
    Array<[string, AwesomeLibInstance]>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInstances(getAwesomeLibInstances());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Awesome Lib Inspector</h2>
      {instances.length === 0 ? (
        <p>No instances registered</p>
      ) : (
        <div>
          {instances.map(([id, instance]) => (
            <div key={id} className="border rounded p-4 mb-2">
              <h3 className="font-semibold">{id}</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(instance.getState(), null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 3: Create Helper Hook

Create `src/devtools/use-awesome-lib-with-devtools.ts`:

```tsx
import { useEffect, useId } from "react";
import { useAwesomeLib } from "awesome-lib";
import { registerAwesomeLib } from "./awesome-lib-plugin";

export function useAwesomeLibWithDevtools(...args) {
  const instance = useAwesomeLib(...args);
  const id = useId();

  useEffect(() => {
    return registerAwesomeLib(id, instance);
  }, [id, instance]);

  return instance;
}
```

### Step 4: Integrate in Your App

In your root component:

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AwesomeLibDevtoolsPlugin } from "@/devtools/awesome-lib-plugin";

function App() {
  return (
    <>
      {/* Your app */}
      <TanStackDevtools plugins={[AwesomeLibDevtoolsPlugin()]} />
    </>
  );
}
```

### Step 5: Use in Components

```tsx
import { useAwesomeLibWithDevtools } from "@/devtools/use-awesome-lib-with-devtools";

function MyComponent() {
  const awesomeLib = useAwesomeLibWithDevtools({
    /* config */
  });

  // Use it normally
  return <div>{/* ... */}</div>;
}
```

## Key Concepts

### 1. Instance Tracking

You need a way to track all instances of your library. Use a `Map` or similar data structure.

### 2. Data Extraction

The `getInstanceData` function determines what data is shown in the devtools. Extract whatever is most useful for debugging.

### 3. Real-time Updates

Options for keeping the devtools in sync:

- **Polling**: Simple but less efficient (current implementation)
- **Subscriptions**: More efficient if your library supports observers
- **Events**: Listen to library events and update accordingly

### 4. Type Safety

Ensure your plugin and hooks are properly typed for the best developer experience.

## Advanced Features

### Multiple Plugins

You can combine multiple plugins:

```tsx
<TanStackDevtools
  plugins={[
    AwesomeLibDevtoolsPlugin(),
    AnotherLibDevtoolsPlugin(),
    YetAnotherLibDevtoolsPlugin(),
  ]}
/>
```

### Conditional Loading

Only load in development:

```tsx
{
  process.env.NODE_ENV === "development" && (
    <TanStackDevtools plugins={[MyPlugin()]} />
  );
}
```

### Custom Positioning

```tsx
<TanStackDevtools
  position="bottom-left" // or "bottom-right", "top-left", "top-right"
  plugins={[MyPlugin()]}
/>
```

### Actions

You can even add actions to modify state from the devtools:

```tsx
// In your panel component
function AwesomeLibPanel() {
  const handleReset = (instance: AwesomeLibInstance) => {
    instance.reset();
  };

  return (
    <div>
      {/* ... */}
      <button onClick={() => handleReset(instance)}>Reset Instance</button>
    </div>
  );
}
```

## Best Practices

### 1. Performance

- Use React's optimization hooks (`useMemo`, `useCallback`)
- Debounce updates if polling frequently
- Only extract necessary data in `getInstanceData`

### 2. User Experience

- Provide clear labels and descriptions
- Show meaningful data in an organized way
- Include helpful messages when no instances are registered

### 3. Type Safety

- Use TypeScript generics for library-specific types
- Export properly typed hooks and functions
- Ensure the plugin interface matches your library's types

### 4. Documentation

- Document how to use your devtools
- Provide examples
- Explain what data is shown and why

## Common Patterns

### Pattern 1: Auto-registration with Hook

```tsx
export function useLibraryWithDevtools() {
  const instance = useLibrary();
  const id = useId();

  useEffect(() => {
    return register(id, instance);
  }, [id, instance]);

  return instance;
}
```

### Pattern 2: Manual Registration

```tsx
export function MyComponent() {
  const instance = useLibrary();

  useEffect(() => {
    return register("my-custom-id", instance);
  }, [instance]);
}
```

### Pattern 3: Context-based

```tsx
const InstanceContext = createContext<LibraryInstance | null>(null);

export function LibraryProvider({ children }) {
  const instance = useLibrary();
  const id = useId();

  useEffect(() => {
    return register(id, instance);
  }, [id, instance]);

  return (
    <InstanceContext.Provider value={instance}>
      {children}
    </InstanceContext.Provider>
  );
}
```

## Troubleshooting

### Issue: Instances not appearing

**Solution:** Ensure you're using the enhanced hook and the plugin is registered.

### Issue: State not updating

**Solution:** Check polling interval or implement event-based updates.

### Issue: Performance issues

**Solution:** Reduce polling frequency or use subscriptions instead.

### Issue: TypeScript errors

**Solution:** Ensure all types are properly defined and exported.

## Next Steps

1. **Customize the UI** - Make the panel look exactly how you want
2. **Add filtering** - Allow users to filter instances
3. **Add search** - Let users search through data
4. **Add exports** - Allow exporting state as JSON
5. **Add time travel** - Record history and allow replay
6. **Add metrics** - Show performance metrics

## Resources

- [TanStack Devtools Docs](https://tanstack.com/devtools/latest)
- [Example Implementation](./apps/web/src/devtools/README.md)
- [React Hook Form Docs](https://react-hook-form.com/)

## Questions?

This implementation is meant to be a learning resource. Explore the code, experiment, and make it your own!

---

Happy coding! 🚀
