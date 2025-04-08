"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cancelRequest } from '@/app/actions';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Loader2, XCircle, AlertTriangle } from 'lucide-react';

interface CancelRequestButtonProps {
  requestId: string;
}

const CancelRequestButton = ({ requestId }: CancelRequestButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      await cancelRequest(requestId);
      toast.success("Request cancelled successfully", {
        description: "Your request has been removed from the processing queue.",
        action: {
          label: "View All",
          onClick: () => router.push("/settings/requests"),
        },
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel request", {
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setIsLoading(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsConfirmOpen(true)}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 group relative overflow-hidden transition-all duration-300"
      >
        <span className="absolute inset-0 w-full h-full transition-all duration-300 scale-x-0 origin-left group-hover:scale-x-100 bg-red-800 z-0"></span>
        <span className="relative z-10 flex items-center">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              Cancel Request
            </>
          )}
        </span>
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="border border-red-200 dark:border-red-800/30 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              This action cannot be undone. Cancelling this request will permanently remove it from the processing queue and you will need to create a new request if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800/30 dark:hover:bg-red-950/30 transition-colors duration-200">
              No, keep request
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </span>
              ) : (
                "Yes, cancel request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CancelRequestButton; 