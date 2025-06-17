"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { BackgroundLayout } from "../../components/background-layout"
import { WhaleCharacter } from "../../components/whale-character"
import { BackgroundCard } from "../../components/background-card"
import Cookies from 'js-cookie'
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import authService from "../services/auth.service"

export default function SignupOTPPage() {
  const email = Cookies.get("email-signup") || "";
  const otp_store = Cookies.get("otp-signup") || "";
  const router = useRouter()
  
  const inputRefs = useRef<HTMLInputElement[]>([]);
  
  if (!email) {
    return (
      <BackgroundLayout>
        <BackgroundCard>
          <div className="text-center text-gray-600">
            <h1 className="text-2xl font-bold">No email found!</h1>
            <p>Please start the registration process first.</p>
            <Link href="/register" className="text-blue-500 hover:underline">
              Go to Register
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
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    const otp_string = newOtp.join("");
    if (otp_string.length === 6) {
      setIsVerifying(true);
      
      try {
        // Verify OTP
        const verifyResponse = await authService.verifySignupOtp(email, otp_string);
        if (verifyResponse.status === 200) {
          setMessage("Email verified successfully! Creating your account...");
          setMessageType("success");
          
          // Get registration data from localStorage
          const registrationData = JSON.parse(localStorage.getItem("registrationData") || "{}");
          
          // Complete registration
          const signupResponse = await authService.signup(registrationData);
          if (signupResponse.status === 200) {
            // Clear cookies and localStorage
            Cookies.remove("email-signup");
            Cookies.remove("otp-signup");
            localStorage.removeItem("registrationData");
            
            // Redirect to login
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        }
      } catch (error: any) {
        setMessage(error.message || "Verification failed. Please try again.");
        setMessageType("error");
        setIsVerifying(false);
        
        // Clear OTP inputs after error
        setTimeout(() => {
          setOtp(["","", "", "", "", ""]);
          setMessage("");
          setMessageType("");
          inputRefs.current[0]?.focus();
        }, 2000);
      }
    } else {
      setMessage("");
      setMessageType("");
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
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
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
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
              <form className="space-y-4">
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
              </form>

              {/* Resend */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Didn't receive the code?</p>
                <Button 
                  variant="ghost" 
                  disabled={isVerifying}
                  className={`${isVerifying ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                  style={{ color: "#93D6F6" }}
                  onClick={async () => {
                    try {
                      const response = await authService.requestSignupOtp(email);
                      if (response.status === 200) {
                        Cookies.set("otp-signup", response.data, { expires: 5 / 1440 });
                        setMessage("New code sent! Please check your email.");
                        setMessageType("success");
                      }
                    } catch (error: any) {
                      setMessage(error.message || "Failed to resend code");
                      setMessageType("error");
                    }
                  }}
                >
                  Resend Code
                </Button>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link href="/register" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Register
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