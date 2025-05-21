'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from 'uuid';
import { Request } from "@prisma/client";

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
        include: {
            subscription: true,
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
            createdAt: new Date(),
            updatedAt: new Date(),
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


export const addRequest = async (request: Request) => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            subscription: {
                include: {
                    subscriptionType: true,
                },
            },
        },
    });
    if (!user) {
        throw new Error("User not found");
    }

    const availableCredits = user?.creditsAvailable || 0;
    if (availableCredits < request.creditsNeeded) {
        throw new Error("Insufficient credits");
    }

    // Find an employee to assign the request to
    // If no employee is specified, find an employee with the least number of pending orders
    let assignedEmployeeId = request.assignedEmployeeId;
    
    if (!assignedEmployeeId) {
        // Get all employees with their pending orders count
        const employeesWithOrderCount = await prisma.employee.findMany({
            select: {
                id: true,
                _count: {
                    select: {
                        pendingOrders: true
                    }
                }
            }
        });
        
        // Find the employee with the least number of pending orders
        if (employeesWithOrderCount.length > 0) {
            const employeeWithLeastOrders = employeesWithOrderCount.reduce((min, employee) => 
                employee._count.pendingOrders < min._count.pendingOrders ? employee : min
            , employeesWithOrderCount[0]);
            
            assignedEmployeeId = employeeWithLeastOrders.id;
        }
    }

    // Create the request
    const createdRequest = await prisma.request.create({
        data: {
            status: request.status,
            expectedDeliveryDate: request.expectedDeliveryDate,
            requestParameterisedURL: request.requestParameterisedURL,
            requestQueryParams: JSON.stringify(request.requestQueryParams),
            creditsNeeded: request.creditsNeeded,
            assignedEmployeeId: assignedEmployeeId,
            completedEmployeeId: request.completedEmployeeId,
            userId: userId,
            name: request.name,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    // Deduct the credits from the user's subscription
    await prisma.user.update({
        where: { id: userId },
        data: {
            creditsAvailable: {
                decrement: request.creditsNeeded
            }
        }
    });
    
    return createdRequest;
}

export const getRequests = async (userId: string) => {
    const requests = await prisma.request.findMany({
        where: {
            userId: userId
        }
    })
    return requests
}

export const cancelRequest = async (requestId: string) => {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("User not authenticated");
    }
    
    // Verify the request belongs to the user
    const request = await prisma.request.findUnique({
        where: {
            id: requestId,
            userId: userId
        }
    });
    
    if (!request) {
        throw new Error("Request not found or does not belong to user");
    }
    
    // Only allow cancellation if request is in ORDERED state
    if (request.status !== "ORDERED") {
        throw new Error("Request cannot be cancelled at this stage");
    }
    
    // Update the request status to CANCELLED
    const updatedRequest = await prisma.request.update({
        where: {
            id: requestId
        },
        data: {
            status: "CANCELLED",
            updatedAt: new Date()
        }
    });
    
    return updatedRequest;
}

export const addContactForm = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) => {
    const contact = await prisma.contactForm.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            message: data.message
        }
    });
    return contact;
}

