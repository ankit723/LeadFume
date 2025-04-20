'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllRequests, updateRequestStatus, assignRequestToEmployee, getAllEmployees } from '@/app/actions';
import { Request, User, Employee, RequestStatus } from '@prisma/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, ClipboardIcon, Clock, Loader2, Package2Icon, Search, UserIcon, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

// Pagination type
type PaginationState = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// Sort options
type SortOption = {
  label: string;
  value: string;
};

// Extended request type with user and employee info
type RequestWithRelations = Request & {
  user: User;
  assignedEmployee: Employee | null;
  completedEmployee: Employee | null;
};



// Employee type for dropdown
type EmployeeOption = {
  id: string;
  name: string;
};

const sortOptions: SortOption[] = [
  { label: 'Created (Newest)', value: 'createdAt:desc' },
  { label: 'Created (Oldest)', value: 'createdAt:asc' },
  { label: 'Status (A-Z)', value: 'status:asc' },
  { label: 'Status (Z-A)', value: 'status:desc' },
  { label: 'Credits (High-Low)', value: 'creditsNeeded:desc' },
  { label: 'Credits (Low-High)', value: 'creditsNeeded:asc' },
];

const statusOptions = [
  { label: 'All Statuses', value: 'all_statuses' },
  { label: 'Ordered', value: 'ORDERED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// Custom clickable table row component
const ClickableTableRow = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick: () => void;
}) => {
  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={(e) => {
        // Only handle click if it's directly on the row and not on a button
        if ((e.target as HTMLElement).closest('button') === null) {
          onClick();
        }
      }}
    >
      {children}
    </TableRow>
  );
};

// Get status badge color based on status
const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case 'ORDERED':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ordered</Badge>;
    case 'PROCESSING':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>;
    case 'DELIVERED':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Format date or show placeholder
const formatDate = (date: Date | null | undefined) => {
  return date ? format(new Date(date), 'MMM d, yyyy') : 'Not set';
};

