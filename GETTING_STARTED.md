# Getting Started with Your Custom Devtools

Welcome! You now have a fully functional example of custom devtools built with TanStack Devtools infrastructure. Here's everything you need to know to get started.

## 🎯 What You Have

A complete implementation of React Hook Form devtools that demonstrates:

- ✅ Custom devtools plugin creation
- ✅ Real-time state inspection
- ✅ Multiple instance tracking
- ✅ Type-safe implementation
- ✅ Beautiful UI with Tailwind CSS
- ✅ Production-ready architecture

## 🚦 Getting Started in 3 Steps

### Step 1: Run the Project

```bash
bun run dev
```

Open http://localhost:3000 in your browser.

### Step 2: Try the Example

1. Fill out the form on the home page
2. Click the TanStack logo (bottom-right corner)
3. Click "React Hook Form" tab
4. Watch the form state update in real-time!

### Step 3: Explore the Code

The main files to understand:

```
apps/web/src/devtools/
├── react-hook-form-plugin.tsx   ← Start here! Main plugin
├── use-form-with-devtools.ts    ← Enhanced hook
└── README.md                     ← Detailed documentation
```

## 📚 Key Files Explained

### 1. `react-hook-form-plugin.tsx` (Main Plugin)

This is the heart of the devtools. It contains:

**Registry System:**

```tsx
const formRegistry = new Map<string, UseFormReturn<any>>();

export function registerForm(formId: string, form: UseFormReturn) {
  formRegistry.set(formId, form);
  return () => formRegistry.delete(formId);
}
```

**Plugin Definition:**

```tsx
export function ReactHookFormDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "react-hook-form",
    name: "React Hook Form",
    devtools: {
      /* ... */
    },
    panelComponent: FormDevtoolsPanel,
  };
}
```

**Custom Panel UI:**

- Shows list of all registered forms
- Displays form state (isDirty, isValid, etc.)
- Shows current values
- Shows validation errors

### 2. `use-form-with-devtools.ts` (Enhanced Hook)

A wrapper around React Hook Form's `useForm` that automatically registers with devtools:

```tsx
export function useFormWithDevtools<T>(...args) {
  const form = useForm<T>(...args);
  const formId = useId();

  useEffect(() => {
    const cleanup = registerForm(formId, form);
    return cleanup;
  }, [formId, form]);

  return form;
}
```

**Usage is identical to `useForm`:**

```tsx
// Before:
const form = useForm({
  /* ... */
});

// After:
const form = useFormWithDevtools({
  /* ... */
});
```

### 3. `routes/__root.tsx` (Integration Point)

Where the devtools are added to your app:

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactHookFormDevtoolsPlugin } from "@/devtools/react-hook-form-plugin";

