"use client"

import { useState } from "react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("personal")

    return (
        <div className="min-h-screen bg-[#F5F5F5] p-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <div className="grid grid-cols-4 bg-[#F5F5F5] p-1.5 rounded-lg">
                        <button
                            onClick={() => setActiveTab("personal")}
                            className={`rounded-md py-3 px-4 text-sm font-medium transition-colors ${activeTab === "personal" ? "bg-[#CEEF0A]/20 text-text-title" : "bg-white text-text-body"
                                }`}
                        >
                            Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`rounded-md py-3 px-4 text-sm font-medium transition-colors ${activeTab === "security" ? "bg-[#CEEF0A]/20 text-text-title" : "bg-white text-text-body"
                                }`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab("2fa")}
                            className={`rounded-md py-3 px-4 text-sm font-medium transition-colors ${activeTab === "2fa" ? "bg-[#CEEF0A]/20 text-text-title" : "bg-white text-text-body"
                                }`}
                        >
                            2FA
                        </button>
                        <button
                            onClick={() => setActiveTab("notification")}
                            className={`rounded-md py-3 px-4 text-sm font-medium transition-colors ${activeTab === "notification" ? "bg-[#CEEF0A]/20 text-text-title" : "bg-white text-text-body"
                                }`}
                        >
                            Notification
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    {/* Custom tabs navigation is above */}

                    {/* Personal Info Tab */}
                    {activeTab === "personal" && (
                        <div className="bg-white rounded-xl p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center">
                                    <Image
                                        src="/placeholder.svg?height=60&width=60"
                                        alt="Profile"
                                        width={60}
                                        height={60}
                                        className="rounded-full mr-4"
                                    />
                                </div>
                                <Button className="bg-[#CEEF0A] hover:bg-[#BBD423] text-black font-medium">Save Changes</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium text-text-title">
                                        Full Name
                                    </label>
                                    <Input id="fullName" defaultValue="James Matthew" className="bg-input text-text-title" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-text-title">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue="JamesMatthew@gmail.com"
                                        className="bg-input text-text-title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="role" className="block text-sm font-medium text-text-title">
                                        Role
                                    </label>
                                    <Input id="role" defaultValue="Product Manager" className="bg-input text-text-title" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-text-title">
                                        Phone Number
                                    </label>
                                    <div className="flex">
                                        <div className="flex items-center bg-input px-3 rounded-l-md border-r">
                                            <span className="text-sm text-text-body">🇳🇬</span>
                                            <span className="ml-1 text-sm text-text-body">+234</span>
                                        </div>
                                        <Input id="phone" defaultValue="7069774330" className="bg-input text-text-title rounded-l-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="bg-white rounded-xl p-8">
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-xl font-semibold text-text-title">Security</h2>
                                <Button className="bg-[#CEEF0A] hover:bg-[#BBD423] text-black font-medium">Save Changes</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-text-title">
                                        Current Password
                                    </label>
                                    <Input id="currentPassword" type="password" className="bg-input text-text-title" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-text-title">
                                        New Password
                                    </label>
                                    <Input id="newPassword" type="password" className="bg-input text-text-title" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2FA Tab */}
                    {activeTab === "2fa" && (
                        <div className="bg-white rounded-xl p-8">
                            <h2 className="text-xl font-semibold text-text-title mb-8">2FA</h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-base font-medium text-text-title">Email Verification</h3>
                                        <p className="text-sm text-text-body">
                                            Ensure account security by requiring email verification for login attempts.
                                        </p>
                                    </div>
                                    <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Tab */}
                    {activeTab === "notification" && (
                        <div className="bg-white rounded-xl p-8">
                            <h2 className="text-xl font-semibold text-text-title mb-8">Notifications</h2>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-base font-medium text-text-title">Reminders</h3>
                                    <p className="text-sm text-text-body">
                                        These notifications keep you informed about important Monita updates and any updates you may have
                                        missed.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">Push</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">Email</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">SMS</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-base font-medium text-text-title">Reminders</h3>
                                    <p className="text-sm text-text-body">
                                        These are notifications to remind you on any updates pertaining to Monita which you might have
                                        missed.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">Push</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">Email</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">SMS</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-base font-medium text-text-title">Reminders</h3>
                                    <p className="text-sm text-text-body">
                                        These are notifications to remind you on any updates pertaining to Monita which you might have
                                        missed.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">Push</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">Email</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-text-body">SMS</span>
                                            <Switch className="data-[state=checked]:bg-[#CEEF0A]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

