'use client';
import React, { useState, useEffect } from 'react';
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getUser, updateUser, uploadImage } from "@/app/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

// We can't export metadata from client components
// Remove this or move it to a layout file
// export const metadata: Metadata = {
//   title: "Account Settings | Leadfume",
//   description: "Manage your Leadfume account settings and preferences.",
// };

// Define schema for form validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  profileImage: z.string().optional(),
});

// Define User type based on our schema
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  creditsAvailable: number;
  subscription?: any;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Initialize form with default empty values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      profileImage: "",
    },
  });

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUser();
        if (userData) {
          setUser(userData as User);
          setProfileImage(userData.profileImage || null);
          
          // Set form values from user data
          form.reset({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            phone: userData.phone || "",
            dateOfBirth: userData.dateOfBirth || "",
            gender: userData.gender || "",
            profileImage: userData.profileImage || "",
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("Failed to load your profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  // Handle profile image change
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          setProfileImage(reader.result);
          form.setValue('profileImage', reader.result);
        }
      };
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error("Failed to process image. Please try again with another image.");
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Handle image upload if the image has changed
      let profileImageUrl = values.profileImage;
      if (profileImage && profileImage !== user.profileImage && profileImage.includes('base64')) {
        const result = await uploadImage(profileImage);
        if (!result.success) {
          toast.error(`Failed to upload image: ${result.error}`);
          return;
        }
        profileImageUrl = result.url;
      }
      
      // Update user profile
      const updatedUser = await updateUser(user.id, {
        ...values,
        profileImage: profileImageUrl,
        email: user.email, // Keep the existing email
      });
      
      if (updatedUser) {
        toast.success("Your profile has been updated successfully.");
        
        // Update local user state with new data
        setUser({
          ...user,
          ...updatedUser as User,
        });
        
        // Refresh to show updated data
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings and manage your profile information.
        </p>
      </div>
      <Separator />
      
      {isLoading && !user ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-24 w-24">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full object-cover border-2 border-primary/20"
                  fill
                  sizes="96px"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl text-primary font-semibold">
                  {form.getValues("firstName")?.charAt(0) || ""}{form.getValues("lastName")?.charAt(0) || ""}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="profile-image" className="cursor-pointer bg-primary text-white px-3 py-2 rounded-md hover:bg-primary/90 transition">
                Change Image
              </Label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="your.email@example.com"
                disabled
                defaultValue={user?.email || ""}
              />
              <p className="text-xs text-muted-foreground">
                Your email is managed by your authentication provider and cannot be changed here.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  {...form.register("firstName")}
                />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  {...form.register("lastName")}
                />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Your phone number"
                {...form.register("phone")}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...form.register("dateOfBirth")}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-2">
            <h4 className="font-medium">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Choose what updates you want to receive to your email.
            </p>
            
            <div className="grid gap-4 mt-4">
              {/* Add notification toggles here later */}
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;