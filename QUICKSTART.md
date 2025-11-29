# React Hook Form DevTools - Quick Start Guide

## What Was Built

A minimal React Hook Form devtools panel that integrates with TanStack DevTools to provide real-time form state monitoring.

## Features

✅ **Real-time Form State Monitoring** - See form values, errors, and state as you type
✅ **Multiple Forms Support** - Monitor multiple forms simultaneously with a dropdown selector
✅ **Visual Status Indicators** - Color-coded badges for dirty/pristine, valid/invalid, submitting states
✅ **Error Display** - View validation errors with proper formatting
✅ **Field Tracking** - See which fields are touched and dirty
✅ **Extensible Architecture** - Easy to add new features later

## Quick Start

### 1. Start the Development Server

```bash
cd apps/web
bun run dev
```

### 2. Open the App

Navigate to `http://localhost:3001` in your browser.

### 3. Open DevTools

Look for the floating DevTools button in the bottom-right corner of the screen. Click it to open the panel and select "React Hook Form" from the plugin tabs.

### 4. Try the Demo Form

The homepage includes a demo form with three fields:
- **Username** (min 3 characters)
- **Email** (valid email format)
- **Password** (min 8 characters)

As you type, watch the DevTools panel update in real-time!

## How to Use in Your Own Forms

### Step 1: Import the Component

```tsx
import { RHFDevtools } from '@/lib/rhf-devtools'
```

### Step 2: Register Your Form

```tsx
function MyForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  })

  return (
    <FormProvider {...form}>
      <RHFDevtools formId="my-unique-form-id" />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Your form fields */}
      </form>
    </FormProvider>
  )
}
```

That's it! Your form will now appear in the DevTools panel.

## Project Structure

```
apps/web/src/lib/rhf-devtools/
├── eventClient.ts        # Event bus for communication
├── devtools-panel.tsx    # The UI panel component
├── rhf-devtools.ts       # Component to register forms
├── index.ts              # Exports
└── README.md             # Detailed documentation
```

## What's Monitored

The DevTools panel shows:

1. **Form Selection** - Dropdown to switch between registered forms
2. **State Badges** - Visual indicators for:
   - Dirty/Pristine state
   - Valid/Invalid state
   - Submitting/Ready state
3. **Values** - Current form values in JSON format
4. **Errors** - Validation errors (if any)
5. **Touched Fields** - Which fields the user has interacted with
6. **Dirty Fields** - Which fields have been modified

## Extension Points

The architecture is built to be extensible. See `DEVTOOLS_IMPLEMENTATION.md` for detailed information on:

- Adding custom events
- Enhancing the panel UI
- Creating additional hooks
- Future enhancement ideas like:
  - Time-travel debugging
  - Performance monitoring
  - Field history
  - State snapshots

## Files Modified

- `apps/web/src/routes/__root.tsx` - Integrated TanStackDevtools
- `apps/web/src/routes/index.tsx` - Added demo form
- `apps/web/package.json` - Added devtools dependencies

## Files Created

- `apps/web/src/lib/rhf-devtools/eventClient.ts`
- `apps/web/src/lib/rhf-devtools/devtools-panel.tsx`
- `apps/web/src/lib/rhf-devtools/rhf-devtools.ts`
- `apps/web/src/lib/rhf-devtools/index.ts`
- `apps/web/src/lib/rhf-devtools/README.md`

## Dependencies Installed

```bash
bun add @tanstack/devtools-event-client @tanstack/react-devtools
```

## Next Steps

1. **Try the demo** - Interact with the form and watch the devtools
2. **Register your own forms** - Add `RHFDevtools` component to your forms
3. **Customize the panel** - Modify `devtools-panel.tsx` to add features
4. **Extend functionality** - See the README for extension ideas

## Troubleshooting

### DevTools Not Showing

- Make sure you're running in development mode
- Check that `TanStackDevtools` is rendered in your root component
- Ensure you've added `RHFDevtools` component inside your form

### Form Not Appearing in DevTools

- Verify you've added `<RHFDevtools formId="unique-id" />` inside your form component
- Make sure the form ID is unique
- Check browser console for any errors

### State Not Updating

- Ensure you're using React Hook Form's `useForm` hook
- Check that the form is properly registered with `form.register()`
- Verify the devtools panel is open and the correct form is selected

## Learn More

- See `apps/web/src/lib/rhf-devtools/README.md` for API documentation
- See `DEVTOOLS_IMPLEMENTATION.md` for architecture details
- Check out the TanStack DevTools example in the `TanStack devtools...` folder

---

**Enjoy your new React Hook Form DevTools! 🎉**

