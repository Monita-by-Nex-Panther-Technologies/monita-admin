'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MonitaLogo from '@/assets/images/MonitaLogo.png'
import Image from 'next/image'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { z } from 'zod'
import { loginSchema } from './validation' // make sure this path is correct
import { useHydrated } from '@/hooks/useHydrated'
import LoginForm from './LoginForm'
import { useUserStore } from '@/store/userStore'

export  type LoginFormInputs = z.infer<typeof loginSchema>

const LoginScreen = () => {
  const router = useRouter()
  const isHydrated = useHydrated()

  const {
    login,
    isAuthenticated,
    token,
    isLoading: authLoading,
  } = useAuthStore()

  const {
    getUser,
  } = useUserStore()

  useEffect(() => {
    if (isAuthenticated && token) {
      getUser()
      router.push('/dashboard')
    }
  }, [isAuthenticated, token, router])

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data)
      toast.success('Login successful! Redirecting...')
    } catch (error: any) {
      toast.error(error?.message || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[420px] mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Image
              src={MonitaLogo}
              alt="Monita Logo"
              width={140}
              height={50}
              style={{ height: 'auto' }}
              className="h-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-3 text-gray-800">
            Monita Admin
          </h1>
          <p className="text-text-body text-sm sm:text-base font-poppins">
            Sign in to your account
          </p>
        </div>

        <LoginForm
          onSubmit={onSubmit}
          isHydrated={isHydrated}
          authLoading={authLoading}
        />

        <div className="text-center mt-10">
          <p className="text-xs sm:text-sm text-gray-500 font-poppins">
            © {new Date().getFullYear()} Monita Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
