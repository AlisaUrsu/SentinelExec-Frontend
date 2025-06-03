"use client";

import SignUpForm from "@/components/authentication/sign-up-form";
import { signup } from "@/services/service";
import { useRouter } from "next/navigation";


export default function SignUpPage() {
    const router = useRouter();
    const handleNext =  () => {
  
      router.push(`/auth/verify`);
    
  };
    return (
        <div className="relative min-h-screen overflow-hidden">
     
      
        <div className="flex min-h-screen">

            <div className="flex-1 flex flex-col justify-center items-center text-white p-8">
                <h1 className="text-7xl font-semibold mb-4 font-skateblade">SentinelExec</h1>
                <p className="text-lg text-center ">
                    Sign up to unlock exclusive features, enjoy personalized content, and connect with a vibrant community!
                </p>
            
            </div>


            <div className="flex-1 flex justify-center items-center ">
                <SignUpForm onNext={handleNext} />
            </div>
        </div>
        </div>
    );
}