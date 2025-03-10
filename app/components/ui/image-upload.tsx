'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { CameraIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  initialImage?: string | null
  onImageChange: (imageUrl: string) => void
  disabled?: boolean
  className?: string
}

const ImageUpload = ({
  initialImage,
  onImageChange,
  disabled = false,
  className = '',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      // Convert file to base64 string
      const base64String = await convertFileToBase64(file)
      
      // Set preview for immediate visual feedback
      setPreview(base64String)
      
      // Pass the base64 string to parent component
      onImageChange(base64String)
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleButtonClick = () => {
    if (!disabled && !isLoading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted overflow-hidden">
        {preview ? (
          <Image 
            src={preview} 
            alt="Profile" 
            width={96} 
            height={96} 
            className="object-cover w-full h-full"
          />
        ) : (
          <CameraIcon className="h-8 w-8 text-muted-foreground" />
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isLoading}
      />
      
      <Button
        type="button"
        variant="link"
        onClick={handleButtonClick}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-[#4B69FF]"
        disabled={disabled || isLoading}
      >
        {isLoading ? "Uploading..." : "Upload Photo"}
      </Button>
    </div>
  )
}

export { ImageUpload } 