"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuthContext } from "@/contexts/auth-context"
import { User, Mail, Phone, MapPin, Calendar, Shield, Loader2, AlertCircle } from "lucide-react"
import { useUpdateProfile, useGetAddress, useUpsertAddress } from "@/api/auth"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const { toast } = useToast()

  // Fetch address data
  const { data: addressData, isLoading: isLoadingAddress, error: addressError } = useGetAddress()

  // Mutations
  const updateProfileMutation = useUpdateProfile()
  const upsertAddressMutation = useUpsertAddress()

  // State management
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const [addressFormData, setAddressFormData] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  })

  // Sync user data with form
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  // Sync address data with form
  useEffect(() => {
    if (addressData?.data) {
      setAddressFormData({
        address: addressData.data.address || "",
        city: addressData.data.city || "",
        state: addressData.data.state || "",
        zip: addressData.data.zip || "",
        phone: addressData.data.phone || "",
      })
    }
  }, [addressData])

  // Show form when editing and no address exists
  useEffect(() => {
    if (isEditingAddress && !addressData?.data && !isLoadingAddress) {
      // Keep form empty for new address
      setAddressFormData({
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
      })
    }
  }, [isEditingAddress, addressData, isLoadingAddress])

  // Handlers for profile
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleProfileSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileData)
      setIsEditingProfile(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleProfileCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
    setIsEditingProfile(false)
  }

  // Handlers for address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAddressSubmit = async () => {
    try {
      await upsertAddressMutation.mutateAsync({
        address: addressFormData.address,
        city: addressFormData.city,
        state: addressFormData.state,
        zip: addressFormData.zip,
      })
      setIsEditingAddress(false)
      toast({
        title: "Success",
        description: "Address updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      })
    }
  }

  const handleAddressCancel = () => {
    if (addressData?.data) {
      setAddressFormData({
        address: addressData.data.address || "",
        city: addressData.data.city || "",
        state: addressData.data.state || "",
        zip: addressData.data.zip || "",
        phone: addressData.data.phone || "",
      })
    }
    setIsEditingAddress(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Account Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your basic account details and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </div>
                <p className="font-medium text-lg">{user?.name}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </div>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Account Role</span>
                </div>
                <p className="font-medium text-lg capitalize">{user?.role?.toLowerCase()}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since</span>
                </div>
                <p className="font-medium text-lg">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Update your contact details</CardDescription>
              </div>
              {!isEditingProfile && (
                <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+880 1234567890"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className="bg-background"
                />
              </div>

              {isEditingProfile && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleProfileSubmit}
                    className="bg-primary hover:bg-primary/90"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleProfileCancel}
                    disabled={updateProfileMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
                <CardDescription>Manage your default delivery location</CardDescription>
              </div>
              {!isEditingAddress && (
                <Button variant="outline" onClick={() => setIsEditingAddress(true)}>
                  {addressData?.data ? "Edit Address" : "Add Address"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingAddress ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Street Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    value={addressFormData.address}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                    className="bg-background"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Dhaka"
                      value={addressFormData.city}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      State/Division
                    </label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Dhaka"
                      value={addressFormData.state}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium">
                      Postal Code
                    </label>
                    <Input
                      id="zip"
                      name="zip"
                      placeholder="1200"
                      value={addressFormData.zip}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address_phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Phone (Optional)
                  </label>
                  <Input
                    id="address_phone"
                    name="phone"
                    type="tel"
                    placeholder="+880 1234567890"
                    value={addressFormData.phone}
                    onChange={handleAddressChange}
                    disabled={!isEditingAddress}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alternative contact number for delivery purposes
                  </p>
                </div>

                {isEditingAddress && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddressSubmit}
                      className="bg-primary hover:bg-primary/90"
                      disabled={upsertAddressMutation.isPending}
                    >
                      {upsertAddressMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Address
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAddressCancel}
                      disabled={upsertAddressMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}