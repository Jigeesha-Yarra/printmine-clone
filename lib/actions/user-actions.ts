"use server"

import { fetchData } from "@/lib/db/data-fetcher"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      pincode?: string
    }
  },
) {
  return fetchData(
    async (db) => {
      const sql = db.sql

      // Build the update query dynamically
      const updates = []
      const params = []

      if (data.name !== undefined) {
        updates.push("name = $1")
        params.push(data.name)
      }

      if (data.phone !== undefined) {
        updates.push(`phone = $${params.length + 1}`)
        params.push(data.phone)
      }

      if (data.address !== undefined) {
        updates.push(`address = $${params.length + 1}`)
        params.push(JSON.stringify(data.address))
      }

      if (updates.length === 0) {
        return { success: true } // Nothing to update
      }

      // Add the user ID to the params
      params.push(Number.parseInt(userId))

      // Execute the update query
      await sql.query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${params.length}`, params)

      revalidatePath("/account")

      return { success: true }
    },
    { success: false },
  )
}
