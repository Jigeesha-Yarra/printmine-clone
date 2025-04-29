import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gray-100 my-6 rounded-lg">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="p-8 md:p-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="block">CUSTOMIZED</span>
              <span className="block text-blue-600">MAGNETIC</span>
              <span className="block text-blue-600">BADGES</span>
            </h1>
            <p className="text-xl font-medium uppercase">WITH YOUR BRAND LOGO</p>
            <div className="mt-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/products?category=magnetic-badge">SHOP NOW</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px]">
          <Image src="/professional-badge.png" alt="Customized Magnetic Badges" fill className="object-cover" />
        </div>
      </div>

      <div className="absolute left-0 top-0 h-full">
        <div className="h-full w-12 flex flex-col items-center justify-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}
