"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react"

interface AddServiceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddService: (service: {
        name: string
        disabled: boolean
        hasUtility: boolean
        hasPlan: boolean
    }) => void
}

const AddServiceModal = ({ open, onOpenChange, onAddService }: AddServiceModalProps) => {
    const [selectedService, setSelectedService] = useState("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [hasUtility, setHasUtility] = useState(false)
    const [hasPlan, setHasPlan] = useState(false)

    const serviceOptions = [
        "Airtime",
        "Data Top Up",
        "Cable TV",
        "Education",
        "Electricity",
        "Internet",
        "Gift Cards",
        "eSIMs",
    ]

    const handleSubmit = () => {
        if (!selectedService) return

        onAddService({
            name: selectedService,
            disabled,
            hasUtility,
            hasPlan,
        })

        // Reset form
        setSelectedService("")
        setDisabled(false)
        setHasUtility(false)
        setHasPlan(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 overflow-hidden max-w-md rounded-lg">
                <DialogHeader className="p-4 border-b">
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-base font-medium">Add Service</DialogTitle>
                        <button onClick={() => onOpenChange(false)} className="text-sm text-gray-500 flex items-center">
                            Close <span className="ml-1">×</span>
                        </button>
                    </div>
                </DialogHeader>

                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Service Name</Label>
                            <div className="relative">
                                <button
                                    className="w-full flex justify-between items-center px-3 py-2 border rounded-md text-left"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {selectedService || "Select"}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                        {serviceOptions.map((service) => (
                                            <div
                                                key={service}
                                                className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedService(service)
                                                    setIsDropdownOpen(false)
                                                }}
                                            >
                                                {service}
                                                <ChevronRight size={16} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Disable</span>
                                    <Switch checked={disabled} onCheckedChange={setDisabled} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Has Utility</span>
                                    <Switch checked={hasUtility} onCheckedChange={setHasUtility} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Has Plan</span>
                                    <Switch checked={hasPlan} onCheckedChange={setHasPlan} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <Button onClick={handleSubmit} className="w-full py-2 bg-[#f8ffa3] hover:bg-[#f1f88e] text-black rounded-md">
                        Create Service
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddServiceModal

