import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Employee } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
