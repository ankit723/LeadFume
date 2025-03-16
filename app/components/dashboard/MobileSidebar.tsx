'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DashboardItems from "./dashboardItems";
import logo from "@/public/logo.png";

const MobileSidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="mr-1 md:mr-2 h-8 w-8">
                    <MenuIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <div className="flex h-full flex-col">
                    <SheetHeader className="border-b px-4 h-14 flex items-center">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold h-6">
                            <Image src={logo} alt="logo" className="" width={150} height={150}/>
                        </Link>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto">
                        <nav className="grid items-start text-sm font-medium">
                            <DashboardItems onItemClick={() => setOpen(false)} />
                        </nav>
                    </div>
                    {/* Mobile Action Buttons */}
                    <div className="border-t p-4 space-y-3 md:hidden">
                        <Link href={'/pricing'} className="w-full block" onClick={() => setOpen(false)}>
                            <Button variant="secondary" className="w-full bg-primary/80 cursor-pointer hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25">
                                Upgrade To Pro
                            </Button>
                        </Link>
                        <Button 
                            variant="secondary" 
                            className="w-full relative bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-medium flex items-center justify-center gap-2"
                        >
                            <span className="animate-pulse">
                                <SendIcon className="h-4 w-4" />
                            </span>
                            Run AI Prompt
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar; 