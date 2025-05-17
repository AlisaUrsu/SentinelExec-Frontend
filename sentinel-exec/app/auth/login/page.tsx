
"use client"


import LoginForm from "@/components/authentication/login-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const handleLoginSuccess = () => {
        router.push("/");

    };

    return (
        <>
        <div className="relative min-h-screen overflow-hidden">
      {/* Background Shader */}
      
        <div className="w-full h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md flex flex-col items-center space-y-4">
                <div className="w-full  p-6  text-center">
                    <h1 className="text-6xl font-bold text-white font-skateblade">SentinelExec</h1>
                </div>
                <div className="w-full  py-6 pl-10 animate-in fade-in">
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                </div>
            </div>
        </div>
        </div>
    </>
    );
}