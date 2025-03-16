'use client';
import { CircleUserIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Define the User type based on the Prisma schema
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  createdAt: Date;
}

const UserButton = ({user}:{user:User |null }) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full h-8 w-8">
          {user?.profileImage ? (
            <Image 
              src={user.profileImage} 
              alt="user" 
              className="rounded-full h-8 w-8 object-cover" 
              width={32} 
              height={32}
            />
          ) : (
            <CircleUserIcon className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <LogOutIcon className="h-4 w-4" /> 
          <SignOutButton />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton; 