"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CustomizationOption } from "@/types/product"

interface ProductCustomizationProps {
  options: CustomizationOption[]
}

export function ProductCustomization({ options }: ProductCustomizationProps) {
  const [customizations, setCustomizations] = useState<Record<string, string>>({})

  const handleCustomizationChange = (id: string, value: string) => {
    setCustomizations((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h3 className="font-medium">Customize Your Product</h3>

      {options.map((option) => (
        <div key={option.id} className="space-y-2">
          <Label htmlFor={option.id}>{option.name}</Label>

          {option.type === "text" && (
            <Input
              id={option.id}
              placeholder={option.placeholder || `Enter ${option.name}`}
              value={customizations[option.id] || ""}
              onChange={(e) => handleCustomizationChange(option.id, e.target.value)}
            />
          )}

          {option.type === "textarea" && (
            <Textarea
              id={option.id}
              placeholder={option.placeholder || `Enter ${option.name}`}
              value={customizations[option.id] || ""}
              onChange={(e) => handleCustomizationChange(option.id, e.target.value)}
            />
          )}

          {option.type === "select" && option.choices && (
            <Select
              value={customizations[option.id] || ""}
              onValueChange={(value) => handleCustomizationChange(option.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${option.name}`} />
              </SelectTrigger>
              <SelectContent>
                {option.choices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  )
}
