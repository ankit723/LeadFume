'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSubscriptionTypes, updateSubscriptionType, deleteSubscriptionType } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type SubscriptionType = {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  annualDiscount: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const AdminSubscriptionsPage = () => {
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    credits: 0,
    annualDiscount: 0,
    isPopular: false,
    isActive: true
  });
  const router = useRouter();

  // Load subscription types
  useEffect(() => {
    const loadSubscriptionTypes = async () => {
      setIsLoading(true);
      try {
        const result = await getSubscriptionTypes();
        if (result.success && result.data) {
          const formattedData = result.data.map((type: any) => ({
            id: type.id || '',
            name: type.name || '',
            description: type.description || '',
            price: type.price || 0,
            credits: type.credits || 0,
            annualDiscount: type.annualDiscount || 0,
            isPopular: !!type.isPopular,
            isActive: !!type.isActive,
            createdAt: type.createdAt?.toString() || '',
            updatedAt: type.updatedAt?.toString() || ''
          }));
          setSubscriptionTypes(formattedData);
        } else {
          toast.error(result.error || 'Failed to load subscription types');
        }
      } catch (error) {
        console.error('Error loading subscription types:', error);
        toast.error('Failed to load subscription types');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptionTypes();
  }, []);

  const handleEditClick = (subscription: SubscriptionType) => {
    setCurrentSubscription(subscription);
    setFormData({
      name: subscription.name,
      description: subscription.description,
      price: subscription.price,
      credits: subscription.credits,
      annualDiscount: subscription.annualDiscount,
      isPopular: subscription.isPopular,
      isActive: subscription.isActive
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'credits' || name === 'annualDiscount' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveChanges = async () => {
    if (!currentSubscription) return;
    
    setIsEditing(true);
    try {
      const result = await updateSubscriptionType({
        id: currentSubscription.id,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        credits: formData.credits,
        annualDiscount: formData.annualDiscount,
        isPopular: formData.isPopular,
        isActive: formData.isActive
      });
      
      if (result.success) {
        toast.success('Subscription type updated successfully');
        // Update local state
        setSubscriptionTypes(prev => 
          prev.map(item => 
            item.id === currentSubscription.id 
              ? { ...item, ...formData } 
              : item
          )
        );
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Failed to update subscription type');
      }
    } catch (error) {
      console.error('Error updating subscription type:', error);
      toast.error('Failed to update subscription type');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteSubscriptionType(id);
      if (result.success) {
        toast.success('Subscription type deleted successfully');
        // Update local state
        setSubscriptionTypes(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error(result.error || 'Failed to delete subscription type');
      }
    } catch (error) {
      console.error('Error deleting subscription type:', error);
      toast.error('Failed to delete subscription type');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading subscription types...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Subscription Types</h1>
        <Button onClick={() => router.push('/admin/subscription-creator')} variant="default">
          Create New Subscription
        </Button>
      </div>

      {subscriptionTypes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="text-muted-foreground text-center mb-4">
              No subscription types have been created yet.
            </p>
            <Button onClick={() => router.push('/admin/subscription-creator')}>
              Create your first subscription type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptionTypes.map((subscription) => (
            <Card key={subscription.id} className={!subscription.isActive ? 'opacity-60' : ''}>
              <CardHeader className="relative">
                <div className="absolute right-4 top-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditClick(subscription)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the &quot;{subscription.name}&quot; subscription type.
                          This action cannot be undone if there are no active subscriptions using this type.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(subscription.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? 
                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 
                            null
                          }
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <CardTitle className="flex items-center gap-2">
                  {subscription.name || 'Subscription Plan'}
                  {subscription.isPopular && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {subscription.isActive ? 'Active' : 'Inactive'} • ${subscription.price}/month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Features</p>
                    <div className="mt-2 max-h-32 overflow-y-auto text-sm">
                      {subscription.description ? (
                        <ul className="space-y-1">
                          {subscription.description.split('\n').map((line, index) => {
                            if (line.trim().startsWith('+')) {
                              return (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  <span>{line.trim().substring(1).trim()}</span>
                                </li>
                              );
                            } else if (line.trim().startsWith('-')) {
                              return (
                                <li key={index} className="flex items-start">
                                  <span className="text-red-500 mr-2">✗</span>
                                  <span className="text-gray-500">{line.trim().substring(1).trim()}</span>
                                </li>
                              );
                            } else if (line.trim()) {
                              return (
                                <li key={index} className="flex items-start">
                                  <span>{line.trim()}</span>
                                </li>
                              );
                            }
                            return null;
                          }).filter(Boolean)}
                        </ul>
                      ) : (
                        <p>No features provided</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Credits</p>
                      <p className="font-medium">{subscription.credits.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Discount</p>
                      <p className="font-medium">{subscription.annualDiscount}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(subscription.updatedAt).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !isEditing || setIsEditing(open)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the details for this subscription plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Features List)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Enter features separated by new lines. Use + for included features and - for excluded features. Example: + 10 Users&#10;- Advanced Analytics"
              />
              <p className="text-xs text-muted-foreground">
                Enter each feature on a new line. Start with + for included features (✓) and - for excluded features (✗).
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1000"
                  step="1000"
                  value={formData.credits}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="annualDiscount">Annual Discount (%)</Label>
              <Input
                id="annualDiscount"
                name="annualDiscount"
                type="number"
                min="0"
                max="100"
                value={formData.annualDiscount}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => handleSwitchChange('isPopular', checked)}
              />
              <Label htmlFor="isPopular">Mark as &quot;Most Popular&quot;</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isEditing}>
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptionsPage; 