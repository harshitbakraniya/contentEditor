import { connectToDatabase } from "../../../lib/mongodb"
import { verifyToken } from "../../../lib/auth"

export default async function handler(req, res) {
  // Handle GET request to fetch all projects for a user
  if (req.method === "GET") {
    try {
      // Verify token
      const userId = await verifyToken(req)
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const { db } = await connectToDatabase()

      // Find projects where user is owner or team member
      const projects = await db
        .collection("projects")
        .find({
          $or: [{ ownerId: userId }, { teamMembers: userId }],
        })
        .sort({ createdAt: -1 })
        .toArray()

      res.status(200).json(projects)
    } catch (error) {
      console.error("Get projects error:", error)
      res.status(500).json({ message: "Server error" })
    }
  }
  // Handle other methods
  else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
