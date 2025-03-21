import React from 'react'
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Account Settings | Leadfume",
  description: "Manage your Leadfume account settings and preferences.",
};

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings and manage your email preferences.
        </p>
      </div>
      <Separator />
      <form className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="your.email@example.com"
              disabled
              defaultValue="user@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Your email is managed by your authentication provider and cannot be changed here.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Your Name"
              defaultValue="John Doe"
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-2">
          <h4 className="font-medium">Email Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Choose what updates you want to receive to your email.
          </p>
          
          <div className="grid gap-4 mt-4">
            {/* Add notification toggles here later */}
          </div>
        </div>
        
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  )
}

export default SettingsPage