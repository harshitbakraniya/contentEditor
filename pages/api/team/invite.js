import { connectToDatabase } from "../../../lib/mongodb"
import { verifyToken } from "../../../lib/auth"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Verify token
    const userId = await verifyToken(req)
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { email, projectId } = req.body
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const { db } = await connectToDatabase()

    // Find the user to invite
    const invitedUser = await db.collection("users").findOne({ email })
    if (!invitedUser) {
      return res.status(404).json({ message: "User not found with this email" })
    }

    // If projectId is provided, add user to specific project
    if (projectId) {
      const project = await db.collection("projects").findOne({
        _id: new ObjectId(projectId),
        ownerId: userId,
      })

      if (!project) {
        return res.status(404).json({ message: "Project not found or you are not the owner" })
      }

      // Check if user is already a team member
      if (project.teamMembers && project.teamMembers.includes(invitedUser._id.toString())) {
        return res.status(400).json({ message: "User is already a team member" })
      }

      // Add user to project team
      await db
        .collection("projects")
        .updateOne({ _id: new ObjectId(projectId) }, { $addToSet: { teamMembers: invitedUser._id.toString() } })

      res.status(200).json({ message: "User invited to project successfully" })
    }
    // If no projectId, invite to all user's projects
    else {
      // Get all projects owned by the current user
      const projects = await db.collection("projects").find({ ownerId: userId }).toArray()

      // Add invited user to all projects
      for (const project of projects) {
        await db
          .collection("projects")
          .updateOne({ _id: project._id }, { $addToSet: { teamMembers: invitedUser._id.toString() } })
      }

      res.status(200).json({ message: "User invited to all your projects successfully" })
    }
  } catch (error) {
    console.error("Invite error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
