'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "../ui/image-upload"
import { createUser, uploadImage } from "@/app/actions"
import { toast } from "sonner"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  profileImage: z.string().optional(),
})

//user from clerk auth
interface User {
    id: string;
    emailAddresses: {
        emailAddress: string;
    }[];
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
}

export default function OnboardingForm({user}: {user: User | null}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.imageUrl || null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      profileImage: user?.imageUrl || "",
    },
  })

  const handleImageChange = (imageUrl: string) => {
    setProfileImage(imageUrl);
    form.setValue('profileImage', imageUrl);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // Handle image upload if the image has changed
      let profileImageUrl = values.profileImage;
      if (profileImage && profileImage !== user?.imageUrl) {
        const result = await uploadImage(profileImage);
        if (!result.success) {
          toast.error(`Failed to upload image: ${result.error}`);
          return;
        }
        profileImageUrl = result.url;
      }
      
      // Create user with the updated profile image URL
      const userData = {
        ...values,
        id: user?.id,
        profileImage: profileImageUrl || ""
      };
      
      const newUser = await createUser(userData);
      
      if (newUser) {
        toast.success("Profile created successfully!");
        router.push('/dashboard');
      } else {
        toast.error("Failed to create profile. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-8 rounded-xl bg-background p-8 shadow-lg relative z-10 border border-border">
      {/* Photo Upload Section */}
      <div className="flex flex-col items-center space-y-4">
        <ImageUpload 
          initialImage={user?.imageUrl || null}
          onImageChange={handleImageChange}
          disabled={isLoading}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your first name" 
                      className="focus-visible:ring-primary"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your last name" 
                      className="focus-visible:ring-primary"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email and Phone Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      className="focus-visible:ring-primary"
                      disabled={true} // Email from Clerk should be read-only
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your phone number" 
                      type="tel" 
                      className="focus-visible:ring-primary"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date of Birth and Gender Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your birthdate" 
                      type="date" 
                      className="focus-visible:ring-primary"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="focus-visible:ring-primary">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="w-full max-w-[200px] bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Now"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}