// Subscription related server actions
export async function createSubscriptionType({
    name,
    description,
    price,
    credits,
    annualDiscount,
    isPopular,
    isActive,
}: {
    name?: string;
    description?: string;
    price: number;
    credits: number;
    annualDiscount?: number;
    isPopular?: boolean;
    isActive?: boolean;
}) {
    try {
        // Check admin permission
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        // In a real app, you'd check if the user is an admin
        
        // Create subscription type with the fields in our schema
        const subscriptionType = await prisma.subscriptionType.create({
            data: {
                // These fields exist in our updated schema
                price,
                credits,
                // Only set these if provided, otherwise use defaults from schema
                ...(name ? { name } : {}),
                ...(description ? { description } : {}),
                ...(annualDiscount !== undefined ? { annualDiscount } : {}),
                ...(isPopular !== undefined ? { isPopular } : {}),
                ...(isActive !== undefined ? { isActive } : {})
            },
        });
        
        return { success: true, data: subscriptionType };
    } catch (error) {
        console.error("Error creating subscription type:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function updateSubscriptionType({
    id,
    name,
    description,
    price,
    credits,
    annualDiscount,
    isPopular,
    isActive,
}: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    credits?: number;
    annualDiscount?: number;
    isPopular?: boolean;
    isActive?: boolean;
}) {
    try {
        // Check admin permission
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        // In a real app, you'd check if the user is an admin
        
        // Build update data with only the fields that are provided
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (credits !== undefined) updateData.credits = credits;
        if (annualDiscount !== undefined) updateData.annualDiscount = annualDiscount;
        if (isPopular !== undefined) updateData.isPopular = isPopular;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        const subscriptionType = await prisma.subscriptionType.update({
            where: { id },
            data: updateData,
        });
        
        return { success: true, data: subscriptionType };
    } catch (error) {
        console.error("Error updating subscription type:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getSubscriptionTypes() {
    try {
        const subscriptionTypes = await prisma.subscriptionType.findMany({
            orderBy: { price: 'asc' }
        });
        
        return { success: true, data: subscriptionTypes };
    } catch (error) {
        console.error("Error fetching subscription types:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteSubscriptionType(id: string) {
    try {
        // Check admin permission
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        // Check if there are any active subscriptions using this type
        const existingSubscriptions = await prisma.subscriptions.findMany({
            where: { subscriptionTypeId: id }
        });
        
        if (existingSubscriptions.length > 0) {
            throw new Error("Cannot delete subscription type with active subscriptions");
        }
        
        await prisma.subscriptionType.delete({
            where: { id }
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error deleting subscription type:", error);
        return { success: false, error: (error as Error).message };
    }
}

// User subscription purchase related server actions
export async function purchaseSubscription(subscriptionTypeId: string, isAnnual: boolean = false) {
    try {
        // Get authenticated user
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Get the subscription type
        const subscriptionType = await prisma.subscriptionType.findUnique({
            where: { id: subscriptionTypeId }
        });
        
        if (!subscriptionType) {
            throw new Error("Subscription type not found");
        }
        
        // Calculate start and renewal dates
        const startDate = new Date();
        const renewalDate = new Date();
        
        // Set renewal date based on subscription type
        if (isAnnual) {
            renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        } else {
            // Monthly subscription
            renewalDate.setMonth(renewalDate.getMonth() + 1);
        }
        
        // Calculate price based on billing cycle
        let price = subscriptionType.price;
        if (isAnnual) {
            // Apply annual discount if available
            const annualDiscount = subscriptionType.annualDiscount || 0;
            price = price * 12 * (1 - annualDiscount / 100);
        }
        
        // In a real app, payment processing would happen here
        
        // Create the subscription
        const subscription = await prisma.subscriptions.create({
            data: {
                userId: userId,
                subscriptionTypeId,
                price: price,
                subscriptionStartDate: startDate,
                subscriptionRenewalDate: renewalDate,
            }
        });
        
        // For annual plans, provide the full year's worth of credits upfront
        const creditAllocation = isAnnual ? subscriptionType.credits * 12 : subscriptionType.credits;
        
        // Update the user with the new subscription and credits
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                creditsAvailable: creditAllocation,
            }
        });
        
        return { success: true, data: { subscription, user } };
    } catch (error) {
        console.error("Error purchasing subscription:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function cancelSubscription() {
    try {
        // Get authenticated user
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        // Get the user with their current subscription
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });
        
        if (!user || !user.subscription) {
            throw new Error("No active subscription found");
        }
        
        // Update the user to remove subscription
        await prisma.subscriptions.delete({
            where: { id: user.subscription.id } 
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getUserSubscription() {
    try {
        // Get authenticated user
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Not authenticated");
        }
        
        // Get the user with their current subscription and subscription type
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { 
                subscription: {
                    include: {
                        subscriptionType: true
                    }
                }
            }
        });
        
        if (!user) {
            throw new Error("User not found");
        }
        
        return { 
            success: true, 
            data: {
                user,
                subscription: user.subscription,
                subscriptionType: user.subscription?.subscriptionType
            }
        };
    } catch (error) {
        console.error("Error getting user subscription:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function getAllUsers({
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  search = ''
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
} = {}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd verify if the user is an admin here
  
  try {
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build where clause for search
    let where = {};
    if (search) {
      where = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      };
    }
    
    // Get paginated users
    const users = await prisma.user.findMany({
      where,
      include: {
        subscription: {
          include: {
            subscriptionType: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const total = await prisma.user.count({ where });
    
    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

export async function updateUser(userId: string, data: Partial<CreateUserData>) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd verify if the user is an admin here
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        updatedAt: new Date(),
      },
    });
    
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(userId: string) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd verify if the user is an admin here
  
  try {
    // First delete related data if necessary
    await prisma.request.deleteMany({
      where: { userId: userId },
    });

    // Then delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function getAllRequests({
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status = undefined,
  search = ''
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  search?: string;
} = {}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd verify if the user is an admin here
  
  try {
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build where clause for filters
    const where: any = {};
    
    // Add status filter if provided
    if (status) {
      where.status = status;
    }
    
    // Add search filter if provided
    if (search) {
      where.OR = [
        { requestParameterisedURL: { contains: search, mode: 'insensitive' } },
        { user: { 
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }
    
    // Get paginated requests with user and employee info
    const requests = await prisma.request.findMany({
      where,
      include: {
        user: true,
        assignedEmployee: true,
        completedEmployee: true
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const total = await prisma.request.count({ where });
    
    return {
      requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error("Failed to fetch requests");
  }
}

export async function updateRequestStatus(
  requestId: string, 
  status: 'ORDERED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd verify if the user is an admin here
  
  try {
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { 
        status,
        updatedAt: new Date(),
        // If marked as delivered, set the completedEmployeeId to the assigned employee
        ...(status === 'DELIVERED' ? {
          completedEmployeeId: { 
            set: await prisma.request.findUnique({
              where: { id: requestId },
              select: { assignedEmployeeId: true }
            }).then(r => r?.assignedEmployeeId ?? null)
          }
        } : {})
      },
    });
    
    return updatedRequest;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw new Error("Failed to update request status");
  }
}

export async function assignRequestToEmployee(requestId: string, employeeId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // In a real app, you'd verify if the user is an admin here
  
  try {
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { 
        assignedEmployeeId: employeeId,
        status: 'PROCESSING', // Automatically change status to processing when assigned
        updatedAt: new Date(),
      },
    });
    
    return updatedRequest;
  } catch (error) {
    console.error("Error assigning request:", error);
    throw new Error("Failed to assign request to employee");
  }
}

export async function getAllEmployees({
  page = 1,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  search = ''
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
} = {}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  try {
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Prepare search conditions
    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get employees count for pagination
    const totalEmployees = await prisma.employee.count({
      where: whereCondition,
    });

    // Get employees with pagination and sorting
    const employees = await prisma.employee.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        employeeRole: true,
        profileImage: true,
        phone: true,
        dateOfJoining: true,
        _count: {
          select: {
            pendingOrders: true,
            completedOrders: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalEmployees / limit);

    return {
      employees,
      pagination: {
        page,
        limit,
        total: totalEmployees,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Failed to fetch employees");
  }
}

export async function deleteEmployee(employeeId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  try {
    // Check if the employee has any pending orders
    const employeeWithOrders = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        pendingOrders: {
          where: {
            status: {
              in: ['ORDERED', 'PROCESSING']
            }
          }
        }
      }
    });
    
    if (employeeWithOrders?.pendingOrders.length) {
      throw new Error("Cannot delete employee with pending orders");
    }
    
    // Delete the employee
    await prisma.employee.delete({
      where: { id: employeeId }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Failed to delete employee");
  }
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  employeeRole: 'ADMIN' | 'EMPLOYEE';
  profileImage?: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  dateOfJoining: string;
}

export async function createEmployee(data: CreateEmployeeData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  try {
    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: data.email }
    });
    
    if (existingEmployee) {
      throw new Error("An employee with this email already exists");
    }
    
    // Create the employee
    const newEmployee = await prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // In a real app, you'd hash this password
        employeeRole: data.employeeRole,
        profileImage: data.profileImage || '',
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        dateOfJoining: data.dateOfJoining,
      }
    });
    
    return newEmployee;
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create employee");
  }
}

// Support Ticket System Actions

interface CreateTicketData {
  subject: string;
  description: string;
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'DATA_QUALITY' | 'FEATURE_REQUEST' | 'OTHER';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  }[];
}

export async function createSupportTicket(data: CreateTicketData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Generate a ticket number with format LFYYMM-XXXX
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `LF${year}${month}-${random}`;

    // Create the support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        userId,
        // Add attachments if provided
        attachments: data.attachments 
          ? {
              createMany: {
                data: data.attachments.map(attachment => ({
                  fileName: attachment.fileName,
                  fileUrl: attachment.fileUrl,
                  fileSize: attachment.fileSize,
                  fileType: attachment.fileType
                }))
              }
            } 
          : undefined
      },
      include: {
        attachments: true
      }
    });

    return { success: true, data: ticket };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function uploadTicketAttachment(base64File: string, fileName: string) {
  try {
    if (!base64File || !base64File.includes('base64')) {
      return { success: false, error: "Invalid file data" };
    }

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Create Supabase client
    const supabase = await createClient();
    
    // Extract content type and base64 data
    const matches = base64File.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return { success: false, error: "Invalid base64 string format" };
    }
    
    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate a unique filename
    const uniqueFileName = `${userId}-${uuidv4()}-${fileName}`;
    const filePath = `ticket-attachments/${uniqueFileName}`;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('support-tickets')
      .upload(filePath, buffer, {
        contentType,
        upsert: true
      });
        
    if (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('support-tickets')
      .getPublicUrl(filePath);
    
    // Return file information
    return { 
      success: true, 
      data: {
        fileName,
        fileUrl: publicUrl,
        fileSize: buffer.length,
        fileType: contentType
      } 
    };
  } catch (error) {
    console.error("Error uploading ticket attachment:", error);
    return { success: false, error: (error as Error).message };
  }
}

interface AddTicketReplyData {
  ticketId: string;
  message: string;
  isInternal?: boolean;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  }[];
}

export async function addTicketReply(data: AddTicketReplyData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if the ticket exists and belongs to the user or if the user is an employee
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: data.ticketId },
      include: { user: true }
    });

    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    // Get the user or employee role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const employee = !user ? await prisma.employee.findFirst({ where: { id: userId } }) : null;

    // If not a user or employee, or if user doesn't own the ticket
    if (!user && !employee) {
      return { success: false, error: "Unauthorized" };
    }

    if (user && ticket.userId !== userId) {
      return { success: false, error: "You don't have permission to reply to this ticket" };
    }

    // Create the reply
    const reply = await prisma.ticketReply.create({
      data: {
        message: data.message,
        ticketId: data.ticketId,
        userId: user ? userId : null,
        employeeId: employee ? userId : null,
        isInternal: data.isInternal || false,
        // Add attachments if provided
        attachments: data.attachments 
          ? {
              createMany: {
                data: data.attachments.map(attachment => ({
                  fileName: attachment.fileName,
                  fileUrl: attachment.fileUrl,
                  fileSize: attachment.fileSize,
                  fileType: attachment.fileType
                }))
              }
            } 
          : undefined
      },
      include: {
        attachments: true,
        user: true,
        employee: true
      }
    });

    // Update the ticket status based on who replied
    let newStatus = ticket.status;
    
    if (user) {
      // If user replied, change status to OPEN or keep it as is if it's already OPEN
      newStatus = ticket.status === 'WAITING_USER_REPLY' ? 'OPEN' : ticket.status;
    } else if (employee) {
      // If employee replied, change status to WAITING_USER_REPLY
      newStatus = 'WAITING_USER_REPLY';
    }

    if (newStatus !== ticket.status) {
      await prisma.supportTicket.update({
        where: { id: data.ticketId },
        data: { status: newStatus }
      });
    }

    return { success: true, data: reply };
  } catch (error) {
    console.error("Error adding ticket reply:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getUserTickets({
  page = 1,
  limit = 10,
  status = undefined,
  sortBy = 'createdAt',
  sortOrder = 'desc'
}: {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Set up filter conditions
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    // Get total count for pagination
    const totalCount = await prisma.supportTicket.count({ where });

    // Fetch tickets with pagination
    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        replies: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            user: true,
            employee: true
          }
        },
        assignedEmployee: true
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      success: true,
      data: {
        tickets,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getTicketDetails(ticketId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the user or employee role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const employee = !user ? await prisma.employee.findFirst({ where: { id: userId } }) : null;

    // Fetch the ticket with all details
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: true,
        assignedEmployee: true,
        resolvedEmployee: true,
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: true,
            employee: true,
            attachments: true
          }
        },
        attachments: true
      }
    });

    if (!ticket) {
      return { success: false, error: "Ticket not found" };
    }

    // Check if the user has access to this ticket
    if (user && ticket.userId !== userId) {
      return { success: false, error: "You don't have permission to view this ticket" };
    }

    // For employees, filter out internal replies if not an employee
    if (!employee) {
      ticket.replies = ticket.replies.filter(reply => !reply.isInternal);
    }

    return { success: true, data: ticket };
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Admin Support Ticket Functions

