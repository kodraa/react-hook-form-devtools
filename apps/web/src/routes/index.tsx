import { createFileRoute } from "@tanstack/react-router";
import { useFieldArray, useForm } from "react-hook-form";
import { RHFDevtools } from "@nourkodra/react-hook-form-devtools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

type FormData = {
  username: string;
  email: string;
  password: string;
  age: number;
  doubleAge: number;
};

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number(),
  doubleAge: z.number(),
  things: z.array(
    z.object({
      thingName: z.string(),
      thingLength: z.number(),
    })
  ),
});

type Values = z.infer<typeof schema>;

function HomeComponent() {
  const form = useForm<Values>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "things",
  });

  const onSubmit = (data: FormData) => {
    toast.success("Form submitted successfully!");
    console.log(data);
  };

  return (
    <Form {...form}>
      <div className="container mx-auto max-w-3xl px-4 py-2">
        <RHFDevtools formId="example-form" />
        <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
        <div className="grid gap-6">
          <section className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-medium">
              React Hook Form DevTools Demo
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Open the DevTools panel (bottom-right) to see the form state in
              real-time!
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  placeholder="Enter username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Enter password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>

              {/* useFieldArray implementation here, with appending and removing */}

              <div className="grid gap-2">
                <Label htmlFor="things">Things</Label>
                {fieldArray.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    {/* <Input
                      id={field.id}
                      {...form.register(`things.${index}.thingName`)}
                    /> */}
                    <FormField
                      control={form.control}
                      name={`things.${index}.thingName`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue(
                              `things.${index}.thingLength`,
                              e.target.value.length || 0
                            );
                          }}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fieldArray.remove(0)}
                    >
                      Remove Thing
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fieldArray.append({ thingName: "", thingLength: 0 })
                  }
                >
                  Add Thing
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </Form>
  );
}
