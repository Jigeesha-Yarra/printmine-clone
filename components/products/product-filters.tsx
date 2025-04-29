"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Category } from "@/types/category"

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category") as string] : [],
  )

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) => (checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)))
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Handle categories
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories[0])
    } else {
      params.delete("category")
    }

    // Handle price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    router.push(`/products?${params.toString()}`)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 5000])
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Price Range</h3>
        <Slider
          defaultValue={priceRange}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-6"
        />
        <div className="flex items-center justify-between">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 pt-4">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
