'use client';

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
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../ui/alert"
import { RegistrationUserDto } from "@/responses/registration-user-dto";
import { signup } from "@/services/service";

export const iframeHeight = "600px"

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4"

const signUpSchema = z.object({
    username: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
});

type SignUpFormData = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
    onNext: (username: string, email: string, password: string) => void;
}

export default function SignUpForm({ onNext }: SignUpFormProps) {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignUpFormData) => {
        clearErrors();
        const registerRequest: RegistrationUserDto = {
            username: values.username,
            email: values.email,
            password: values.password,
        };
        
        try {
            const success = await signup(registerRequest);
            if(success) {
                onNext(values.username, values.email, values.password);
            }
            
        } catch (err: any) {
            setError("root", {message: err.message}); 
        }
    };
    
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          You're one step away!
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                
                    <div className="grid gap-4">
                        <Label htmlFor="username" className="mt-2 -mb-2">Username</Label>
                        <Input {...register("username")} id="username" type="username" required onChange={() => clearErrors("root")} />
                        {errors.username && (
                            <Alert variant="destructive" className="text-center">
                                {errors.username.message}
                            </Alert>
                        )}
                    </div>
                    <div className="grid gap-4">
                        <Label htmlFor="email" className="mt-4 -mb-2">Email</Label>
                        <Input {...register("email")} id="email" type="email" placeholder="m@example.com" required onChange={() => clearErrors("root")} />
                        {errors.email && (
                            <Alert variant="destructive" className="text-center">
                                {errors.email.message}
                            </Alert>
                        )}
                    </div>
                    <div className="grid gap-4">
                        <Label htmlFor="password" className="mt-4 -mb-2">Password</Label>
                        <Input {...register("password")} id="password" type="password" required onChange={() => clearErrors("root")} />
                        {errors.password && (
                            <Alert variant="destructive" className="text-start text-sm text-red-600">
                                {errors.password.message}
                            </Alert>
                        )}
                    </div>
                    <Button className="w-full mt-6  " type="submit" disabled={isSubmitting}> {isSubmitting ? "Loading..." : "Create Account"}</Button>
                    {errors.root && (
                    <Alert variant="destructive" className="text-start text-sm text-red-600">
                        {errors.root.message}
                    </Alert>
                    )}
                
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline">
                    Sign in
                    </Link>
                </div>
            </CardContent>
        </form>
    </Card>
  )
}
