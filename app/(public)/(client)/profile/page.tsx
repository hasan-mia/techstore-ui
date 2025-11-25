"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuthContext } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="max-w-2xl">
        <Card className="bg-background border-border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground mt-4">Email</p>
            <p className="font-medium">{user?.email}</p>
            <p className="text-sm text-muted-foreground mt-4">Role</p>
            <p className="font-medium capitalize">{user?.role}</p>
            <p className="text-sm text-muted-foreground mt-4">Member Since</p>
            <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
        </Card>

        <Card className="bg-background border-border p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="text-sm font-medium block mb-2">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="bg-muted border-border"
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium block mb-2">
                Delivery Address
              </label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City, State 12345"
                value={formData.address}
                onChange={handleChange}
                className="bg-muted border-border"
              />
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
