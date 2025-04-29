import { Check, Package, Truck, CreditCard } from "lucide-react"

const features = [
  {
    icon: <Check className="h-8 w-8 text-primary" />,
    title: "Quality Assurance",
    description: "Premium materials and craftsmanship for lasting impressions",
  },
  {
    icon: <Package className="h-8 w-8 text-primary" />,
    title: "Custom Designs",
    description: "Personalized products tailored to your brand identity",
  },
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: "Fast Delivery",
    description: "Quick turnaround times to meet your deadlines",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    title: "Secure Payments",
    description: "Multiple payment options with enhanced security",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-12">Why Choose Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
