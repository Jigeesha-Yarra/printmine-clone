import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/printmine-logo-concept.png"
                alt="PrintMine.in"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Easy gift with a easy - Customized corporate gifts, keychains, badges, pens and more
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-600 hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=keychain" className="text-sm text-gray-600 hover:text-primary">
                  Keychains
                </Link>
              </li>
              <li>
                <Link href="/products?category=magnetic-badge" className="text-sm text-gray-600 hover:text-primary">
                  Magnetic Badges
                </Link>
              </li>
              <li>
                <Link href="/products?category=metal-pen" className="text-sm text-gray-600 hover:text-primary">
                  Metal Pens
                </Link>
              </li>
              <li>
                <Link href="/products?category=mobile-stand" className="text-sm text-gray-600 hover:text-primary">
                  Mobile Stands
                </Link>
              </li>
              <li>
                <Link href="/products?category=corporate-gifts" className="text-sm text-gray-600 hover:text-primary">
                  Corporate Gifts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-sm text-gray-600">123 Business Park, Mumbai, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-gray-600">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-gray-600">info@printmine.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} PrintMine.in. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
