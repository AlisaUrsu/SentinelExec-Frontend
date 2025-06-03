"use client";

import { getUser, logout } from "@/services/service";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { UserDto } from "@/responses/user-dto";

export default function NavBar() {
    const router = useRouter();
    const [user, setUser] = useState<UserDto | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }

        fetchUser();
    }, []);

    function handleLogout() {
        logout();
        router.push("/auth/login");
    }

    function handleAnalyze() {
        router.push("/analyze");
    }

    function handleExecutables() {
        router.push("/")
    }

    function handleDashboard() {
        router.push("/dashboard")
    }


    return (
        <div className="shadow-md shadow-neutral-950">
        <NavigationMenu className="flex max-w-full items-center justify-between p-4 h-16 bg-black ">
            <NavigationMenuList className="flex items-center space-x-6 text-gray-300 animate-in fade-in">
                <NavigationMenuItem>
                    <img src="/logo.png" alt="logo" className="h-16 mt-2 cursor-pointer"/>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button className="bg-transparent hover:text-primary " onClick={handleDashboard}>
                        Dashboard
                    </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <button className="bg-transparent hover:text-primary" onClick={handleExecutables}>
                        Executables
                    </button>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList className="flex items-center space-x-4  justify-end pr-2">
                <NavigationMenuItem>
                    <Button  onClick={handleAnalyze}>
                        Scan File
                    </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Avatar className="rounded-full w-12 h-12 cursor-pointer">
                            <AvatarImage src={user?.profilePicture ? `data:image/webp;base64,${user.profilePicture}` : undefined}/>
                            <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={handleDashboard}>Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
        </div>
    )
}