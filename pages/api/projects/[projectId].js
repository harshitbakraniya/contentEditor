import { connectToDatabase } from "../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "../../../lib/auth"

export default async function handler(req, res) {
  const { projectId } = req.query

  // Verify token
  const userId = await verifyToken(req)
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const { db } = await connectToDatabase()

    // Handle GET request to fetch a specific project
    if (req.method === "GET") {
      const project = await db.collection("projects").findOne({
        _id: new ObjectId(projectId),
        $or: [{ ownerId: userId }, { teamMembers: userId }],
      })

      if (!project) {
        return res.status(404).json({ message: "Project not found" })
      }

      res.status(200).json(project)
    }
    // Handle other methods
    else {
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Project API error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
