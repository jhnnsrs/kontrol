import os

content = r"""import { useState } from 'react'
import { verifyEmail } from '../lib/allauth'
import { Navigate, Link } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, GalleryVerticalEnd } from "lucide-react"

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
})

export const VerifyEmailByCodeForm = () => {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  function onSubmit (data: z.infer<typeof formSchema>) {
    setGlobalError(null)
    verifyEmail(data.code).then((content) => {
      if ([200, 401].includes(content.status)) {
        setSuccess(true)
      } else {
        if (content.errors) {
             if (content.errors.key) {
                 form.setError("code", { message: content.errors.key.join(" ") })
             }
             if (content.errors.non_field_errors) {
                 setGlobalError(content.errors.non_field_errors.join(" "))
             }
             if (!content.errors.key && !content.errors.non_field_errors) {
                 setGlobalError("Verification failed.")
             }
        } else {
            setGlobalError("An error occurred.")
        }
      }
    }).catch((e) => {
      console.error(e)
      setGlobalError("An unexpected error occurred.")
    })
  }

  if (success) {
    return <Navigate to='/account/email' />
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Confirm Email Address</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter the code you received to confirm your email address.
        </p>
      </div>
      
      {globalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} autoComplete="one-time-code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Confirm
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        <Link to="/account/login" className="underline underline-offset-4">
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default function VerifyEmailByCode () {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <VerifyEmailByCodeForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
"""

with open(
    "/home/jhnnsrs/Code/deployments/next/mounts/kontrol/src/account/VerifyEmailByCode.tsx",
    "w",
) as f:
    f.write(content)
