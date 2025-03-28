import React from 'react'
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Requests Settings | Leadfume",
  description: "Manage your Leadfume requests and permissions.",
};

const RequestsPage = () => {
  // Mock data for requests
  const requests = [
    { id: 1, type: "Data Access", status: "Approved", date: "2023-12-10" },
    { id: 2, type: "Export Leads", status: "Pending", date: "2023-12-15" },
    { id: 3, type: "API Access", status: "Denied", date: "2023-12-05" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Access Requests</h3>
        <p className="text-sm text-muted-foreground">
          Review and manage your data access requests.
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Recent Requests</h4>
          <Button variant="outline" size="sm">New Request</Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      request.status === "Approved" ? "default" : 
                      request.status === "Denied" ? "destructive" : "outline"
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h4 className="font-medium">Permissions</h4>
        <p className="text-sm text-muted-foreground">
          Manage third-party access to your data.
        </p>
        
        <div className="mt-4">
          {/* Add permissions management UI here */}
          <p className="text-sm text-muted-foreground">No active permissions.</p>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage; 