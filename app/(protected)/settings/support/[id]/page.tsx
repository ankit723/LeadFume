'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getTicketDetails, addTicketReply } from '@/app/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  ChevronLeft, 
  Paperclip, 
  Send, 
  ArrowUpCircle,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';


export default function TicketDetailPage() {
  const ticketId = useParams().id as string;
  
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  useEffect(() => {
    toast.error('Error in file upload please try again');
  }, [fileUploadError])

  const fetchTicketDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getTicketDetails(ticketId);
      
      if (result.success) {
        setTicket(result.data);
      } else {
        throw new Error(result.error || 'Failed to load ticket details');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError((err as Error).message || 'An error occurred while loading ticket details');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setFileUploadError(null);
    setIsSubmitting(true);
    
    try {
      // We're not handling file attachments for now
      // Just send the reply without attachments
      const result = await addTicketReply({
        ticketId,
        message: replyMessage
      });
      
      if (result.success) {
        toast.success('Reply sent successfully');
        setReplyMessage('');
        fetchTicketDetails(); // Refresh ticket data to show the new reply
      } else {
        throw new Error(result.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error((error as Error).message || 'Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case 'WAITING_USER_REPLY':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Waiting for Reply</Badge>;
      case 'RESOLVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case 'CLOSED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Low</Badge>;
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Medium</Badge>;
      case 'HIGH':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>;
      case 'CRITICAL':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <Skeleton className="h-10 w-64" />
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!ticket) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The requested ticket could not be found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/settings/support">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Tickets
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="text-sm text-muted-foreground">
              Ticket #{ticket.ticketNumber}
            </div>
            <span className="text-muted-foreground">•</span>
            <div>{getStatusBadge(ticket.status)}</div>
            <span className="text-muted-foreground">•</span>
            <div>{getPriorityBadge(ticket.priority)}</div>
            <span className="text-muted-foreground">•</span>
            <div className="text-sm text-muted-foreground">
              Created {formatDate(ticket.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>
            Category: {ticket.category.replace(/_/g, ' ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Initial ticket message */}
          <div className="p-4 bg-muted/40 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback>{ticket.user?.firstName?.[0] || 'U'}</AvatarFallback>
                {ticket.user?.profileImage && (
                  <AvatarImage src={ticket.user.profileImage} alt={ticket.user.firstName} />
                )}
              </Avatar>
              <div>
                <div className="font-medium">
                  {ticket.user?.firstName || 'User'} {ticket.user?.lastName || ''}
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(ticket.createdAt)}
                </div>
              </div>
            </div>
            <div className="ml-12">
              <div className="whitespace-pre-wrap mb-3">{ticket.description}</div>
              
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <div className="text-sm font-medium mb-2">Attachments</div>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((attachment: any) => (
                      <a 
                        key={attachment.id}
                        href={attachment.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm bg-background rounded-md px-3 py-1.5 border hover:bg-muted transition-colors"
                      >
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{attachment.fileName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Replies */}
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="text-sm text-muted-foreground">
                {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
              </div>
              
              {ticket.replies.map((reply: any) => (
                <div 
                  key={reply.id} 
                  className={`p-4 rounded-lg ${
                    reply.employee ? 'bg-blue-50/40 border border-blue-100' : 'bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      {reply.employee ? (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {reply.employee.name?.[0] || 'S'}
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback>
                          {reply.user?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      )}
                      {reply.user?.profileImage && (
                        <AvatarImage src={reply.user.profileImage} alt={reply.user.firstName} />
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {reply.employee ? (
                          <>
                            {reply.employee.name || 'Support Agent'}
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs py-0">Staff</Badge>
                          </>
                        ) : (
                          <>
                            {reply.user?.firstName || 'User'} {reply.user?.lastName || ''}
                          </>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(reply.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="ml-12">
                    <div className="whitespace-pre-wrap mb-3">{reply.message}</div>
                    
                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <div className="text-sm font-medium mb-2">Attachments</div>
                        <div className="flex flex-wrap gap-2">
                          {reply.attachments.map((attachment: any) => (
                            <a 
                              key={attachment.id}
                              href={attachment.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm bg-background rounded-md px-3 py-1.5 border hover:bg-muted transition-colors"
                            >
                              <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{attachment.fileName}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* If ticket is not closed, show reply form */}
          {ticket.status !== 'CLOSED' && (
            <form onSubmit={handleSubmitReply} className="pt-2 space-y-3">
              <div className="font-medium text-sm">Add Reply</div>
              <Textarea
                placeholder="Type your message here..."
                rows={4}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                disabled={isSubmitting}
              />
              
              {/* File attachments - temporarily disabled */}
              {/*
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Attachments (Optional)</label>
                  <Input 
                    id="attachment" 
                    type="file" 
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept="image/png,image/jpeg,image/gif,application/pdf"
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('attachment')?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Files
                  </Button>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            {file.file.type.includes('image') ? (
                              <img 
                                src={file.preview} 
                                alt={file.file.name} 
                                className="w-6 h-6 object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-primary/20 rounded-sm"></div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{file.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-green-600 bg-green-50">
                            Ready
                          </Badge>
                          
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {fileUploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fileUploadError}</AlertDescription>
                  </Alert>
                )}
                
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 10MB. Accepted formats: JPG, PNG, GIF, PDF
                </p>
              </div>
              */}
              
              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !replyMessage.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* If ticket is closed, show reopen option */}
          {ticket.status === 'CLOSED' && (
            <div className="pt-4 border-t text-center">
              <div className="text-muted-foreground mb-4">
                This ticket is closed. If you need further assistance, you can create a new ticket.
              </div>
              <Link href="/help/contact">
                <Button variant="outline">
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Create New Ticket
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 