function RootDocument() {
  return (
    <html>
      <body>
        {/* Your app */}
        <TanStackDevtools
          position="bottom-right"
          plugins={[ReactHookFormDevtoolsPlugin()]}
        />
      </body>
    </html>
  );
}
```

### 4. `routes/index.tsx` (Example Usage)

A complete example form showing:

- Form with validation rules
- Multiple field types (text, email, number)
- Error display
- Submit handling
- Integration with devtools

## 🔑 Core Concepts

### 1. Plugin Architecture

TanStack Devtools uses a plugin system. Each plugin provides:

- **ID**: Unique identifier
- **Name**: Display name in UI
- **Devtools Interface**: Functions to extract data from instances
- **Panel Component**: Custom React component to display the data

### 2. Instance Registry

Your plugin needs to track instances of your library:

- Use a `Map` or similar structure
- Register instances when they're created
- Clean up when they're destroyed
- Provide a way to retrieve all instances

### 3. Enhanced Hooks

Make it easy for users by wrapping their library hooks:

- Call the original hook
- Register the instance automatically
- Return the same interface
- Clean up on unmount

### 4. Custom Panel UI

Build a React component to display your data:

- Poll or subscribe to instance updates
- Show relevant information clearly
- Provide interactive controls if needed
- Use good UX practices

## 🎨 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│  Your App                                           │
│                                                     │
│  ┌────────────────────────────────────────┐        │
│  │  useFormWithDevtools()                 │        │
│  │  ↓                                      │        │
│  │  1. Creates form instance               │        │
│  │  2. Registers with registry             │        │
│  │  3. Returns form instance               │        │
│  └────────────────────────────────────────┘        │
│                     ↓                               │
│  ┌────────────────────────────────────────┐        │
│  │  Form Registry (Map)                   │        │
│  │  - formId1 → form1                     │        │
│  │  - formId2 → form2                     │        │
│  │  - formId3 → form3                     │        │
│  └────────────────────────────────────────┘        │
│                     ↑                               │
│  ┌────────────────────────────────────────┐        │
│  │  TanStack Devtools                     │        │
│  │  ┌──────────────────────────────────┐  │        │
│  │  │  React Hook Form Plugin          │  │        │
│  │  │  - Reads from registry           │  │        │
│  │  │  - Extracts form state           │  │        │
│  │  │  - Displays in custom panel      │  │        │
│  │  └──────────────────────────────────┘  │        │
│  └────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

## 📖 Documentation Guide

We've created three levels of documentation:

### 1. README.md (Project Overview)

- High-level overview
- Quick start instructions
- Feature list
- Basic usage examples

### 2. QUICKSTART.md (Step-by-Step Tutorial)

- Detailed walkthrough
- Creating your own devtools
- Code examples for different libraries
- Best practices and patterns

### 3. apps/web/src/devtools/README.md (API Reference)

- Complete API documentation
- All exported functions and types
- Advanced usage
- Troubleshooting

## 🛠️ Customization Ideas

### For React Hook Form Devtools:

1. **Add Actions**

   - Reset form from devtools
   - Set field values
   - Trigger validation
   - Clear errors

2. **Enhance Display**

   - Show field-level detail
   - Display validation schemas
   - Show submission history
   - Add performance metrics

3. **Add Filters**

   - Filter by form state (dirty, valid, etc.)
   - Search by field name
   - Show only forms with errors

4. **Time Travel**
   - Record form state history
   - Allow replaying interactions
   - Show state diffs

### For Your Own Library:

Use this as a template and adapt it:

- Replace form registry with your instance tracker
- Update data extraction in `getInstanceData`
- Customize the panel UI for your needs
- Add library-specific features

## 🎓 Learning Path

### Beginner

1. Run the project and try the example
2. Read `react-hook-form-plugin.tsx` to understand the structure
3. Modify the panel UI (colors, layout, etc.)
4. Add a new field to display in the devtools

### Intermediate

1. Create devtools for a simple library (like a counter)
2. Implement event-based updates instead of polling
3. Add actions to modify state from devtools
4. Add multiple view modes (list vs detail)

### Advanced

1. Create devtools for a complex state management library
2. Add time-travel debugging
3. Implement state export/import
4. Add performance profiling
5. Create a plugin SDK for others to extend

## 🚀 Next Steps

### Option 1: Customize for React Hook Form

Enhance the existing devtools with new features:

```bash
# Edit apps/web/src/devtools/react-hook-form-plugin.tsx
```

### Option 2: Create Devtools for Another Library

Use this as a template:

```bash
# Copy apps/web/src/devtools/ to a new directory
# Adapt it for your library
```

### Option 3: Learn by Doing

Try these exercises:

1. Add a "Clear All Forms" button
2. Show form submission count
3. Add ability to export form values as JSON
4. Create a search/filter feature

## 💡 Tips

### Development

- Use React DevTools alongside TanStack Devtools
- Keep the console open for error messages
- Hot reload works - changes appear immediately

### Debugging

- Add `console.log` in the panel component to debug
- Check the registry to see what's registered
- Verify the plugin is in the plugins array

### Performance

- Current implementation polls every 500ms
- For production, use event-based updates
- Only extract data you actually display

## 📦 Deployment

### Development Build

```bash
bun run dev
```

### Production Build

```bash
bun run build
bun run serve
```

### Conditional Devtools

Only include in development:

```tsx
{
  process.env.NODE_ENV === "development" && (
    <TanStackDevtools plugins={[ReactHookFormDevtoolsPlugin()]} />
  );
}
```

## 🤔 FAQ

**Q: Can I use this with other React Hook Form devtools?**
A: Yes! This is independent and can coexist with other devtools.

**Q: Does this work with SSR/SSG?**
A: Yes, but devtools should only render on the client side.

**Q: Can I create devtools for non-React libraries?**
A: TanStack Devtools has adapters for other frameworks (Vue, Solid, etc.)

**Q: Is this production-ready?**
A: The architecture is solid, but you should add error boundaries and optimize polling.

**Q: Can I publish this as an npm package?**
A: Yes! Just extract the devtools directory and add a package.json.

## 📚 Additional Resources

- [TanStack Devtools Documentation](https://tanstack.com/devtools/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🎉 You're Ready!

You now have:

- ✅ Working example of custom devtools
- ✅ Understanding of the architecture
- ✅ Template to create your own
- ✅ Comprehensive documentation

**Start exploring and building your own devtools!**

---

Need help? Check out:

- `apps/web/src/devtools/README.md` - Detailed API docs
- `QUICKSTART.md` - Step-by-step tutorial
- `README.md` - Project overview

Happy coding! 🚀
