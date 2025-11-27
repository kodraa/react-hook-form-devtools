# React Hook Form DevTools

A minimal devtools implementation for React Hook Form built using TanStack DevTools.

## Features

- **Real-time Form State Monitoring**: View form values, errors, and state in real-time
- **Form Validation Tracking**: See which fields are dirty, touched, valid, or invalid
- **Multiple Forms Support**: Register and monitor multiple forms simultaneously
- **Extensible Architecture**: Easy to extend with additional functionality

## Usage

### 1. Setup DevTools in Root Component

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { RHFDevtoolsPanel } from "@/lib/rhf-devtools";

function App() {
  return (
    <>
      {/* Your app content */}

      <TanStackDevtools
        position="bottom-right"
        plugins={[
          {
            name: "React Hook Form",
            render: <RHFDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
```

### 2. Register Forms with DevTools

```tsx
import { useForm } from "react-hook-form";
import { useRHFDevtools } from "@/lib/rhf-devtools";

function MyForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  // Register this form with the devtools
  useRHFDevtools(form, "my-form-id");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Your form fields */}</form>
  );
}
```

## API

### `useRHFDevtools(form, formId)`

Hook to register a React Hook Form instance with the devtools.

**Parameters:**

- `form` - The form instance from `useForm()`
- `formId` - A unique identifier for the form (string)

**Example:**

```tsx
const form = useForm();
useRHFDevtools(form, "registration-form");
```

### `RHFDevtoolsPanel`

React component that renders the devtools panel UI.

### `DevtoolsEventClient`

Event client for manual integration or custom functionality.

**Methods:**

- `emit(event, payload)` - Emit an event to the devtools
- `on(event, handler)` - Subscribe to devtools events
- `registerFormMethods(formId, formMethods)` - Register form methods for a form (automatically called by `useRHFDevtools`)
- `getFormMethods(formId)` - Retrieve form methods for a given form ID
- `unregisterFormMethods(formId)` - Unregister form methods when a form is unmounted
- `getRegisteredFormIds()` - Get all registered form IDs
- `hasFormMethods(formId)` - Check if a form is registered

**Accessing Form Methods:**

Form methods (like `setValue`, `reset`, `trigger`, etc.) cannot be serialized through the event system. Instead, they're stored in a separate store and can be accessed directly:

```tsx
import { DevtoolsEventClient } from "@/lib/rhf-devtools";

// In your DevTools panel or any component
const formMethods = DevtoolsEventClient.getFormMethods("my-form-id");

if (formMethods) {
  // Now you can call any form method
  formMethods.reset(); // Reset the form
  formMethods.setValue("fieldName", "newValue"); // Set a field value
  formMethods.trigger(); // Trigger validation
}
```

## Extension Points

The devtools architecture is designed to be extensible. Here are some ways you can extend it:

### 1. Add Custom Events

Extend the `EventMap` type in `eventClient.ts`:

```typescript
type EventMap = {
  "rhf-devtools:form-state": FormState;
  "rhf-devtools:forms-list": { forms: FormState[] };
  "rhf-devtools:custom-event": { data: any }; // Add your custom event
};
```

### 2. Add Form Actions

You can emit events from your forms to trigger actions in the devtools:

```typescript
import { DevtoolsEventClient } from "@/lib/rhf-devtools";

// Emit custom events
DevtoolsEventClient.emit("custom-event", { data: "my data" });
```

### 3. Extend the Panel UI

Modify `DevtoolsPanel.tsx` to add additional UI elements, tabs, or visualizations.

### 4. Add Interactive Actions

You can add buttons or controls in the DevTools panel that interact with forms:

```tsx
// In your DevtoolsPanel component
const formMethods = DevtoolsEventClient.getFormMethods(selectedFormId);

// Add buttons for common actions
<button onClick={() => formMethods?.reset()}>Reset Form</button>
<button onClick={() => formMethods?.trigger()}>Validate Form</button>
<button onClick={() => formMethods?.setValue("fieldName", "value")}>
  Set Field Value
</button>
```

## Architecture

The devtools follows the TanStack DevTools plugin pattern:

1. **Event Client** (`eventClient.ts`): Manages communication between forms and the devtools panel
2. **DevTools Hook** (`useRHFDevtools.ts`): Watches form state and emits updates to the event client
3. **DevTools Panel** (`DevtoolsPanel.tsx`): UI component that displays form state

## Future Extensions

Some ideas for extending the devtools:

- **Time-travel debugging**: Record and replay form state changes
- **Field-level history**: Track individual field value changes over time
- **Performance metrics**: Monitor render counts and re-renders
- **Form validation testing**: Test validation rules directly in the devtools
- **State snapshots**: Save and restore form states
- **Multiple form comparison**: Compare state across different forms
