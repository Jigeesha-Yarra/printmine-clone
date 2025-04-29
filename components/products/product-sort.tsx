"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductSort() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("sort", value)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select defaultValue={searchParams.get("sort") || "newest"} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-low-high">Price: Low to High</SelectItem>
        <SelectItem value="price-high-low">Price: High to Low</SelectItem>
        <SelectItem value="popularity">Popularity</SelectItem>
      </SelectContent>
    </Select>
  )
}
