import jwt from "jsonwebtoken"

export async function verifyToken(req) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    return decoded.userId
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
