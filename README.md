# React Hook Form Devtools

A custom devtools implementation for React Hook Form built on TanStack Devtools infrastructure. This project demonstrates how to create your own devtools plugin for any library using TanStack's extensible devtools platform.

## ✨ Features

- 🔍 **Real-time Form Inspection** - Monitor form state, values, and errors as they change
- 📊 **Multiple Forms Support** - Track and inspect multiple form instances simultaneously
- 🎯 **Type-Safe** - Full TypeScript support with type inference
- 🚀 **Easy Integration** - Drop-in replacement for `useForm` with automatic devtools registration
- 🎨 **Beautiful UI** - Clean, modern interface built with Tailwind CSS
- 📦 **Production Ready** - Based on TanStack's proven devtools architecture

## Stack

- **TypeScript** - For type safety and improved developer experience
- **React 19** - Latest React with concurrent features
- **TanStack Start** - SSR framework with TanStack Router
- **TanStack Devtools** - Extensible devtools infrastructure
- **React Hook Form** - Performant form management
- **TailwindCSS 4** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Turborepo** - Optimized monorepo build system
- **Bun** - Fast JavaScript runtime and package manager

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd react-hook-form-devtools
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Try It Out

1. Fill out the example form on the home page
2. Click the TanStack logo in the bottom-right corner to open devtools
3. Navigate to the "React Hook Form" tab
4. Watch the form state update in real-time as you interact with the form!

## 📖 Usage

### Basic Setup

1. **Add the devtools to your app root:**

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactHookFormDevtoolsPlugin } from "@/devtools";

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

2. **Use the enhanced hook in your forms:**

```tsx
import { useFormWithDevtools } from "@/devtools";

function MyForm() {
  const form = useFormWithDevtools({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("name")} />
      <input {...form.register("email")} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

That's it! Your forms will now appear in the devtools automatically.

## 📚 Documentation

For detailed documentation on creating your own devtools and using the React Hook Form devtools, see:

- [Devtools Documentation](./apps/web/src/devtools/README.md) - Complete guide to the devtools implementation
- [TanStack Devtools Docs](https://tanstack.com/devtools/latest) - Official TanStack Devtools documentation
- [React Hook Form Docs](https://react-hook-form.com/) - React Hook Form documentation







## 📁 Project Structure

```
react-hook-form-devtools/
├── apps/
│   └── web/                          # Frontend application
│       └── src/
│           ├── devtools/             # Custom devtools implementation
│           │   ├── react-hook-form-plugin.tsx  # Main devtools plugin
│           │   ├── use-form-with-devtools.ts   # Enhanced useForm hook
│           │   ├── index.ts          # Public API exports
│           │   └── README.md         # Detailed devtools documentation
│           ├── components/           # React components
│           │   ├── ui/              # shadcn/ui components
│           │   └── header.tsx
│           └── routes/              # TanStack Router routes
│               ├── __root.tsx       # Root layout with devtools
│               └── index.tsx        # Example form page
├── packages/
│   └── config/                      # Shared configuration
└── README.md                        # This file
```

## 🛠️ Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build for production
- `bun run serve` - Preview production build
- `bun run check-types` - Check TypeScript types

## 🎯 Creating Your Own Devtools

This project serves as a complete example of how to create custom devtools for any library using TanStack Devtools. The key concepts are:

### 1. Create a Plugin

Define a plugin that tells TanStack Devtools how to extract and display data:

```tsx
export function MyLibraryDevtoolsPlugin(): DevtoolsPlugin {
  return {
    id: "my-library",
    name: "My Library",
    devtools: {
      getInstanceKey: (instance) => /* unique key */,
      getInstanceLabel: (instance) => /* display label */,
      getInstanceData: (instance) => /* data to show */,
    },
    panelComponent: MyCustomPanel,
  };
}
```

### 2. Create a Registration System

Build a way to track instances of your library:

```tsx
const registry = new Map();

export function registerInstance(id: string, instance: any) {
  registry.set(id, instance);
  return () => registry.delete(id);
}
```

### 3. Create Helper Hooks

Make it easy for users to opt-in to devtools:

```tsx
export function useMyLibraryWithDevtools(...args) {
  const instance = useMyLibrary(...args);
  const id = useId();

  useEffect(() => {
    return registerInstance(id, instance);
  }, [id, instance]);

  return instance;
}
```

### 4. Build Custom UI

Create a React component to display your data in the devtools panel.

For a complete, working example, see the [devtools implementation](./apps/web/src/devtools/).

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT

## 🙏 Acknowledgments

- [TanStack](https://tanstack.com/) - For the amazing devtools infrastructure
- [React Hook Form](https://react-hook-form.com/) - For excellent form management
- [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) - For the project boilerplate

## 🔗 Resources

- [Live Demo](#) - Coming soon
- [TanStack Devtools](https://tanstack.com/devtools/latest)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Router](https://tanstack.com/router/latest)

---

**Built with ❤️ as an example of TanStack Devtools extensibility**
