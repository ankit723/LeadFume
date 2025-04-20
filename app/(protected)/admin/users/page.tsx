'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/app/actions';
import { User, Subscriptions, SubscriptionType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CreditCard, Loader2, PencilIcon, Search, Trash2Icon, UserPlusIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
// Define the form schema
const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  dateOfBirth: z.string(),
  gender: z.string(),
  profileImage: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

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

// Extended user type with subscription info
type UserWithSubscription = User & {
  subscription: (Subscriptions & {
    subscriptionType: SubscriptionType;
  }) | null;
};

const sortOptions: SortOption[] = [
  { label: 'Created (Newest)', value: 'createdAt:desc' },
  { label: 'Created (Oldest)', value: 'createdAt:asc' },
  { label: 'Name (A-Z)', value: 'firstName:asc' },
  { label: 'Name (Z-A)', value: 'firstName:desc' },
  { label: 'Email (A-Z)', value: 'email:asc' },
  { label: 'Email (Z-A)', value: 'email:desc' },
  { label: 'Credits (High-Low)', value: 'creditsAvailable:desc' },
  { label: 'Credits (Low-High)', value: 'creditsAvailable:asc' },
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

// Create a separate component that uses useSearchParams
function UserManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse URL parameters
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const sortParam = searchParams.get('sort') || 'createdAt:desc';
  const searchQuery = searchParams.get('q') || '';
  
  // Parse sort parameter
  const [sortBy, sortOrder] = sortParam.split(':') as [string, 'asc' | 'desc'];
  
  // State for users data
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(searchQuery);
  
  // State for modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [formData, setFormData] = useState<UserFormValues | null>(null);
  
  // Form setup
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      profileImage: '',
    },
  });
  
  // Update URL with current parameters
  const updateUrl = useCallback((params: { page?: number; limit?: number; sort?: string; q?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.page) newParams.set('page', params.page.toString());
    if (params.limit) newParams.set('limit', params.limit.toString());
    if (params.sort) newParams.set('sort', params.sort);
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
  
  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers({
        page,
        limit,
        sortBy,
        sortOrder,
        search: searchQuery,
      });
      
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, searchQuery]);
  
  // Fetch users when parameters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Handle creating a new user
  const handleCreateUser = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      await createUser({
        ...data,
        profileImage: data.profileImage || '',
      });
      
      // Refresh the users list
      await fetchUsers();
      
      toast.success('User created successfully');
      setCreateModalOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle submitting edit form
  const handleEditSubmit = async (data: UserFormValues) => {
    setFormData(data);
    setEditConfirmOpen(true);
  };
  
  // Handle editing a user after confirmation
  const handleEditUser = async () => {
    if (!selectedUser || !formData) return;
    
    try {
      setIsLoading(true);
      await updateUser(selectedUser.id, {
        ...formData,
        profileImage: formData.profileImage || '',
      });
      
      // Refresh the users list
      await fetchUsers();
      
      toast.success('User updated successfully');
      setEditModalOpen(false);
      setEditConfirmOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deleting a user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsLoading(true);
      await deleteUser(selectedUser.id);
      
      // Refresh the users list
      await fetchUsers();
      
      toast.success('User deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open edit modal with selected user data
  const openEditModal = (user: UserWithSubscription) => {
    setSelectedUser(user);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      profileImage: user.profileImage,
    });
    setEditModalOpen(true);
  };
  
  // Open delete confirmation modal
  const openDeleteModal = (user: UserWithSubscription) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Open user details modal
  const openDetailsModal = (user: UserWithSubscription) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
    console.log("Opening details for user:", user.firstName, user.lastName);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              form.reset(); // Reset form when opening create modal
              setCreateModalOpen(true);
            }}
          >
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
      
      {isLoading && !users.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <ClickableTableRow key={user.id} onClick={() => openDetailsModal(user)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.profileImage && (
                          <Image
                            src={user.profileImage} 
                            alt={`${user.firstName} ${user.lastName}`} 
                            className="w-8 h-8 rounded-full object-cover"
                            width={32}
                            height={32}
                          />
                        )}
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.subscription ? (
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="max-w-fit">
                            {user.subscription.subscriptionType.name || 'Standard Plan'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Renews: {format(new Date(user.subscription.subscriptionRenewalDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                          No Subscription
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={user.creditsAvailable > 500 ? "bg-green-100 text-green-800 hover:bg-green-100" : user.creditsAvailable > 100 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                        {user.creditsAvailable} credits
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(user);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(user);
                          }}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </ClickableTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found'}
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
      
      {/* Create User Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input 
                  id="firstName"
                  {...form.register('firstName')}
                  placeholder="First name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input 
                  id="lastName"
                  {...form.register('lastName')}
                  placeholder="Last name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="email@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input 
                id="phone"
                {...form.register('phone')}
                placeholder="Phone number"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                <Input 
                  id="dateOfBirth"
                  type="date"
                  {...form.register('dateOfBirth')}
                />
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                <Select
                  onValueChange={(value) => form.setValue('gender', value)}
                  defaultValue={form.getValues('gender')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="profileImage" className="text-sm font-medium">Profile Image URL (Optional)</label>
              <Input 
                id="profileImage"
                {...form.register('profileImage')}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input 
                  id="firstName"
                  {...form.register('firstName')}
                  placeholder="First name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input 
                  id="lastName"
                  {...form.register('lastName')}
                  placeholder="Last name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="email@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input 
                id="phone"
                {...form.register('phone')}
                placeholder="Phone number"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                <Input 
                  id="dateOfBirth"
                  type="date"
                  {...form.register('dateOfBirth')}
                />
                {form.formState.errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                <Select
                  onValueChange={(value) => form.setValue('gender', value)}
                  defaultValue={form.getValues('gender')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="profileImage" className="text-sm font-medium">Profile Image URL (Optional)</label>
              <Input 
                id="profileImage"
                {...form.register('profileImage')}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Confirmation */}
      <AlertDialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen}>
        <AlertDialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <PencilIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl">Confirm User Update</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to update the information for
              <span className="font-medium text-foreground">
                {selectedUser && ` ${selectedUser.firstName} ${selectedUser.lastName}`}
              </span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
            <span className="text-xs text-blue-600 dark:text-blue-400 block">
              This action will modify their user profile data. All previous information will be overwritten with the new values.
            </span>
          </div>
          
          <div className="h-px w-full bg-border my-4"></div>
          <AlertDialogFooter className="flex gap-2 sm:justify-center">
            <AlertDialogCancel className="mt-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleEditUser} 
              className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Update"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete User Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2Icon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <AlertDialogHeader className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl text-red-600">Delete User Account</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              You are about to delete the account for
              <span className="font-medium text-foreground">
                {selectedUser && ` ${selectedUser.firstName} ${selectedUser.lastName}`}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
            <span className="text-xs text-red-600 dark:text-red-400 block">
              This action cannot be undone. All data associated with this user including their 
              orders, subscription information, and personal details will be permanently removed.
            </span>
          </div>
          
          <div className="h-px w-full bg-border my-4"></div>
          <AlertDialogFooter className="flex gap-2 sm:justify-center">
            <AlertDialogCancel className="mt-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser} 
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* User Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlusIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span>User Details</span>
                </DialogTitle>
                <DialogDescription>
                  Complete profile information for {selectedUser.firstName} {selectedUser.lastName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Profile Column */}
                <div className="col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Profile</CardTitle>
                      <CardDescription>Personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center mb-4">
                        {selectedUser.profileImage ? (
                          <Image
                            src={selectedUser.profileImage} 
                            alt={`${selectedUser.firstName} ${selectedUser.lastName}`} 
                            className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                            width={96}
                            height={96}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl text-primary font-semibold">
                            {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.firstName} {selectedUser.lastName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Gender</p>
                        <p className="text-sm text-muted-foreground capitalize">{selectedUser.gender}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.dateOfBirth && format(new Date(selectedUser.dateOfBirth), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Subscription Column */}
                <div className="col-span-1 md:col-span-2">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Subscription Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Subscription Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedUser.subscription ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Plan</span>
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                {selectedUser.subscription.subscriptionType.name || 'Standard Plan'}
                              </Badge>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Status</span>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                                Active
                              </Badge>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Price</span>
                              <span className="text-sm font-semibold">${selectedUser.subscription.price / 100}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Credits</span>
                              <span className="text-sm font-semibold">{selectedUser.creditsAvailable} credits</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Start Date</span>
                              <span className="text-sm">{format(new Date(selectedUser.subscription.subscriptionStartDate), 'MMMM d, yyyy')}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Renewal Date</span>
                              <span className="text-sm">{format(new Date(selectedUser.subscription.subscriptionRenewalDate), 'MMMM d, yyyy')}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="rounded-full bg-yellow-100 p-3 mb-3">
                              <CreditCard className="h-5 w-5 text-yellow-600" />
                            </div>
                            <h3 className="text-base font-medium mb-1">No Active Subscription</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This user doesn&apos;t have an active subscription plan.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Account Info Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Account Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">User ID</span>
                          <span className="text-sm text-muted-foreground">{selectedUser.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Created</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(selectedUser.createdAt), 'MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Last Updated</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(selectedUser.updatedAt), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setDetailsModalOpen(false);
                    openEditModal(selectedUser);
                  }}>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit User
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrap with Suspense boundary
const UserManagement = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <UserManagementContent />
    </Suspense>
  );
};

export default UserManagement;
