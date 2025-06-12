"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { BackgroundCard } from "../../components/background-card"
import Cookies from 'js-cookie';
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function OTPPage() {
  // Retrieve email from cookies
  // This email is set when the user requests a password reset
  const email = Cookies.get("email-reset") || "";
  const otp_store = Cookies.get("otp") || "";
  const router = useRouter()
  
  // Create refs for each input
  const inputRefs = useRef<HTMLInputElement[]>([]);
  
  if (!email) {
    return (
      <BackgroundLayout>
        <BackgroundCard>
          <div className="text-center text-gray-600">
            <h1 className="text-2xl font-bold">No email found!</h1>
            <p>Please request a password reset first.</p>
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Go to Forgot Password
            </Link>
          </div>
        </BackgroundCard>
      </BackgroundLayout>
    );
  }
  
  const [otp, setOtp] = useState(["","", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleOtpChange = async (index: number, value: string) => {
    // check if input is a number
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input if current input has value and not the last input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    const otp_string = newOtp.join("");
    if (otp_string.length === 6) {
      setIsVerifying(true);
      
      // Check if the OTP matches the stored OTP
      if (otp_string === otp_store) {
        setMessage("OTP verified successfully! Redirecting...");
        setMessageType("success");
        
        // Delay before redirecting
        setTimeout(() => {
          router.push("/reset-password");
        }, 2000);
      } else {
        setMessage("Invalid OTP. Please try again.");
        setMessageType("error");
        setIsVerifying(false);
        
        // Clear OTP inputs after error and focus first input
        setTimeout(() => {
          setOtp(["","", "", "", "", ""]);
          setMessage("");
          setMessageType("");
          inputRefs.current[0]?.focus();
        }, 2000);
      }
    } else {
      // Clear message when user is still typing
      setMessage("");
      setMessageType("");
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle arrow keys navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    
    if (pastedData.length <= 6) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      
      // Focus the next empty input or the last input if all are filled
      const nextEmptyIndex = newOtp.findIndex(digit => digit === "");
      const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
      inputRefs.current[focusIndex]?.focus();
      
      // If we have 6 digits, trigger verification
      if (pastedData.length === 6) {
        handleOtpChange(5, pastedData[5]);
      }
    }
  };
  
  return (
    <BackgroundLayout>
      <BackgroundCard>
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          {/* Left side - OTP Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full space-y-6">
              {/* Title */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
                <p className="text-gray-600">
                  We've sent a 6-digit code to{" "}
                  <span className="font-medium" style={{ color: "#93D6F6" }}>
                    {email}
                  </span>
                </p>
              </div>

              {/* OTP Form */}
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          if (el) inputRefs.current[index] = el;
                        }}
                        value={otp[index] || ""}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        type="text"
                        maxLength={1}
                        disabled={isVerifying}
                        className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:border-transparent ${
                          isVerifying ? 'opacity-50 cursor-not-allowed' : 'border-gray-200'
                        }`}
                        style={{ "--tw-ring-color": "#93D6F6" } as React.CSSProperties}
                      />
                    ))}
                  </div>
                  
                  {/* Message Box */}
                  {message && (
                    <div className={`p-3 rounded-lg text-center font-medium ${
                      messageType === "success" 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}>
                      {message}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className={`w-full text-white py-3 rounded-lg font-medium transition-colors ${
                    isVerifying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                  style={{ backgroundColor: "#93D6F6" }}
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>
              </form>

              {/* Resend */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Didn't receive the code?</p>
                <Button 
                  variant="ghost" 
                  disabled={isVerifying}
                  className={`${isVerifying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                  style={{ color: "#93D6F6" }}
                >
                  Resend Code
                </Button>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex items-center justify-center relative overflow-hidden">
            <WhaleCharacter 
              expression={messageType === "success" ? "happy" : "winking"} 
              message={messageType === "success" ? "Success!" : "Check your email!"} 
            />
          </div>
        </div>
      </BackgroundCard>
    </BackgroundLayout>
  )
}