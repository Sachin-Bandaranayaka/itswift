"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  { id: "custom-elearning", name: "Custom eLearning", price: 5000 },
  { id: "corporate-training", name: "Corporate Training", price: 3000 },
  { id: "microlearning", name: "Microlearning", price: 2000 },
  { id: "video-production", name: "Video Production", price: 4000 },
]

export function PricingCalculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const totalPrice = selectedServices.reduce((sum, id) => sum + (services.find((s) => s.id === id)?.price || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Calculator</CardTitle>
        <CardDescription>Select the services you're interested in to get an estimated price.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center space-x-2">
              <Checkbox
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => toggleService(service.id)}
              />
              <label
                htmlFor={service.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {service.name} - ${service.price}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-semibold">Total Estimated Price:</span>
          <span className="text-2xl font-bold">${totalPrice}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

