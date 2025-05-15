import { connectToDatabase } from "../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "../../../lib/auth"

export default async function handler(req, res) {
  const { fileId } = req.query

  // Verify token
  const userId = await verifyToken(req)
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const { db } = await connectToDatabase()

    // Get the file
    const file = await db.collection("files").findOne({
      _id: new ObjectId(fileId),
    })

    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    // Check if user has access to the project this file belongs to
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(file.projectId),
      $or: [{ ownerId: userId }, { teamMembers: userId }],
    })

    if (!project) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Handle PUT request to update file content
    if (req.method === "PUT") {
      const { content } = req.body

      await db.collection("files").updateOne(
        { _id: new ObjectId(fileId) },
        {
          $set: {
            content,
            updatedAt: new Date(),
            lastUpdatedBy: userId,
          },
        },
      )

      res.status(200).json({ message: "File updated successfully" })
    }
    // Handle GET request to fetch a specific file
    else if (req.method === "GET") {
      res.status(200).json(file)
    }
    // Handle other methods
    else {
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("File API error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
