"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface NaverBookingButtonProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const NAVER_BOOKING_URL = "http://map.naver.com/p/search/%EC%B2%B4%EC%96%B4%ED%8C%8C%ED%81%AC/place/2029627196?searchType=place&lng=127.0071253&lat=37.5336229&placePath=/booking?bookingRedirectUrl=https://m.booking.naver.com/booking/10/bizes/1400496?theme=place&entry=pll&lang=ko&entry=pll&area=pll"

export function NaverBookingButton({ 
  children, 
  className = "", 
  size = "lg",
  variant = "default"
}: NaverBookingButtonProps) {
  const handleBooking = () => {
    window.open(NAVER_BOOKING_URL, '_blank')
  }

  return (
    <Button 
      className={className}
      size={size}
      variant={variant}
      onClick={handleBooking}
    >
      {children}
    </Button>
  )
}

// 특별한 스타일을 위한 네이버 예약 버튼들
export function NaverBookingButtonGreen({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <NaverBookingButton 
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <Calendar className="h-4 w-4 mr-1" />
      {children}
    </NaverBookingButton>
  )
}

export function NaverBookingButtonWhite({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <NaverBookingButton 
      className={`bg-white text-slate-900 shadow-lg hover:bg-white/90 ${className}`}
    >
      {children}
    </NaverBookingButton>
  )
}
