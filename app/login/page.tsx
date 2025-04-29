import { LoginForm } from "@/components/auth/login-form"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect("/account")
  }

  const redirectUrl = typeof searchParams.redirect === "string" ? searchParams.redirect : "/account"

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Login to Your Account</h1>
        <LoginForm redirectUrl={redirectUrl} />
      </div>
    </div>
  )
}
