import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "../../lib/mongodb"
import { ObjectId } from "mongodb"

export default function SocketHandler(req, res) {
  // Check if socket.io server is already running
  if (res.socket.server.io) {
    console.log("Socket is already running")
    res.end()
    return
  }

  // Initialize socket.io server
  const io = new Server(res.socket.server)
  res.socket.server.io = io

  // Handle socket connections
  io.on("connection", async (socket) => {
    try {
      // Authenticate user
      const token = socket.handshake.query.token
      const projectId = socket.handshake.query.projectId

      if (!token || !projectId) {
        socket.disconnect()
        return
      }

      let userId
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
        userId = decoded.userId
      } catch (err) {
        socket.disconnect()
        return
      }

      // Get user info
      const { db } = await connectToDatabase()
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) }, { projection: { name: 1, email: 1 } })

      if (!user) {
        socket.disconnect()
        return
      }

      // Join project room
      socket.join(projectId)

      // Add user to active users
      const roomUsers = io.sockets.adapter.rooms.get(projectId)
      const activeUsers = []

      // Store user info in socket data
      socket.data.user = {
        id: userId,
        name: user.name,
        email: user.email,
      }

      // Get all active users in the room
      if (roomUsers) {
        for (const socketId of roomUsers) {
          const socket = io.sockets.sockets.get(socketId)
          if (socket && socket.data.user) {
            activeUsers.push(socket.data.user)
          }
        }
      }

      // Broadcast active users to all clients in the room
      io.to(projectId).emit("active-users", activeUsers)

      // Handle content changes
      socket.on("content-change", async (data) => {
        // Save content to database
        try {
          await db.collection("files").updateOne(
            { _id: new ObjectId(data.fileId) },
            {
              $set: {
                content: data.content,
                updatedAt: new Date(),
                lastUpdatedBy: userId,
              },
            },
          )

          // Broadcast content change to all clients in the room
          socket.to(projectId).emit("content-updated", {
            fileId: data.fileId,
            content: data.content,
            userId,
          })
        } catch (err) {
          console.error("Error saving content:", err)
        }
      })

      // Handle disconnection
      socket.on("disconnect", () => {
        // Update active users
        const roomUsers = io.sockets.adapter.rooms.get(projectId)
        const activeUsers = []

        if (roomUsers) {
          for (const socketId of roomUsers) {
            const socket = io.sockets.sockets.get(socketId)
            if (socket && socket.data.user) {
              activeUsers.push(socket.data.user)
            }
          }
        }

        // Broadcast updated active users
        io.to(projectId).emit("active-users", activeUsers)
      })
    } catch (error) {
      console.error("Socket error:", error)
    }
  })

  console.log("Socket.io server started")
  res.end()
}
