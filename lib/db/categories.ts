import { getDb } from "./index"
import { categories } from "./schema"
import type { Category } from "@/types/category"

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const db = getDb()
    const dbCategories = await db.select().from(categories)

    return dbCategories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      slug: cat.slug,
      image: cat.image || "",
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
