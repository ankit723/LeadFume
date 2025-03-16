'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from 'uuid';

export async function getUser() {

    const { userId } = await auth();
    if (!userId) {
        console.log(null)
        return null;
    }
    const user = await prisma.user.findUnique({
        where: {
        id: userId,
        },
    });
    console.log(user)
    return user;
}

interface CreateUserData {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
}

export async function createUser(data: CreateUserData) {
    const user = await prisma.user.create({
        data: {
            id: data.id || undefined,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            profileImage: data.profileImage || "",
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
        },
    });
    return user;
}

export async function uploadImage(base64Image: string) {
    try {
        // Check if base64Image is empty or not a valid base64 string
        if (!base64Image || !base64Image.includes('base64')) {
            return { success: false, error: "Invalid image data" };
        }

        // Get the authenticated user ID
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Create Supabase client
        const supabase = await createClient();
        
        // Extract content type and base64 data
        const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
            return { success: false, error: "Invalid base64 string format" };
        }
        
        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Determine file extension based on content type
        let fileExtension = 'jpg';
        if (contentType.includes('png')) fileExtension = 'png';
        if (contentType.includes('gif')) fileExtension = 'gif';
        if (contentType.includes('webp')) fileExtension = 'webp';
        
        // Generate a unique filename
        const fileName = `${userId}-${uuidv4()}.${fileExtension}`;
        const filePath = `profiles/${fileName}`;
        
        // Upload to Supabase Storage
        const {error } = await supabase.storage
            .from('user-images')
            .upload(filePath, buffer, {
                contentType,
                upsert: true
            });
            
        if (error) {
            console.error("Error uploading image:", error);
            return { success: false, error: error.message };
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('user-images')
            .getPublicUrl(filePath);
            
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Error in uploadImage:", error);
        return { success: false, error: (error as Error).message };
    }
}