import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, CreditCard, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Request Details | Leadfume',
  description: 'View your request details',
};

export default async function RequestDetailPage({ params }: PageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  const resolvedParams = await params;
  
  // Fetch the request with the given ID, ensuring it belongs to the current user
  const request = await prisma.request.findUnique({
    where: {
      id: resolvedParams.id,
      userId: userId,
    },
    include: {
      assignedEmployee: true,
      completedEmployee: true,
    },
  });
  
  // If the request doesn't exist or doesn't belong to the current user, show a 404 page
  if (!request) {
    notFound();
  }
  
  // Helper function for formatting dates
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Not set';
    return format(new Date(date), 'PPP');
  };

  
  
  // Helper for status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return {
          color: 'default', 
          bgClass: 'bg-green-500/80 hover:bg-green-500 text-white',
          icon: <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
        };
      case 'CANCELLED':
        return {
          color: 'destructive', 
          bgClass: 'bg-red-500/80 hover:bg-red-500 text-white',
          icon: <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
        };
      case 'PROCESSING':
        return {
          color: 'secondary', 
          bgClass: 'bg-yellow-500/80 hover:bg-yellow-500 text-white',
          icon: <Loader2 className="h-4 w-4 text-yellow-500 mr-1.5 animate-spin" />
        };
      default:
        return {
          color: 'outline', 
          bgClass: 'bg-primary/10 hover:bg-primary/20 text-primary',
          icon: <AlertCircle className="h-4 w-4 text-primary mr-1.5" />
        };
    }
  };

  const statusInfo = getStatusInfo(request.status);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/settings/requests">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h3 className="text-lg font-medium">Request Details</h3>
        </div>
        <Badge 
          variant={statusInfo.color as any} 
          className={`${statusInfo.bgClass} px-3 py-1 flex items-center`}
        >
          {statusInfo.icon}
          {request.status}
        </Badge>
      </div>
      
      <Separator className="bg-primary/10" />
      
      <div className="">
        <Card className="border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-gradient-to-br from-background to-blue-500/5">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Request Information</CardTitle>
            <Clock className="h-4 w-4 text-primary/70" />
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-primary/50"></span>
                  Name
                </p>
                <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded text-primary border border-primary/10 overflow-hidden text-ellipsis">{request.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-primary/50"></span>
                  Credits Used
                </p>
                <p className="text-sm flex items-center">
                  <CreditCard className="h-3.5 w-3.5 text-primary mr-1.5" />
                  {request.creditsNeeded}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-primary/50"></span>
                  Created
                </p>
                <p className="text-sm flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-primary mr-1.5" />
                  {formatDate(request.createdAt)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-primary/50"></span>
                  Expected Delivery
                </p>
                <p className="text-sm flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-primary mr-1.5" />
                  {formatDate(request.expectedDeliveryDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 