// Create a separate component that uses useSearchParams
function RequestManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse URL parameters
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const sortParam = searchParams.get('sort') || 'createdAt:desc';
  const statusFilter = searchParams.get('status') || '';
  const searchQuery = searchParams.get('q') || '';
  
  // Parse sort parameter
  const [sortBy, sortOrder] = sortParam.split(':') as [string, 'asc' | 'desc'];
  
  // State for requests data
  const [requests, setRequests] = useState<RequestWithRelations[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(searchQuery);
  
  // State for modals
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestWithRelations | null>(null);
  const [newStatus, setNewStatus] = useState<RequestStatus | ''>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  
  // Update URL with current parameters
  const updateUrl = useCallback((params: { page?: number; limit?: number; sort?: string; status?: string; q?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.page) newParams.set('page', params.page.toString());
    if (params.limit) newParams.set('limit', params.limit.toString());
    if (params.sort) newParams.set('sort', params.sort);
    if (params.status !== undefined) {
      if (params.status) {
        newParams.set('status', params.status);
      } else {
        newParams.delete('status');
      }
    }
    if (params.q !== undefined) {
      if (params.q) {
        newParams.set('q', params.q);
      } else {
        newParams.delete('q');
      }
    }
    
    router.push(`?${newParams.toString()}`);
  }, [router, searchParams]);
  
  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    updateUrl({ sort: value, page: 1 }); // Reset to page 1 when sort changes
  };
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    updateUrl({ status: value === 'all_statuses' ? '' : value, page: 1 }); // Reset to page 1 when status changes
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: searchValue, page: 1 }); // Reset to page 1 when search changes
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchValue('');
    updateUrl({ q: '', page: 1 });
  };
  
  // Fetch all requests
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllRequests({
        page,
        limit,
        sortBy,
        sortOrder,
        status: statusFilter || undefined,
        search: searchQuery,
      });
      
      setRequests(data.requests);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, statusFilter, searchQuery]);
  
  // Fetch requests when parameters change
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);
  
  // Fetch employees for assignment
  const fetchEmployees = useCallback(async () => {
    try {
      const { employees } = await getAllEmployees({ limit: 100 });
      
      // Map the employees to the format needed for the dropdown
      const employeeOptions = employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
      }));
      
      setEmployees(employeeOptions);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    }
  }, []);
  
  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  
  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedRequest || !newStatus) return;
    
    try {
      setIsLoading(true);
      await updateRequestStatus(selectedRequest.id, newStatus as RequestStatus);
      
      // Refresh the requests list
      await fetchRequests();
      
      toast.success(`Request status updated to ${newStatus}`);
      setStatusModalOpen(false);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle employee assignment
  const handleAssignEmployee = async () => {
    if (!selectedRequest || !selectedEmployeeId) return;
    
    try {
      setIsLoading(true);
      await assignRequestToEmployee(selectedRequest.id, selectedEmployeeId);
      
      // Refresh the requests list
      await fetchRequests();
      
      toast.success('Request assigned successfully');
      setAssignModalOpen(false);
      setSelectedEmployeeId('');
    } catch (error) {
      console.error('Error assigning request:', error);
      toast.error('Failed to assign request');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open request details modal
  const openDetailsModal = (request: RequestWithRelations) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };
  
  // Open status update modal
  const openStatusModal = (request: RequestWithRelations) => {
    setSelectedRequest(request);
    setNewStatus('');
    setStatusModalOpen(true);
  };
  
  // Open assign modal
  const openAssignModal = (request: RequestWithRelations) => {
    setSelectedRequest(request);
    setSelectedEmployeeId(request.assignedEmployeeId || '');
    setAssignModalOpen(true);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Request Management</h1>
      </div>
      
      {/* Search and filter section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex w-full sm:w-96 relative">
              <Input
                type="text"
                placeholder="Search by URL or user..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-8"
              />
              {searchValue && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-8 top-0"
                  onClick={clearSearch}
                >
                  ✕
                </Button>
              )}
              <Button type="submit" size="icon" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Select value={statusFilter || 'all_statuses'} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortParam} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading && !requests.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <ClickableTableRow key={request.id} onClick={() => openDetailsModal(request)}>
                    <TableCell className="font-mono text-xs">
                      {request.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{request.user.firstName} {request.user.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-xs">
                        {request.requestParameterisedURL}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {request.assignedEmployee ? (
                        <span>{request.assignedEmployee.name}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openStatusModal(request);
                          }}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssignModal(request);
                          }}
                        >
                          <UserIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </ClickableTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchQuery ? `No requests found matching "${searchQuery}"` : 'No requests found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination controls */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{Math.min((page - 1) * limit + 1, pagination.total)}</span> to{" "}
                <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of{" "}
                <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={page === pagination.totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Request Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package2Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Request Details</span>
                </DialogTitle>
                <DialogDescription>
                  Complete information for request
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Request Column */}
                <div className="col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Status</CardTitle>
                      <CardDescription>Current state</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="flex flex-col items-center">
                          {selectedRequest.status === 'ORDERED' && <Clock className="h-12 w-12 text-blue-500" />}
                          {selectedRequest.status === 'PROCESSING' && <Loader2 className="h-12 w-12 text-yellow-500" />}
                          {selectedRequest.status === 'DELIVERED' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
                          {selectedRequest.status === 'CANCELLED' && <XCircle className="h-12 w-12 text-red-500" />}
                          <div className="mt-2 font-semibold text-lg">
                            {getStatusBadge(selectedRequest.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Request ID</p>
                        <p className="text-sm text-muted-foreground font-mono">{selectedRequest.id}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Credits Used</p>
                        <p className="text-sm text-muted-foreground">{selectedRequest.creditsNeeded} credits</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Created Date</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedRequest.createdAt), 'MMMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Expected Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedRequest.expectedDeliveryDate)}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => {
                          setDetailsModalOpen(false);
                          openStatusModal(selectedRequest);
                        }}
                        className="w-full"
                      >
                        Update Status
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* User and URL Columns */}
                <div className="col-span-1 md:col-span-2">
                  <div className="grid grid-cols-1 gap-4">
                    {/* User Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          User Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Name</span>
                          <span className="text-sm">
                            {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Email</span>
                          <span className="text-sm">{selectedRequest.user.email}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Phone</span>
                          <span className="text-sm">{selectedRequest.user.phone}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Request URL Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ClipboardIcon className="h-4 w-4" />
                          Request URL
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md font-mono text-xs break-all cursor-pointer hover:underline hover:text-blue-500"
                          onClick={() => {
                            let url = selectedRequest.requestParameterisedURL;
                            if (!/^https?:\/\//i.test(url)) {
                              url = 'https://' + url;
                            }
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          {selectedRequest.requestParameterisedURL}
                        </div>

                        
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Query Parameters</p>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                            {(() => {
                              try {
                                const queryParams = JSON.parse(selectedRequest.requestQueryParams?.toString() || '{}');
                                const entries = Object.entries(queryParams);
                                
                                if (entries.length === 0) {
                                  return <p className="text-xs text-muted-foreground">No query parameters</p>;
                                }
                                
                                return (
                                  <div className="border rounded-md overflow-hidden">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-1/3 text-xs">Parameter</TableHead>
                                          <TableHead className="text-xs">Value</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {entries.map(([key, value]) => (
                                          <TableRow key={key}>
                                            <TableCell className="py-2 text-xs font-medium">{key}</TableCell>
                                            <TableCell className="py-2 text-xs font-mono break-all">
                                              {typeof value === 'object' 
                                                ? JSON.stringify(value) 
                                                : String(value)
                                              }
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                );
                              } catch (e) {
                                return (
                                  <p className="text-xs text-red-500">
                                    Error parsing query parameters: {(e as Error).message}
                                  </p>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Assignment Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          Assignment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Assigned To</span>
                          <span className="text-sm">
                            {selectedRequest.assignedEmployee ? 
                              selectedRequest.assignedEmployee.name : 
                              'Unassigned'}
                          </span>
                        </div>
                        
                        {selectedRequest.status === 'DELIVERED' && selectedRequest.completedEmployee && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Completed By</span>
                            <span className="text-sm">{selectedRequest.completedEmployee.name}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Update Status Modal */}
      <AlertDialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <AlertDialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl">Update Request Status</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Change the status for request
              <span className="font-medium text-foreground block mt-1">
                {selectedRequest && selectedRequest.id}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-6 px-2">
            <Select 
              value={newStatus} 
              onValueChange={(value: string) => setNewStatus(value as RequestStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORDERED">Ordered</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-px w-full bg-border my-4"></div>
          <AlertDialogFooter className="flex gap-2 sm:justify-center">
            <AlertDialogCancel className="mt-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStatusUpdate} 
              className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={!newStatus || (selectedRequest ? newStatus === selectedRequest.status : false)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Update Status"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Assign Employee Modal */}
      <AlertDialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <AlertDialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl">Assign Request</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Assign this request to an employee
              <span className="font-medium text-foreground block mt-1">
                {selectedRequest && selectedRequest.id}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-6 px-2">
            <Select 
              value={selectedEmployeeId} 
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.length > 0 ? (
                  employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-employees">No employees available</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {selectedRequest?.assignedEmployeeId && selectedRequest.assignedEmployeeId !== selectedEmployeeId && (
              <p className="text-sm text-amber-600 mt-2">
                This will reassign the request from{" "}
                {selectedRequest.assignedEmployee?.name || "unknown"}
              </p>
            )}
          </div>
          
          <div className="h-px w-full bg-border my-4"></div>
          <AlertDialogFooter className="flex gap-2 sm:justify-center">
            <AlertDialogCancel className="mt-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAssignEmployee} 
              className="bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              disabled={!selectedEmployeeId || (selectedRequest ? selectedEmployeeId === selectedRequest.assignedEmployeeId : false)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Assign Employee"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Wrap with Suspense boundary
const RequestManagement = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RequestManagementContent />
    </Suspense>
  );
};

export default RequestManagement; 