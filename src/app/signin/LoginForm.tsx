'use client'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import LoadingSpinner from '@/components/LoadingSpinner'
import { loginSchema } from './validation'

type LoginFormInputs = z.infer<typeof loginSchema>

export default function LoginForm({
  onSubmit,
  isHydrated,
  authLoading,
}: {
  onSubmit: (data: LoginFormInputs) => void
  isHydrated: boolean
  authLoading: boolean
  authError?: string
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
   
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => setShowPassword((prev) => !prev)

  // Trigger validation on hydration
  useEffect(() => {
    if (isHydrated) {
     
    }
  }, [isHydrated])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#262C05] font-poppins"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 mt-1 text-sm font-poppins">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-poppins">
            Password
          </label>
          {/* <a href="/forget-password" className="text-sm text-[#4d5907] hover:text-[#1a2003] font-poppins">
            Forgot password?
          </a> */}
        </div>
        <div className="relative group">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full px-4 py-3.5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#262C05] font-poppins"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 "
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 mt-1 text-sm font-poppins">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!isHydrated || authLoading || !isValid}
        className="w-full bg-[#262C05] hover:bg-[#1a2003] text-white font-semibold py-3.5 px-4 rounded-lg transition duration-200 font-poppins shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isHydrated ? (
          'Loading...'
        ) : authLoading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
            Signing in...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
