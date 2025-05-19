'use client';

import { ChevronRight, Mail, MessageSquare, Phone, Clock, Upload, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createSupportTicket, uploadTicketAttachment } from '@/app/actions';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type FileWithPreview = {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
  data: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  } | null;
};

export default function ContactPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      error: null,
      data: null
    }));
    
    setFiles([...files, ...newFiles]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (fileWithPreview: FileWithPreview, index: number) => {
    // Update file status to uploading
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, uploading: true, error: null } : f
    ));

    try {
      // Convert file to base64
      const fileReader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = () => reject(new Error('Error reading file'));
      });
      
      fileReader.readAsDataURL(fileWithPreview.file);
      const base64File = await base64Promise;
      
      // Upload the file
      const result = await uploadTicketAttachment(
        base64File,
        fileWithPreview.file.name,
      );
      
      if (result.success && result.data) {
        // Update file status to uploaded
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, uploading: false, uploaded: true, data: result.data } : f
        ));
      } else {
        throw new Error(result.error || 'Error uploading file');
      }
    } catch (error) {
      // Update file status to error
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: false, error: (error as Error).message } : f
      ));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    
    // Validate form
    if (!subject.trim()) {
      setSubmissionError('Please enter a subject');
      return;
    }
    
    if (!message.trim()) {
      setSubmissionError('Please enter a message');
      return;
    }
    
    if (!category) {
      setSubmissionError('Please select a category');
      return;
    }
    
    // Upload any remaining files
    const filesToUpload = files.filter(f => !f.uploaded && !f.uploading);
    if (filesToUpload.length > 0) {
      await Promise.all(filesToUpload.map((file) => 
        handleFileUpload(file, files.indexOf(file))
      ));
    }
    
    // Check if any files failed to upload
    const failedFiles = files.filter(f => f.error);
    if (failedFiles.length > 0) {
      setSubmissionError(`Some files failed to upload: ${failedFiles.map(f => f.file.name).join(', ')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const attachments = files
        .filter(f => f.uploaded && f.data)
        .map(f => f.data!);
      
      const result = await createSupportTicket({
        subject,
        description: message,
        category: category as any,
        priority: priority as any,
        attachments
      });
      
      if (result.success) {
        toast.success('Support ticket submitted successfully!');
        router.push(`/dashboard/support/${result.data?.id}`);
      } else {
        throw new Error(result.error || 'Failed to submit support ticket');
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setSubmissionError((error as Error).message || 'Failed to submit your support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Support</h1>
        <p className="text-gray-600">
          Need assistance? Our support team is here to help with any questions or issues you may have.
        </p>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-2">
          <Link href="/help" className="hover:text-primary">Help Center</Link>
          <ChevronRight className="h-4 w-4" />
          <span>Contact Support</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-6">Create Support Ticket</h2>
            
            {submissionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}
            
            <form className="space-y-4 " onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  disabled={isSubmitting} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">Technical Support</SelectItem>
                    <SelectItem value="BILLING">Billing & Subscriptions</SelectItem>
                    <SelectItem value="ACCOUNT">Account Management</SelectItem>
                    <SelectItem value="DATA_QUALITY">Data Quality</SelectItem>
                    <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={priority} 
                  onValueChange={setPriority}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue or question in detail..." 
                  rows={6}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="attachment">Attachments (Optional)</Label>
                  <Input 
                    ref={fileInputRef}
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
                    onClick={() => fileInputRef.current?.click()}
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
                              <Image 
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
                          {file.uploading && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          
                          {file.uploaded && (
                            <Badge variant="outline" className="text-green-600 bg-green-50">
                              Uploaded
                            </Badge>
                          )}
                          
                          {file.error && (
                            <Badge variant="outline" className="text-red-600 bg-red-50">
                              Error
                            </Badge>
                          )}
                          
                          {!file.uploading && !file.uploaded && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleFileUpload(file, index)}
                              className="text-primary"
                            >
                              Upload
                            </Button>
                          )}
                          
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
                
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 10MB. Accepted formats: JPG, PNG, GIF, PDF
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit Ticket'}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">support@leadfume.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-gray-600">Available on the platform</p>
                  <p className="text-xs text-muted-foreground mt-1">During business hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted-foreground mt-1">Enterprise customers only</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Business Hours</h2>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Monday - Friday</p>
                <p className="text-sm font-medium">9:00 AM - 6:00 PM EST</p>
                <p className="text-sm text-gray-600 mt-2">Saturday - Sunday</p>
                <p className="text-sm font-medium">Closed</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Extended hours for Enterprise customers
                </p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-primary/5">
            <h2 className="text-lg font-semibold mb-2">View Your Tickets</h2>
            <p className="text-sm text-gray-600 mb-4">
              Already submitted a ticket? Check the status and view responses in your dashboard.
            </p>
            <Link
              href="/settings/support"
              className="inline-flex items-center text-primary hover:underline text-sm"
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              Go to support dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 