import { useState } from 'react'
import { signUp } from '../lib/allauth'
import { Link, useNavigate } from 'react-router-dom'
import { useConfig } from '../auth'
import ProviderList from '../socialaccount/ProviderList'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, GalleryVerticalEnd } from "lucide-react"
import ServiceLogo from '@/components/ServiceLogo'

const signupSchema = z.object({
  username: z.string(),
  password: z.string().min(1, "Password is required"),
  passwordConfirm: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

const SignupForm = () => {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const config = useConfig()
  const hasProviders = config.data.socialaccount?.providers?.length > 0
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
    },
  })

  function onSubmit(values: z.infer<typeof signupSchema>) {
    setGlobalError(null)
    signUp({ username: values.username, password: values.password }).then((content) => {
      if (content.status === 200) {
        // Redirect to login page after successful signup
        navigate('/account/login')
      } else {
        if (content.errors) {
            Object.entries(content.errors).forEach(([key, value]) => {
                if (key === 'email' || key === 'password') {
                     form.setError(key as any, { message: Array.isArray(value) ? value.join(" ") : String(value) })
                } else {
                    setGlobalError(Array.isArray(value) ? value.join(" ") : String(value))
                }
            })
        } else {
            setGlobalError("An error occurred.")
        }
      }
    }).catch((e) => {
      console.error(e)
      setGlobalError("An unexpected error occurred.")
    })
  }

  return (
    <div className="space-y-4">
      {globalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your details below to create a new account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Sign Up
            </Button>
          </form>
        </Form>
        
        {hasProviders && (
          <div>
              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                  </span>
                  </div>
              </div>
              <div className="mt-4">
                  <ProviderList />
              </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link to='/account/login' className="underline text-primary underline-offset-4 hover:text-primary/80">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function Signup() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 h-screen w-[40vw] lg:block">
         <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 py-10" />
        <ServiceLogo service={"arkitekt.live"} />
      </div>
    </div>
  )
}
