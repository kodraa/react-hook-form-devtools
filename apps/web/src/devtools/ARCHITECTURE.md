# Devtools Architecture

This document explains the technical architecture of the custom devtools implementation.

## System Overview

```
┌───────────────────────────────────────────────────────────────────┐
│                         Your React App                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Component Using Form                                             │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ const form = useFormWithDevtools({                      │     │
│  │   defaultValues: { name: "", email: "" }                │     │
│  │ });                                                     │     │
│  │                                                         │     │
│  │ <input {...form.register("name")} />                   │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │         useFormWithDevtools Hook                        │     │
│  │  ┌───────────────────────────────────────────────────┐  │     │
│  │  │ 1. const form = useForm(...args)                 │  │     │
│  │  │ 2. const id = useId()                            │  │     │
│  │  │ 3. useEffect(() => {                             │  │     │
│  │  │      return registerForm(id, form)               │  │     │
│  │  │    }, [id, form])                                │  │     │
│  │  │ 4. return form                                   │  │     │
│  │  └───────────────────────────────────────────────────┘  │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              Global Form Registry                       │     │
│  │                                                         │     │
│  │  formRegistry = Map<string, UseFormReturn> {           │     │
│  │    ":r1:" → FormInstance {                            │     │
│  │              formState: { isDirty, isValid, ... }     │     │
│  │              getValues: () => { name: "...", ... }    │     │
│  │            }                                           │     │
│  │    ":r2:" → FormInstance { ... }                      │     │
│  │    ":r3:" → FormInstance { ... }                      │     │
│  │  }                                                     │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           ▲                                       │
│                           │                                       │
│  ┌────────────────────────┴────────────────────────────────┐     │
│  │            TanStack Devtools Core                       │     │
│  │  ┌───────────────────────────────────────────────────┐  │     │
│  │  │  ReactHookFormDevtoolsPlugin                      │  │     │
│  │  │                                                   │  │     │
│  │  │  devtools: {                                      │  │     │
│  │  │    getInstanceKey: (form) => generateKey(form)   │  │     │
│  │  │    getInstanceLabel: (form) => "Form"            │  │     │
│  │  │    getInstanceData: (form) => {                  │  │     │
│  │  │      values: form.getValues(),                   │  │     │
│  │  │      errors: form.formState.errors,              │  │     │
│  │  │      isDirty: form.formState.isDirty,            │  │     │
│  │  │      ...                                          │  │     │
│  │  │    }                                              │  │     │
│  │  │  }                                                │  │     │
│  │  │                                                   │  │     │
│  │  │  panelComponent: FormDevtoolsPanel               │  │     │
│  │  └───────────────────────────────────────────────────┘  │     │
│  └─────────────────────────────────────────────────────────┘     │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │          FormDevtoolsPanel Component                    │     │
│  │                                                         │     │
│  │  useEffect(() => {                                      │     │
│  │    const interval = setInterval(() => {                 │     │
│  │      setForms(getRegisteredForms())  // Poll registry   │     │
│  │      forceUpdate()                   // Trigger re-render│    │
│  │    }, 500)                                              │     │
│  │    return () => clearInterval(interval)                 │     │
│  │  }, [])                                                 │     │
│  │                                                         │     │
│  │  return (                                               │     │
│  │    <div>                                                │     │
│  │      {forms.map(([id, form]) => (                       │     │
│  │        <FormStateDisplay form={form} />                 │     │
│  │      ))}                                                │     │
│  │    </div>                                               │     │
│  │  )                                                      │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. Form Registration

```typescript
User Component
    │
    ├─► useFormWithDevtools()
    │       │
    │       ├─► useForm() [React Hook Form]
    │       │       │
    │       │       └─► Returns FormInstance
    │       │
    │       ├─► useId() [Generate unique ID]
    │       │
    │       ├─► useEffect()
    │       │       │
    │       │       └─► registerForm(id, form)
    │       │               │
    │       │               └─► formRegistry.set(id, form)
    │       │
    │       └─► return FormInstance
    │
    └─► Use FormInstance normally
```

### 2. State Inspection

```typescript
FormDevtoolsPanel
    │
    ├─► useEffect() with setInterval
    │       │
    │       └─► Every 500ms:
    │               │
    │               ├─► getRegisteredForms()
    │               │       │
    │               │       └─► Returns Array.from(formRegistry.entries())
    │               │
    │               ├─► setForms(forms)
    │               │
    │               └─► forceUpdate({})
    │
    ├─► Render forms list
    │       │
    │       └─► For each form:
    │               │
    │               ├─► Extract form.formState
    │               │       │
    │               │       ├─► isDirty
    │               │       ├─► isValid
    │               │       ├─► isSubmitting
    │               │       └─► errors
    │               │
    │               ├─► Extract form.getValues()
    │               │
    │               └─► Render in UI
    │
    └─► User sees live data
