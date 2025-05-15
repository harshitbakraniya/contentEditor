import { connectToDatabase } from "../../lib/mongodb";
import { verifyToken } from "../../lib/auth";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Verify token
    const userId = await verifyToken(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Use provided HTML or fetch the website content
    let html;
    if (req.body.html) {
      // Use the HTML provided (from proxy)
      html = req.body.html;
      console.log("Using pre-fetched HTML from proxy");
    } else {
      // Fetch the website content directly
      console.log("Fetching HTML directly from source");
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Referer: "https://www.google.com/",
          DNT: "1",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        timeout: 15000,
      });
      html = response.data;
    }
    const $ = cheerio.load(html);

    // Extract title
    const title = $("title").text() || "Untitled Website";

    // Connect to database
    const { db } = await connectToDatabase();

    // Create a new project
    const projectResult = await db.collection("projects").insertOne({
      title,
      url,
      ownerId: userId,
      teamMembers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const projectId = projectResult.insertedId.toString();

    // Extract content and create files - try multiple common content containers
    const mainContent = $("main").length
      ? $("main")
      : $("article").length
      ? $("article")
      : $(".content, #content, .main-content, #main-content").length
      ? $(".content, #content, .main-content, #main-content")
      : $("body");

    // Log what we found for debugging
    console.log(
      `Using selector: ${mainContent.selector} for content extraction`
    );

    // Create root file
    const rootFileResult = await db.collection("files").insertOne({
      projectId,
      title: "Main Content",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Main content from " + title,
              },
            ],
          },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Extract headings and create file structure
    const headings = [];
    mainContent.find("h1, h2, h3").each((i, el) => {
      const level = Number.parseInt(el.name.substring(1));
      const text = $(el).text().trim();

      if (text) {
        headings.push({
          level,
          text,
          content: $(el).nextUntil("h1, h2, h3").text().trim(),
        });
      }
    });

    // Create files for each heading
    for (const heading of headings) {
      await db.collection("files").insertOne({
        projectId,
        parentId: rootFileResult.insertedId.toString(),
        title: heading.text,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: heading.content,
                },
              ],
            },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.status(200).json({
      message: "Website scraped successfully",
      projectId,
    });
  } catch (error) {
    console.error("Scrape error:", error.message, error.stack);
    res.status(500).json({
      message: "Failed to scrape website",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
