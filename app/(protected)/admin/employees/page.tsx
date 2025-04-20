'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllEmployees, deleteEmployee, createEmployee, CreateEmployeeData } from '@/app/actions';
import { Employee, EmployeeRole } from '@prisma/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Loader2, MoreHorizontal, Search, Trash2, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

// Extended employee type with order counts
type EmployeeWithCounts = Employee & {
  _count: {
    pendingOrders: number;
    completedOrders: number;
  };
};

const sortOptions: SortOption[] = [
  { label: 'Name (A-Z)', value: 'name:asc' },
  { label: 'Name (Z-A)', value: 'name:desc' },
  { label: 'Joined (Newest)', value: 'dateOfJoining:desc' },
  { label: 'Joined (Oldest)', value: 'dateOfJoining:asc' },
  { label: 'Email (A-Z)', value: 'email:asc' },
  { label: 'Email (Z-A)', value: 'email:desc' },
];

const roleOptions = [
  { label: 'All Roles', value: 'all_roles' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Employee', value: 'EMPLOYEE' },
];

// Get role badge color based on role
const getRoleBadge = (role: EmployeeRole) => {
  switch (role) {
    case 'ADMIN':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
    case 'EMPLOYEE':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Employee</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Validation schema for employee form
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  employeeRole: z.enum(['ADMIN', 'EMPLOYEE']),
  phone: z.string().min(5, { message: "Phone number is required." }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required." }),
  gender: z.string().min(1, { message: "Gender is required." }),
  dateOfJoining: z.string().min(1, { message: "Date of joining is required." }),
});

// Gender options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

// Add clickable row component
const ClickableTableRow = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode; 
  onClick: () => void;
}) => {
  return (
    <TableRow 
      onClick={onClick} 
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      {children}
    </TableRow>
  );
};

// Create a separate component that uses useSearchParams
function EmployeeManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse URL parameters
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const sortParam = searchParams.get('sort') || 'name:asc';
  const roleFilter = searchParams.get('role') || '';
  const searchQuery = searchParams.get('q') || '';
  
  // Parse sort parameter
  const [sortBy, sortOrder] = sortParam.split(':') as [string, 'asc' | 'desc'];
  
  // State for employees data
  const [employees, setEmployees] = useState<EmployeeWithCounts[]>([]);
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithCounts | null>(null);
  
  // Create employee form
  const createForm = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeRole: "EMPLOYEE",
      phone: "",
      dateOfBirth: "",
      gender: "",
      dateOfJoining: format(new Date(), 'yyyy-MM-dd'),
    },
  });
  
  // Update URL with current parameters
  const updateUrl = useCallback((params: { page?: number; limit?: number; sort?: string; role?: string; q?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.page) newParams.set('page', params.page.toString());
    if (params.limit) newParams.set('limit', params.limit.toString());
    if (params.sort) newParams.set('sort', params.sort);
    if (params.role !== undefined) {
      if (params.role) {
        newParams.set('role', params.role);
      } else {
        newParams.delete('role');
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
  
  // Handle role filter change
  const handleRoleChange = (value: string) => {
    updateUrl({ role: value === 'all_roles' ? '' : value, page: 1 }); // Reset to page 1 when role changes
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
  
  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllEmployees({
        page,
        limit,
        sortBy,
        sortOrder,
        search: searchQuery,
      });
      
      // Filter by role if needed
      let filteredEmployees = data.employees;
      if (roleFilter) {
        filteredEmployees = filteredEmployees.filter(emp => emp.employeeRole === roleFilter);
      }
      
      setEmployees(filteredEmployees as EmployeeWithCounts[]);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, roleFilter, searchQuery]);
  
  // Fetch employees when parameters change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  
  // Handle employee delete
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsLoading(true);
      await deleteEmployee(selectedEmployee.id);
      
      toast.success(`Employee ${selectedEmployee.name} deleted successfully`);
      setDeleteModalOpen(false);
      
      // Refresh the employees list
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open employee details/edit modal
  const openDetailsModal = (employee: EmployeeWithCounts) => {
    setSelectedEmployee(employee);
    setDetailsModalOpen(true);
  };
  
  // Open delete confirmation modal
  const openDeleteModal = (employee: EmployeeWithCounts) => {
    setSelectedEmployee(employee);
    setDeleteModalOpen(true);
  };
  
  // Handle employee creation
  const handleCreateEmployee = async (data: z.infer<typeof employeeFormSchema>) => {
    try {
      setIsLoading(true);
      
      await createEmployee(data as CreateEmployeeData);
      
      toast.success('Employee created successfully');
      setCreateModalOpen(false);
      createForm.reset();
      
      // Refresh the employees list
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open create employee modal
  const openCreateModal = () => {
    createForm.reset();
    setCreateModalOpen(true);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={openCreateModal}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
      
      {/* Search and filter section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex w-full sm:w-96 relative">
              <Input
                type="text"
                placeholder="Search by name or email..."
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
            
            <Select value={roleFilter || 'all_roles'} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
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
      
      {isLoading && !employees.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <ClickableTableRow key={employee.id} onClick={() => openDetailsModal(employee)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        {employee.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(employee.employeeRole)}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>
                      {employee.dateOfJoining ? format(new Date(employee.dateOfJoining), 'MMM d, yyyy') : 'Not set'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {employee._count.pendingOrders} pending
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {employee._count.completedOrders} completed
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetailsModal(employee); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); openDeleteModal(employee); }}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </ClickableTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchQuery ? `No employees found matching "${searchQuery}"` : 'No employees found'}
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
      
      {/* Employee Details/Edit Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogDescription>
                  View detailed information about this employee
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mb-4">
                    {selectedEmployee.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                  <div className="mt-1">
                    {getRoleBadge(selectedEmployee.employeeRole)}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Email:</span>
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Phone:</span>
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Gender:</span>
                        <span className="capitalize">{selectedEmployee.gender}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Date of Birth:</span>
                        <span>{selectedEmployee.dateOfBirth ? format(new Date(selectedEmployee.dateOfBirth), 'MMMM d, yyyy') : 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employment Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Date Joined:</span>
                      <span>{selectedEmployee.dateOfJoining ? format(new Date(selectedEmployee.dateOfJoining), 'MMMM d, yyyy') : 'Not set'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Workload:</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {selectedEmployee._count.pendingOrders} pending
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {selectedEmployee._count.completedOrders} completed
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                  Close
                </Button>
                <Button>Edit Employee</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the employee
              {selectedEmployee && (
                <span className="font-medium block mt-1">{selectedEmployee.name}</span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Create Employee Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to the system
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateEmployee)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="employeeRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="EMPLOYEE">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="dateOfJoining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Joining</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Employee"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrap with Suspense boundary
const EmployeeManagement = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <EmployeeManagementContent />
    </Suspense>
  );
};

export default EmployeeManagement; 