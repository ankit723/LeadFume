import React from 'react'
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { FileText, ChevronRight, RefreshCw, Clock, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Requests Settings | Leadfume",
  description: "Manage your Leadfume requests and permissions.",
};

const RequestsPage = async () => {
  // Get the authenticated user
  const { userId } = await auth();
  
  // Fetch real requests data if user is authenticated
  const requests = userId ? await prisma.request.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) : [];

  // Count requests by status
  const statusCounts = {
    ORDERED: requests.filter(r => r.status === 'ORDERED').length,
    PROCESSING: requests.filter(r => r.status === 'PROCESSING').length,
    DELIVERED: requests.filter(r => r.status === 'DELIVERED').length,
    CANCELLED: requests.filter(r => r.status === 'CANCELLED').length,
  };

  // Calculate total credits used
  const totalCredits = requests.reduce((sum, request) => sum + request.creditsNeeded, 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Access Requests</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Review and manage your data access requests.
        </p>
      </div>
      <Separator className="bg-primary/10" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{requests.length}</div>
              <FileText className="h-4 w-4 text-primary/70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-yellow-500/5 border-yellow-500/10 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{statusCounts.ORDERED + statusCounts.PROCESSING}</div>
              <Clock className="h-4 w-4 text-yellow-500/70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-green-500/5 border-green-500/10 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{statusCounts.DELIVERED}</div>
              <RefreshCw className="h-4 w-4 text-green-500/70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-background to-blue-500/5 border-blue-500/10 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">{totalCredits}</div>
              <BarChart className="h-4 w-4 text-blue-500/70" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium flex items-center space-x-2">
            <span>Recent Requests</span>
            <Badge variant="outline" className="ml-2 text-xs bg-primary/5 hover:bg-primary/10 transition-colors">
              {requests.length} total
            </Badge>
          </h4>
          <Link href="/dashboard/people/email-status">
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 transition-colors">
              New Request
            </Button>
          </Link>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="font-medium text-primary/80">{request.id.substring(0, 8)}...</TableCell>
                    <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{request.creditsNeeded}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          request.status === "DELIVERED" ? "default" : 
                          request.status === "CANCELLED" ? "destructive" : 
                          request.status === "PROCESSING" ? "secondary" : "outline"
                        }
                        className={
                          request.status === "DELIVERED" ? "bg-green-500/80 hover:bg-green-500 text-white" :
                          request.status === "CANCELLED" ? "bg-red-500/80 hover:bg-red-500 text-white" :
                          request.status === "PROCESSING" ? "bg-yellow-500/80 hover:bg-yellow-500 text-white" :
                          "bg-primary/10 hover:bg-primary/20 text-primary"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/settings/requests/${request.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-70 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                        >
                          View <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center space-y-2">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                      <p>No requests found</p>
                      <Link href="/dashboard/people/email-status">
                        <Button variant="outline" size="sm" className="mt-2 hover:bg-primary/10 hover:text-primary">
                          Create your first request
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Separator className="bg-primary/10" />
      
      <div className="space-y-2">
        <h4 className="font-medium flex items-center space-x-2">
          <span>Permissions</span>
        </h4>
        <p className="text-sm text-muted-foreground">
          Manage third-party access to your data.
        </p>
        
        <Card className="mt-4 bg-gradient-to-br from-background to-muted/20 border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <p className="text-sm flex items-center">
                <span className="mr-2">No active permissions</span>
                <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary text-xs h-7">
                  Manage
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestsPage; 