import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginRequest } from "@/responses/login-request"
import { login } from "@/services/service"
import { Alert } from "../ui/alert"

export const iframeHeight = "600px"

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4"

type LoginFormData = z.infer<typeof loginSchema>;


const loginSchema = z.object({
    username: z.string(),
    password: z.string()
});

interface LoginFormProps {
    onLoginSuccess: () => void;
}


export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormData) => {
        clearErrors();
        const loginRequest: LoginRequest = {
            username: values.username,
            password: values.password,
        };

        try {
            const success = await login(loginRequest);
            if (success) {
                onLoginSuccess();
            } else {
                setError("root", { message: "Invalid username or password" });
            }
        } catch (err) {
                setError("root", {
                message: "Invalid username or password.",
            });
            console.error(err);
        }
    }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
            <div className="grid gap-4">
                <Label htmlFor="username" className="mt-2 -mb-2">Username</Label>
                <Input {...register("username")} id="username" type="text" required onChange={() => clearErrors("root")} />
                {errors.username && (
                    <Alert variant="destructive" className="text-center">
                        {errors.username.message}
                    </Alert>
                )}
            </div>
            <div className="grid gap-4">
                <Label htmlFor="password" className="mt-4 -mb-2">Password</Label>
                <Input {...register("password")} id="password" type="password" required onChange={() => clearErrors("root")} />
                {errors.password && (
                    <Alert variant="destructive" className="text-center">
                        {errors.password.message}
                    </Alert>
                )}
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isSubmitting}> {isSubmitting ? "Loading..." : "Login"}</Button>
            {errors.root && (
                <Alert variant="destructive" className="text-center border-none text-red-600 -mb-6">
                    {errors.root.message}
                </Alert>
            )}

            <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
                Sign up
            </Link>
            </div>
        </CardContent>
        </form>
    </Card>
  )
}
