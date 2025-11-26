import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormWithDevtools } from "@/devtools/use-form-with-devtools";
import { toast } from "sonner";

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

interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	age: string;
}

function HomeComponent() {
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isSubmitting },
		reset,
	} = useFormWithDevtools<FormData>({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			age: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: FormData) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		console.log("Form submitted:", data);
		toast.success("Form submitted successfully!");
	};

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<pre className="mb-8 overflow-x-auto font-mono text-xs opacity-50">
				{TITLE_TEXT}
			</pre>

			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold">
					React Hook Form + TanStack Devtools
				</h1>
				<p className="text-muted-foreground">
					Open the devtools panel in the bottom-right corner to inspect form
					state in real-time.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Example Form</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									{...register("firstName", {
										required: "First name is required",
										minLength: {
											value: 2,
											message: "Must be at least 2 characters",
										},
									})}
									placeholder="John"
								/>
								{errors.firstName && (
									<p className="text-sm text-destructive">
										{errors.firstName.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									{...register("lastName", {
										required: "Last name is required",
										minLength: {
											value: 2,
											message: "Must be at least 2 characters",
										},
									})}
									placeholder="Doe"
								/>
								{errors.lastName && (
									<p className="text-sm text-destructive">
										{errors.lastName.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
									placeholder="john.doe@example.com"
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="age">Age</Label>
								<Input
									id="age"
									type="number"
									{...register("age", {
										required: "Age is required",
										min: {
											value: 18,
											message: "Must be at least 18 years old",
										},
										max: {
											value: 120,
											message: "Must be less than 120 years old",
										},
									})}
									placeholder="25"
								/>
								{errors.age && (
									<p className="text-sm text-destructive">
										{errors.age.message}
									</p>
								)}
							</div>

							<div className="flex gap-2">
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "Submitting..." : "Submit"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => reset()}
									disabled={!isDirty}
								>
									Reset
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Instructions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h3 className="mb-2 font-semibold">How to use:</h3>
							<ol className="list-decimal space-y-1 pl-5 text-sm">
								<li>Fill out the form fields</li>
								<li>
									Open the devtools panel (bottom-right corner with TanStack
									logo)
								</li>
								<li>Click on "React Hook Form" in the devtools</li>
								<li>
									Watch the form state update in real-time as you type and
									interact
								</li>
							</ol>
						</div>

						<div>
							<h3 className="mb-2 font-semibold">Features:</h3>
							<ul className="list-disc space-y-1 pl-5 text-sm">
								<li>Real-time form state inspection</li>
								<li>Live validation errors display</li>
								<li>Form values tracking</li>
								<li>Dirty/touched fields monitoring</li>
								<li>Submit state tracking</li>
							</ul>
						</div>

						<div className="rounded-lg bg-muted p-3">
							<h3 className="mb-2 font-semibold text-sm">
								Using in your code:
							</h3>
							<pre className="overflow-x-auto text-xs">
								{`import { useFormWithDevtools } from '@/devtools/use-form-with-devtools';

const form = useFormWithDevtools({
  defaultValues: { ... }
});`}
							</pre>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
