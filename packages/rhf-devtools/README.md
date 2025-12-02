# React Hook Form DevTools

A minimal devtools implementation for React Hook Form built using TanStack DevTools.

## Features

- **Real-time Form State Monitoring**: View form values, errors, and state in real-time
- **Form Validation Tracking**: See which fields are dirty, touched, valid, or invalid
- **Multiple Forms Support**: Register and monitor multiple forms simultaneously
- **Extensible Architecture**: Easy to extend with additional functionality
- **Zero External Styling Dependencies**: All styles are inline, no CSS imports needed
- **Collapsible Sections**: Keep your devtools organized with collapsible sections

## Installation

```bash
npm install @kodraa/react-hook-form-devtools
# or
yarn add @kodraa/react-hook-form-devtools
# or
pnpm add @kodraa/react-hook-form-devtools
# or
bun add @kodraa/react-hook-form-devtools
```

## Peer Dependencies

Make sure you have the following installed:

```bash
npm install react react-dom react-hook-form @tanstack/react-devtools
```

## Usage

### 1. Setup DevTools in Root Component

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { RHFDevtoolsPanel } from "@kodraa/react-hook-form-devtools";

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
import { useForm, FormProvider } from "react-hook-form";
import { RHFDevtools } from "@kodraa/react-hook-form-devtools";

function MyForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  return (
    <FormProvider {...form}>
      <RHFDevtools formId="my-form-id" />
      <form onSubmit={form.handleSubmit(onSubmit)}>{/* Your form fields */}</form>
    </FormProvider>
  );
}
```

## API

### `RHFDevtools`

Component to register a React Hook Form instance with the devtools.

**Props:**

- `formId` - A unique identifier for the form (string)

**Example:**

```tsx
import { FormProvider } from "react-hook-form";
import { RHFDevtools } from "react-hook-form-devtools";

const form = useForm();

return (
  <FormProvider {...form}>
    <RHFDevtools formId="registration-form" />
    {/* Your form content */}
  </FormProvider>
);
```

### `RHFDevtoolsPanel`

React component that renders the devtools panel UI.

### `DevtoolsEventClient`

Event client for managing form registration and accessing form methods.

**Methods:**

- `registerForm(formId, formMethods)` - Register a form and emit registration event (automatically called by `RHFDevtools`)
- `unregisterForm(formId)` - Unregister a form and emit unregistration event
- `getFormMethods(formId)` - Get form methods for a specific form
- `getAllForms()` - Get all registered forms (returns `Array<FormState>`)
- `getRegisteredFormIds()` - Get all registered form IDs
- `on(event, handler)` - Subscribe to devtools events (`register-form`, `unregister-form`)
- `emit(event, payload)` - Emit an event to the devtools

**Accessing Form Methods:**

Form methods are stored directly in the client (not serialized through events) and can be accessed anytime:

```tsx
import { DevtoolsEventClient } from "react-hook-form-devtools";

// Get form methods for any registered form
const formMethods = DevtoolsEventClient.getFormMethods("my-form-id");

if (formMethods) {
  // Access all React Hook Form methods
  formMethods.reset(); // Reset the form
  formMethods.setValue("fieldName", "newValue"); // Set a field value
  formMethods.trigger(); // Trigger validation

  // Access form state directly
  const values = formMethods.getValues();
  const errors = formMethods.formState.errors;
}
```

**Events:**

- `register-form` - Emitted when a form is registered (payload: `{ formId: string }`)
- `unregister-form` - Emitted when a form is unregistered (payload: `{ formId: string }`)

## Extension Points

The devtools architecture is designed to be extensible. Here are some ways you can extend it:

### 1. Listen to Registration Events

Subscribe to form registration/unregistration events:

```typescript
import { DevtoolsEventClient } from "react-hook-form-devtools";

// Listen for when forms are registered
DevtoolsEventClient.on("register-form", (event) => {
  console.log("Form registered:", event.payload.formId);
  const formMethods = DevtoolsEventClient.getFormMethods(event.payload.formId);
});

// Listen for when forms are unregistered
DevtoolsEventClient.on("unregister-form", (event) => {
  console.log("Form unregistered:", event.payload.formId);
});
```

### 2. Add Custom Events

Extend the `EventMap` type in `eventClient.ts` to add your own events:

```typescript
type EventMap = {
  "rhf-devtools:register-form": { formId: string };
  "rhf-devtools:unregister-form": { formId: string };
  "rhf-devtools:custom-event": { data: any }; // Add your custom event
};
```

### 3. Add Interactive Actions

You can add buttons or controls in the DevTools panel that interact with forms using the stored form methods:

```tsx
// In your DevtoolsPanel component
const formMethods = DevtoolsEventClient.getFormMethods(selectedFormId);

// Add buttons for common actions
<button onClick={() => formMethods?.reset()}>Reset Form</button>
<button onClick={() => formMethods?.trigger()}>Validate Form</button>
<button onClick={() => formMethods?.setValue("fieldName", "value")}>
  Set Field Value
</button>
<button onClick={() => {
  const values = formMethods?.getValues();
  console.log("Current values:", values);
}}>
  Log Values
</button>
```

### 4. Extend the Panel UI

Modify `DevtoolsPanel.tsx` to add additional UI elements, tabs, or visualizations. The panel has direct access to all form methods through `DevtoolsEventClient.getFormMethods(formId)`.

## Architecture

The devtools uses a simplified architecture that combines TanStack's event system with direct form method access:

1. **Event Client** (`eventClient.ts`):

   - Stores form methods in a Map (bypassing serialization issues)
   - Uses TanStack's event bus only for registration/unregistration notifications
   - Provides direct access to form methods via `getFormMethods()`

2. **DevTools Component** (`rhf-devtools.ts`):

   - Registers forms with the event client on mount
   - Unregisters forms on unmount
   - Simple and lightweight

3. **DevTools Panel** (`DevtoolsPanel.tsx`):
   - Listens to `register-form` and `unregister-form` events to track available forms
   - Accesses form state directly through `getFormMethods()`
   - Subscribes to form changes using React Hook Form's `watch()` for reactivity

## Future Extensions

Some ideas for extending the devtools:

- **Time-travel debugging**: Record and replay form state changes
- **Field-level history**: Track individual field value changes over time
- **Performance metrics**: Monitor render counts and re-renders
- **Form validation testing**: Test validation rules directly in the devtools
- **State snapshots**: Save and restore form states
