"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { LogOut } from "lucide-react"
import { BackgroundCard } from "../../components/background-card"
import authService from "../services/auth.service"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  const handleSignOut = () => {
    authService.logout();
    router.push("/login");
  }
  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#93D6F6", opacity: 0.2 }}
          >
            <LogOut className="w-8 h-8" style={{ color: "#93D6F6" }} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Sign Out</h1>
            <p className="text-gray-600">Are you sure you want to sign out?</p>
          </div>

          {/* Whale Character */}
          <div className="py-4">
            <WhaleCharacter expression="sleepy" message="See you later!" size="sm" />
          </div>

          {/* Buttons */}
          <div className="space-y-3 w-full max-w-xs">
            <Button
              onClick={handleSignOut}
              className="w-full text-white py-3 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: "#93D6F6" }}
            >
              Yes, Sign Out
            </Button>
            <Button variant="outline" className="w-full py-3 rounded-lg font-medium">
              {/* <Link href="/dashboard">Cancel</Link> */}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500">You'll be redirected to the login page</p>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}
