import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: "keychain",
    name: "METAL KEYCHAINS",
    image: "/branded-metal-keychain.png",
    description: "AVAILABLE IN SIZES OF",
    link: "/products?category=keychain",
  },
  {
    id: "corporate-gifts",
    name: "CUSTOMIZED PREMIUM CORPORATE GIFTS",
    image: "/executive-essentials.png",
    description: "PERFECT FOR BUSINESS PARTNERS",
    link: "/products?category=corporate-gifts",
  },
  {
    id: "metal-pen",
    name: "PREMIUM METAL PENS",
    image: "/branded-metal-pen.png",
    description: "PERFECT GIFT FOR CORPORATES",
    link: "/products?category=metal-pen",
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.link}
            className="group relative overflow-hidden rounded-lg border hover:border-primary transition-colors"
          >
            <div className="aspect-square md:aspect-auto md:h-[300px] relative">
              <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-lg font-bold text-white bg-black bg-opacity-50 p-2 mb-2 w-full">{category.name}</h3>
                <p className="text-sm text-white bg-black bg-opacity-50 p-1 w-full">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
