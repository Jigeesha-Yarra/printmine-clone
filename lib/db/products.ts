import { fetchData } from "./data-fetcher"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"

// Convert database product to frontend product
const mapDbProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id.toString(),
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description || "",
    price: dbProduct.price / 100, // Convert from paise to rupees
    images: dbProduct.images || [],
    categoryId: dbProduct.category_id?.toString() || "",
    featured: dbProduct.featured || false,
    customizable: dbProduct.customizable || false,
    customizationOptions: dbProduct.customization_options || [],
    stock: dbProduct.stock || 0,
  }
}

// Get products with filtering and pagination
export async function getProducts({
  category,
  sort = "newest",
  search,
  minPrice,
  maxPrice,
  featured,
  page = 1,
  limit = 10,
}: {
  category?: string
  sort?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  page?: number
  limit?: number
}): Promise<Product[]> {
  return fetchData(
    async (db) => {
      const sql = db.sql

      // Start building the query
      let query = `
        SELECT * FROM products
        WHERE 1=1
      `

      const params: any[] = []
      let paramIndex = 1

      // Apply filters
      if (category) {
        const categoryResult = await sql`
          SELECT id FROM categories WHERE slug = ${category} LIMIT 1
        `

        if (categoryResult.rows.length > 0) {
          query += ` AND category_id = $${paramIndex++}`
          params.push(categoryResult.rows[0].id)
        }
      }

      if (search) {
        query += ` AND (name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`
        params.push(`%${search}%`, `%${search}%`)
      }

      if (minPrice !== undefined) {
        query += ` AND price >= $${paramIndex++}`
        params.push(minPrice * 100)
      }

      if (maxPrice !== undefined) {
        query += ` AND price <= $${paramIndex++}`
        params.push(maxPrice * 100)
      }

      if (featured !== undefined) {
        query += ` AND featured = $${paramIndex++}`
        params.push(featured)
      }

      // Apply sorting
      query += " ORDER BY "
      switch (sort) {
        case "price-low-high":
          query += "price ASC"
          break
        case "price-high-low":
          query += "price DESC"
          break
        case "popularity":
          query += "id DESC"
          break
        case "newest":
        default:
          query += "id DESC"
          break
      }

      // Apply pagination
      const offset = (page - 1) * limit
      query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
      params.push(limit, offset)

      // Execute the query using the sql.query method
      const result = await sql.query(query, params)

      return result.rows.map(mapDbProductToProduct)
    },
    [], // Empty array as fallback
  )
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  return fetchData(
    async (db) => {
      const sql = db.sql

      const result = await sql`
        SELECT * FROM products
        WHERE id = ${Number.parseInt(id)}
        LIMIT 1
      `

      if (result.rows.length === 0) {
        return null
      }

      return mapDbProductToProduct(result.rows[0])
    },
    null, // null as fallback
  )
}

// Get related products (same category, excluding current product)
export async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  return fetchData(
    async (db) => {
      const sql = db.sql

      const result = await sql`
        SELECT * FROM products
        WHERE category_id = ${Number.parseInt(categoryId)}
        AND id != ${Number.parseInt(currentProductId)}
        LIMIT 4
      `

      return result.rows.map(mapDbProductToProduct)
    },
    [], // Empty array as fallback
  )
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  return fetchData(
    async (db) => {
      const sql = db.sql

      const result = await sql`
        SELECT * FROM categories
      `

      return result.rows.map((cat) => ({
        id: cat.slug,
        name: cat.name,
        slug: cat.slug,
        image: cat.image || "",
      }))
    },
    [], // Empty array as fallback
  )
}
