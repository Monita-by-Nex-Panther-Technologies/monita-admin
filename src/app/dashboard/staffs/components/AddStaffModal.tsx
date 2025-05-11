"use client"
import React, { useState, type ChangeEvent, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStaffStore, CreateStaffPayload } from "@/store/staffStore"
import { useRolesStore } from "@/store/rolesStore"
import { toast } from "sonner"

interface AddStaffModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
    open,
    onOpenChange,
    onSuccess
}) => {
    const [formData, setFormData] = useState<CreateStaffPayload>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        roleId: ""
    })
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const { createStaff } = useStaffStore()
    const { roles, getRoles, isLoading: isLoadingRoles } = useRolesStore()
    
    useEffect(() => {
        if (open) {
            const fetchRoles = async () => {
                try {
                    await getRoles()
                } catch (error) {
                    console.error("Failed to fetch roles:", error)
                    toast.error("Failed to load roles")
                }
            }
            
            fetchRoles()
        }
    }, [open, getRoles])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const formatPhoneNumber = (phone: string): string => {
        const digitsOnly = phone.replace(/\D/g, '')
        
        if (digitsOnly.startsWith('234')) {
            return `+${digitsOnly}`
        }
        
        if (digitsOnly.startsWith('0')) {
            return `+234${digitsOnly.substring(1)}`
        }
        
        return `+234${digitsOnly}`
    }

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.roleId) {
            toast.error("Please fill all required fields")
            return
        }
        
        try {
            setIsSubmitting(true)
            
            const formattedData = {
                ...formData,
                phoneNumber: formatPhoneNumber(formData.phoneNumber)
            }
            
            await createStaff(formattedData)
            toast.success(`Staff ${formData.firstName} ${formData.lastName} added successfully!`)
            
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                roleId: ""
            })
            
            onOpenChange(false)
            if (onSuccess) {
                onSuccess()
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to add staff")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-auto max-h-[90vh]">
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Add Staff</DialogTitle>
                    </div>
                </div>

                <div className="h-[1px] bg-gray-200 w-full my-6"></div>

                <div className="p-6 pt-0">
                    <div className="bg-white rounded-lg space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-medium">
                                    First Name*
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Enter first name"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium">
                                    Last Name*
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Enter last name"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address*
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                    Phone Number*
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                    required
                                />
                                
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roleId" className="text-sm font-medium">
                                Role*
                            </Label>
                            <Select 
                                value={formData.roleId} 
                                onValueChange={(value) => setFormData(prev => ({...prev, roleId: value}))}
                                disabled={isLoadingRoles}
                            >
                                <SelectTrigger id="roleId" className="h-10 w-full text-sm rounded-lg border-gray-300">
                                    <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select role"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingRoles}
                        className="w-full h-12 mt-4 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
                        variant="ghost"
                    >
                        {isSubmitting ? "Adding Staff..." : "Add Staff"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddStaffModal