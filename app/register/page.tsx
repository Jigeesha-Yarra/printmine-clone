import { RegisterForm } from "@/components/auth/register-form"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function RegisterPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/account")
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
