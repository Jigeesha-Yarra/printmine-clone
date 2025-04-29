import { pgTable, serial, text, timestamp, integer, boolean, json, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"])

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  address: json("address").$type<{
    street?: string
    city?: string
    state?: string
    pincode?: string
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
})

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: integer("price").notNull(), // Price in paise (1/100 of a rupee)
  images: json("images").$type<string[]>().notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  featured: boolean("featured").default(false),
  customizable: boolean("customizable").default(false),
  customizationOptions:
    json("customization_options").$type<
      {
        id: string
        name: string
        type: "text" | "textarea" | "select"
        placeholder?: string
        choices?: { value: string; label: string }[]
      }[]
    >(),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: orderStatusEnum("status").default("pending"),
  total: integer("total").notNull(), // Total in paise
  shippingAddress: json("shipping_address")
    .$type<{
      name: string
      email: string
      phone: string
      street: string
      city: string
      state: string
      pincode: string
    }>()
    .notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Price in paise
  quantity: integer("quantity").notNull(),
  customizations: json("customizations").$type<Record<string, string>>(),
})

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))