```

## Data Flow Diagram

```
┌─────────────┐     register     ┌─────────────┐     poll     ┌──────────────┐
│   useForm   │ ─────────────► │   Registry   │ ◄─────────── │ Devtools UI  │
│   Hook      │                 │   (Map)      │              │   Panel      │
└─────────────┘                 └─────────────┘              └──────────────┘
      │                                │                              │
      │                                │                              │
      │ form instance                  │ stores instances             │ displays
      │                                │                              │
      ▼                                ▼                              ▼
┌─────────────┐                 ┌─────────────┐              ┌──────────────┐
│ Component   │                 │  formId1    │              │ Form State   │
│  renders    │                 │  formId2    │              │ Form Values  │
│  form UI    │                 │  formId3    │              │ Form Errors  │
└─────────────┘                 └─────────────┘              └──────────────┘
```

## Key Components

### 1. Registry (Storage)

**Purpose**: Centralized storage for all form instances

**Implementation**:

```typescript
const formRegistry = new Map<string, UseFormReturn<any>>();
```

**Operations**:

- `set(id, form)` - Register a form
- `delete(id)` - Unregister a form
- `entries()` - Get all forms

**Lifecycle**:

- Form created → Registered
- Component unmounts → Unregistered
- Re-render → Same registration (via stable ID)

### 2. Plugin (Bridge)

**Purpose**: Connect React Hook Form to TanStack Devtools

**Implementation**:

```typescript
export function ReactHookFormDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "react-hook-form",
    name: "React Hook Form",
    devtools: {
      /* extraction methods */
    },
    panelComponent: FormDevtoolsPanel,
  };
}
```

**Responsibilities**:

- Define how to extract data from forms
- Provide custom UI component
- Register with TanStack Devtools

### 3. Enhanced Hook (Integration)

**Purpose**: Make devtools integration seamless

**Implementation**:

```typescript
export function useFormWithDevtools<T>(...args) {
  const form = useForm<T>(...args);
  const id = useId();

  useEffect(() => {
    return registerForm(id, form);
  }, [id, form]);

  return form;
}
```

**Benefits**:

- Drop-in replacement for `useForm`
- Automatic registration/cleanup
- Same API surface
- Type-safe

### 4. Panel Component (UI)

**Purpose**: Display form data in devtools

**Implementation**:

- Polls registry for updates
- Renders list of forms
- Shows state, values, errors
- Allows form selection

**State Management**:

```typescript
const [forms, setForms] = useState([]);
const [selectedFormId, setSelectedFormId] = useState(null);
const [, forceUpdate] = useState({});
```

## Performance Considerations

### Current Implementation: Polling

**Pros**:

- Simple to implement
- Works with any library
- No coupling to form internals

**Cons**:

- Updates every 500ms (not instant)
- Runs even when devtools closed
- Can be CPU intensive with many forms

**Code**:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setForms(getRegisteredForms());
    forceUpdate({});
  }, 500);
  return () => clearInterval(interval);
}, []);
```

### Alternative: Event-Based

**Pros**:

- Instant updates
- More efficient
- No unnecessary renders

**Cons**:

- More complex
- Requires library support
- Tighter coupling

**Code**:

```typescript
useEffect(() => {
  const subscriptions = forms.map(([id, form]) =>
    form.watch((data) => {
      // Update devtools immediately
      updateDevtools(id, data);
    })
  );
  return () => subscriptions.forEach((sub) => sub.unsubscribe());
}, [forms]);
```

### Alternative: Store-Based

**Pros**:

- Reactive by default
- Efficient updates
- Single source of truth

**Cons**:

- Requires TanStack Store
- More setup
- Different mental model

**Code**:

```typescript
import { Store } from "@tanstack/store";

const formStore = new Store({
  forms: new Map(),
});

formStore.subscribe((state) => {
  // Automatically notifies devtools
});
```

## Type System

### Type Parameters Flow

