'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AdminItems from "./adminItems";
import logo from "@/public/logo.png";

const AdminMobileSidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="mr-1 md:mr-2 h-8 w-8 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                    <MenuIcon className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <span className="sr-only">Toggle Admin Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 border-r-amber-200 dark:border-r-amber-800">
                <div className="flex h-full flex-col">
                    <SheetHeader className="border-b border-amber-200 dark:border-amber-800/30 px-4 h-14 flex items-center">
                        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold h-6">
                            <Image src={logo} alt="logo" className="" width={150} height={150}/>
                        </Link>
                    </SheetHeader>
                    <div className="px-4 py-3">
                        <div className="flex items-center gap-2 rounded-md bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/30 px-3 py-2.5 text-sm text-amber-900 dark:text-amber-300 shadow-sm">
                            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="font-medium">Admin Area</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <nav className="grid items-start text-sm font-medium">
                            <AdminItems onItemClick={() => setOpen(false)} />
                        </nav>
                    </div>
                    {/* Mobile Action Buttons */}
                    <div className="border-t border-amber-200 dark:border-amber-800/30 p-4 space-y-3 md:hidden">
                        <Button 
                            variant="secondary" 
                            className="w-full relative bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-600 dark:hover:from-amber-500 dark:hover:to-yellow-500 font-medium flex items-center justify-center gap-3 py-2.5"
                            onClick={() => setOpen(false)}
                        >
                            <Shield className="h-4 w-4" />
                            Admin Controls
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AdminMobileSidebar; 