export async function getAllSupportTickets({
  page = 1,
  limit = 10,
  status = undefined,
  category = undefined,
  priority = undefined,
  assignedToMe = false,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc'
}: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  assignedToMe?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify if the user is an employee
    const employee = await prisma.employee.findFirst({ 
      where: { id: userId } 
    });

    if (!employee) {
      return { success: false, error: "Only employees can access this function" };
    }

    // Set up filter conditions
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (assignedToMe) {
      where.assignedEmployeeId = userId;
    }
    
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.supportTicket.count({ where });

    // Fetch tickets with pagination
    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: true,
        assignedEmployee: true,
        replies: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      success: true,
      data: {
        tickets,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    };
  } catch (error) {
    console.error("Error fetching all support tickets:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateTicketStatus(ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER_REPLY' | 'RESOLVED' | 'CLOSED') {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify if the user is an employee
    const employee = await prisma.employee.findFirst({ 
      where: { id: userId } 
    });

    if (!employee) {
      return { success: false, error: "Only employees can update ticket status" };
    }

    // Update the ticket
    const data: any = { status };

    // If status is RESOLVED, set resolvedAt and resolvedEmployeeId
    if (status === 'RESOLVED') {
      data.resolvedAt = new Date();
      data.resolvedEmployeeId = userId;
    }
    
    // If status is CLOSED, set closedAt
    if (status === 'CLOSED') {
      data.closedAt = new Date();
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data,
      include: {
        user: true,
        assignedEmployee: true,
        resolvedEmployee: true
      }
    });

    return { success: true, data: updatedTicket };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function assignTicket(ticketId: string, employeeId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify if the user is an employee with admin role
    const employee = await prisma.employee.findFirst({ 
      where: { id: userId, employeeRole: 'ADMIN' } 
    });

    if (!employee) {
      return { success: false, error: "Only admins can assign tickets" };
    }

    // Check if the employee to assign exists
    const assignedEmployee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!assignedEmployee) {
      return { success: false, error: "Employee not found" };
    }

    // Update the ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedEmployeeId: employeeId,
        // If the ticket is still OPEN, set it to IN_PROGRESS when assigned
        status: { set: 'IN_PROGRESS' }
      },
      include: {
        user: true,
        assignedEmployee: true
      }
    });

    return { success: true, data: updatedTicket };
  } catch (error) {
    console.error("Error assigning ticket:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateTicketPriority(ticketId: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify if the user is an employee
    const employee = await prisma.employee.findFirst({ 
      where: { id: userId } 
    });

    if (!employee) {
      return { success: false, error: "Only employees can update ticket priority" };
    }

    // Update the ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { priority },
      include: {
        user: true,
        assignedEmployee: true
      }
    });

    return { success: true, data: updatedTicket };
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getTicketById(ticketId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    return { success: false, error: 'You must be logged in to view ticket details' };
  }

  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
        userId, // Ensure user can only access their own tickets
      },
      include: {
        attachments: true,
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            },
            employee: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
      },
    });
    
    if (!ticket) {
      return { success: false, error: 'Ticket not found or you do not have permission to view it' };
    }
    
    return { 
      success: true, 
      data: ticket
    };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return { 
      success: false, 
      error: 'Failed to fetch ticket details. Please try again.'
    };
  }
}