```typescript
interface FormData {
  name: string;
  email: string;
}

// User code:
const form = useFormWithDevtools<FormData>({
  defaultValues: { name: "", email: "" },
});
//    ↓ Types flow through
//    ↓
// Hook signature:
function useFormWithDevtools<T extends FieldValues>(
  ...args: Parameters<typeof useForm<T>>
): UseFormReturn<T>;
//    ↓ Registry stores:
//    ↓
// Map<string, UseFormReturn<FormData>>
//    ↓ Devtools sees:
//    ↓
// Properly typed form instance
```

### Type Safety Benefits

1. **Autocomplete**: IDE suggests field names
2. **Error Detection**: Invalid field access caught at compile time
3. **Refactoring**: Rename fields safely
4. **Documentation**: Types serve as docs

## Extension Points

### 1. Add New Data

Extract more information in the plugin:

```typescript
getInstanceData: (instance) => ({
  // Existing
  values: instance.getValues(),
  errors: instance.formState.errors,

  // New additions
  fieldCount: Object.keys(instance.control._fields).length,
  watchedFields: instance.control._names.watch,
  validators: extractValidators(instance),
});
```

### 2. Add Actions

Allow modifying forms from devtools:

```typescript
function FormDevtoolsPanel() {
  const handleReset = (form: UseFormReturn) => {
    form.reset();
  };

  const handleSetValue = (form: UseFormReturn, field: string, value: any) => {
    form.setValue(field, value);
  };

  return (
    <div>
      <button onClick={() => handleReset(form)}>Reset</button>
      <button onClick={() => handleSetValue(form, "name", "Test")}>
        Set Test Value
      </button>
    </div>
  );
}
```

### 3. Add Filtering

Filter forms by state:

```typescript
function FormDevtoolsPanel() {
  const [filter, setFilter] = useState<"all" | "dirty" | "invalid">("all");

  const filteredForms = forms.filter(([id, form]) => {
    if (filter === "dirty") return form.formState.isDirty;
    if (filter === "invalid") return !form.formState.isValid;
    return true;
  });

  return <div>{/* Render filteredForms */}</div>;
}
```

### 4. Add History

Track form state over time:

```typescript
const historyStore = new Map<
  string,
  Array<{
    timestamp: number;
    values: any;
    errors: any;
  }>
>();

function recordHistory(formId: string, form: UseFormReturn) {
  if (!historyStore.has(formId)) {
    historyStore.set(formId, []);
  }

  historyStore.get(formId)!.push({
    timestamp: Date.now(),
    values: form.getValues(),
    errors: form.formState.errors,
  });
}
```

## Testing Strategy

### Unit Tests

Test individual components:

```typescript
describe("registerForm", () => {
  it("adds form to registry", () => {
    const form = createMockForm();
    registerForm("test-id", form);

    expect(getRegisteredForms()).toContainEqual(["test-id", form]);
  });

  it("returns cleanup function", () => {
    const form = createMockForm();
    const cleanup = registerForm("test-id", form);

    cleanup();

    expect(getRegisteredForms()).not.toContainEqual(["test-id", form]);
  });
});
```

### Integration Tests

Test hook integration:

```typescript
describe("useFormWithDevtools", () => {
  it("registers form on mount", () => {
    const { result } = renderHook(() => useFormWithDevtools());

    expect(getRegisteredForms()).toHaveLength(1);
  });

  it("unregisters form on unmount", () => {
    const { unmount } = renderHook(() => useFormWithDevtools());

    unmount();

    expect(getRegisteredForms()).toHaveLength(0);
  });
});
```

### E2E Tests

Test full flow:

```typescript
test("form state updates in devtools", async () => {
  render(<App />);

  // Open devtools
  await userEvent.click(screen.getByLabelText("Open devtools"));

  // Fill form
  await userEvent.type(screen.getByLabelText("Name"), "John");

  // Check devtools shows update
  expect(screen.getByText(/"name": "John"/)).toBeInTheDocument();
});
```

## Security Considerations

1. **Production**: Remove or disable in production builds
2. **Sensitive Data**: Be careful with passwords, tokens, etc.
3. **Performance**: Monitor impact on app performance
4. **Privacy**: Don't send data to external services

## Future Enhancements

1. **Persistence**: Save/load form state
2. **Export**: Export state as JSON
3. **Import**: Load state from JSON
4. **Comparison**: Compare multiple forms
5. **Metrics**: Track submission success rate
6. **Profiling**: Measure render performance
7. **Snapshots**: Take state snapshots
8. **Replay**: Replay user interactions

---

This architecture provides a solid foundation for devtools that can be extended and customized based on your specific needs.
