import { connectToDatabase } from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "../../../../lib/auth"

export default async function handler(req, res) {
  const { projectId } = req.query

  // Verify token
  const userId = await verifyToken(req)
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const { db } = await connectToDatabase()

    // Check if user has access to this project
    const project = await db.collection("projects").findOne({
      _id: new ObjectId(projectId),
      $or: [{ ownerId: userId }, { teamMembers: userId }],
    })

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Handle GET request to fetch files for a project
    if (req.method === "GET") {
      const files = await db.collection("files").find({ projectId: projectId }).toArray()

      // Organize files into a tree structure
      const fileMap = {}
      const rootFiles = []

      // First pass: create a map of all files
      files.forEach((file) => {
        file.children = []
        fileMap[file._id] = file
      })

      // Second pass: build the tree
      files.forEach((file) => {
        if (file.parentId) {
          const parent = fileMap[file.parentId]
          if (parent) {
            parent.children.push(file)
          } else {
            rootFiles.push(file)
          }
        } else {
          rootFiles.push(file)
        }
      })

      res.status(200).json(rootFiles)
    }
    // Handle other methods
    else {
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Files API error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
