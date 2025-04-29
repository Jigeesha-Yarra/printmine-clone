import { NextResponse } from "next/response"
import { getSqlClient } from "@/lib/db/index"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Check if we have any of the required environment variables
    if (!process.env.POSTGRES_URL && !process.env.NEON_POSTGRL && !process.env.NEON_POSTGRLSQL) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database connection string is not defined. Please set NEON_POSTGRLSQL, NEON_POSTGRL, or POSTGRES_URL environment variable.",
        },
        { status: 500 },
      )
    }

    console.log(
      "Using database connection:",
      process.env.NEON_POSTGRLSQL ? "NEON_POSTGRLSQL" : process.env.NEON_POSTGRL ? "NEON_POSTGRL" : "POSTGRES_URL",
    )

    const sql = getSqlClient()

    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT
      );
    `

    console.log("Categories table created or already exists")

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL,
        images JSONB NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        featured BOOLEAN DEFAULT false,
        customizable BOOLEAN DEFAULT false,
        customization_options JSONB,
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `

    console.log("Products table created or already exists")

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT,
        address JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `

    console.log("Users table created or already exists")

    // Create enum type if it doesn't exist
    try {
      await sql`
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
      `
      console.log("Order status enum created")
    } catch (error) {
      // Type might already exist, which is fine
      console.log("Order status type might already exist")
    }

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        status order_status DEFAULT 'pending',
        total INTEGER NOT NULL,
        shipping_address JSONB NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `

    console.log("Orders table created or already exists")

    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        customizations JSONB
      );
    `

    console.log("Order items table created or already exists")

    // Seed categories
    const categoryData = [
      {
        name: "Keychains",
        slug: "keychain",
        description: "Customized metal keychains with your brand logo",
        image: "/branded-metal-keychain.png",
      },
      {
        name: "Magnetic Badges",
        slug: "magnetic-badge",
        description: "Customized magnetic badges for corporate use",
        image: "/branded-magnetic-badge.png",
      },
      {
        name: "Metal Pens",
        slug: "metal-pen",
        description: "Premium metal pens with your brand logo",
        image: "/branded-metal-pen.png",
      },
      {
        name: "Mobile Stands",
        slug: "mobile-stand",
        description: "Customized mobile stands for your desk",
        image: "/branded-phone-stand.png",
      },
      {
        name: "Corporate Gifts",
        slug: "corporate-gifts",
        description: "Premium corporate gift sets for your business partners",
        image: "/branded-essentials-set.png",
      },
    ]

    for (const category of categoryData) {
      await sql`
        INSERT INTO categories (name, slug, description, image)
        VALUES (${category.name}, ${category.slug}, ${category.description}, ${category.image})
        ON CONFLICT (slug) DO NOTHING;
      `
    }

    console.log("Categories seeded")

    // Get category IDs
    const categoryRecords = await sql`SELECT id, slug FROM categories;`
    const categoryMap = new Map(categoryRecords.rows.map((cat) => [cat.slug, cat.id]))

    // Seed products
    const productData = [
      // Keychains
      {
        name: "Metal Rectangle Keychain",
        slug: "metal-rectangle-keychain",
        description: "Premium metal rectangle keychain with your custom logo. Perfect for corporate gifting.",
        price: 19900, // ₹199.00
        images: ["/branded-metal-keychain.png", "/metal-rectangle-keychain-side.png", "/metal-rectangle-closeup.png"],
        categoryId: categoryMap.get("keychain"),
        featured: true,
        customizable: true,
        customizationOptions: [
          {
            id: "logo",
            name: "Logo",
            type: "text",
            placeholder: "Enter your company name or upload logo",
          },
          {
            id: "color",
            name: "Color",
            type: "select",
            choices: [
              { value: "silver", label: "Silver" },
              { value: "gold", label: "Gold" },
              { value: "black", label: "Black" },
            ],
          },
        ],
        stock: 100,
      },
      {
        name: "Round Metal Keychain",
        slug: "round-metal-keychain",
        description: "Elegant round metal keychain with your custom logo. Durable and stylish.",
        price: 17900, // ₹179.00
        images: ["/custom-metal-keychain.png", "/metal-round-keychain-side.png", "/metallic-circle-closeup.png"],
        categoryId: categoryMap.get("keychain"),
        featured: false,
        customizable: true,
        customizationOptions: [
          {
            id: "logo",
            name: "Logo",
            type: "text",
            placeholder: "Enter your company name or upload logo",
          },
          {
            id: "color",
            name: "Color",
            type: "select",
            choices: [
              { value: "silver", label: "Silver" },
              { value: "gold", label: "Gold" },
              { value: "black", label: "Black" },
            ],
          },
        ],
        stock: 100,
      },

      // Magnetic Badges
      {
        name: "Premium Magnetic Name Badge",
        slug: "premium-magnetic-name-badge",
        description: "High-quality magnetic name badge with your logo and employee name. No pins to damage clothing.",
        price: 24900, // ₹249.00
        images: ["/branded-magnetic-badge.png", "/magnetic-badge-back.png", "/suit-magnetic-badge.png"],
        categoryId: categoryMap.get("magnetic-badge"),
        featured: true,
        customizable: true,
        customizationOptions: [
          {
            id: "logo",
            name: "Company Logo",
            type: "text",
            placeholder: "Enter your company name or upload logo",
          },
          {
            id: "name",
            name: "Employee Name",
            type: "text",
            placeholder: "Enter employee name",
          },
          {
            id: "designation",
            name: "Designation",
            type: "text",
            placeholder: "Enter designation",
          },
        ],
        stock: 200,
      },

      // Metal Pens
      {
        name: "Executive Metal Pen",
        slug: "executive-metal-pen",
        description: "Premium executive metal pen with your brand logo. Comes in a sleek gift box.",
        price: 29900, // ₹299.00
        images: ["/branded-metal-pen.png", "/executive-pen-gift.png", "/brushed-steel-pen.png"],
        categoryId: categoryMap.get("metal-pen"),
        featured: true,
        customizable: true,
        customizationOptions: [
          {
            id: "logo",
            name: "Logo",
            type: "text",
            placeholder: "Enter your company name or upload logo",
          },
          {
            id: "color",
            name: "Pen Color",
            type: "select",
            choices: [
              { value: "black", label: "Black" },
              { value: "blue", label: "Blue" },
              { value: "silver", label: "Silver" },
            ],
          },
        ],
        stock: 150,
      },

      // Mobile Stands
      {
        name: "Wooden Mobile Stand",
        slug: "wooden-mobile-stand",
        description: "Elegant wooden mobile stand with your brand logo. Perfect for desk or office use.",
        price: 34900, // ₹349.00
        images: ["/branded-wooden-phone-stand.png", "/wooden-phone-stand.png", "/wooden-phone-stand-detail.png"],
        categoryId: categoryMap.get("mobile-stand"),
        featured: false,
        customizable: true,
        customizationOptions: [
          {
            id: "logo",
            name: "Logo",
            type: "text",
            placeholder: "Enter your company name or upload logo",
          },
          {
            id: "wood",
            name: "Wood Type",
            type: "select",
            choices: [
              { value: "maple", label: "Maple" },
              { value: "walnut", label: "Walnut" },
              { value: "oak", label: "Oak" },
            ],
          },
        ],
        stock: 75,
      },

      // Corporate Gifts
      {
        name: "Premium Gift Set",
        slug: "premium-gift-set",
        description: "Luxury corporate gift set including a metal pen, keychain, and card holder with your brand logo.",
        price: 99900, // ₹999.00
        images: ["/executive-essentials-set.png", "/corporate-unboxing.png", "/executive-essentials.png"],
        categoryId: categoryMap.get("corporate-gifts"),
        featured: true,
        customizable: true,
        customizationOptions: [
          {
            id: "logo",
            name: "Logo",
            type: "text",
            placeholder: "Enter your company name or upload logo",
          },
          {
            id: "message",
            name: "Gift Message",
            type: "textarea",
            placeholder: "Enter a personalized message",
          },
          {
            id: "packaging",
            name: "Packaging",
            type: "select",
            choices: [
              { value: "standard", label: "Standard Box" },
              { value: "premium", label: "Premium Box" },
              { value: "luxury", label: "Luxury Box with Ribbon" },
            ],
          },
        ],
        stock: 50,
      },
    ]

    for (const product of productData) {
      await sql`
        INSERT INTO products (name, slug, description, price, images, category_id, featured, customizable, customization_options, stock)
        VALUES (
          ${product.name}, 
          ${product.slug}, 
          ${product.description}, 
          ${product.price}, 
          ${JSON.stringify(product.images)}, 
          ${product.categoryId}, 
          ${product.featured}, 
          ${product.customizable}, 
          ${JSON.stringify(product.customizationOptions)}, 
          ${product.stock}
        )
        ON CONFLICT (slug) DO NOTHING;
      `
    }

    console.log("Products seeded")

    // Seed a test user with bcrypt password
    const hashedPassword = await bcrypt.hash("password123", 10)

    await sql`
      INSERT INTO users (name, email, password, phone, address)
      VALUES (
        'Test User', 
        'test@example.com', 
        ${hashedPassword}, 
        '9876543210', 
        ${JSON.stringify({
          street: "123 Test Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        })}
      )
      ON CONFLICT (email) DO NOTHING;
    `

    console.log("Test user seeded")

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      testUser: {
        email: "test@example.com",
        password: "password123",
      },
      redirectTo: "/",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: "Failed to seed database. See error details.",
      },
      { status: 500 },
    )
  }
}
