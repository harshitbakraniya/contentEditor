import { connectToDatabase } from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "../../lib/auth"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Verify token
    const userId = await verifyToken(req)
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { db } = await connectToDatabase()

    // Find user
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
