"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import Button from "@/components/Button/Button";
import ProjectCard from "@/components/ProjectCard/ProjectCard";

export default function Workspace() {
  const [url, setUrl] = useState("");
  const [useProxy, setUseProxy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user data and projects
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get("/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectsResponse.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    };

    fetchData();
  }, [router]);

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (useProxy) {
        // First get the HTML content through the proxy
        const proxyResponse = await axios.post("/api/proxy-scrape", { url });

        // Then send the HTML to the scrape endpoint
        const response = await axios.post(
          "/api/scrape",
          { url, html: proxyResponse.data.html },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Redirect to the editor page with the new project
        router.push(`/edit/${response.data.projectId}`);
      } else {
        // Use direct scraping
        const response = await axios.post(
          "/api/scrape",
          { url },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Redirect to the editor page with the new project
        router.push(`/edit/${response.data.projectId}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to scrape website"
      );
      console.error("Scraping error details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    const email = prompt("Enter email address to invite:");
    if (!email) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/team/invite",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Invitation sent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send invitation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Workspace - Content Collaboration Platform</title>
      </Head>

      {/* <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Workspace</h1>
          <div className="flex items-center space-x-4">
            {user && <span className="text-sm text-gray-600">{user.name}</span>}
            <Button
              buttonText={"Invite Team Member"}
              className={
                "px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              }
              clickHandler={handleInvite}
            />
            <Button
              buttonText={"Logout"}
              className={
                "px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              }
              clickHandler={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
            />
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-24">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Scrape a Website</h2>
          <form onSubmit={handleScrape} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://docs.mixpanel.com/docs/what-is-mixpanel"
                className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button
                type="submit"
                buttonText={loading ? "Scraping..." : "Scrape Website"}
                className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                clickHandler={() => {}}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useProxy"
                className="mr-2"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
              />
              <label htmlFor="useProxy" className="text-sm text-gray-600">
                Use proxy (try this if direct scraping fails)
              </label>
            </div>
          </form>
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Your Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">
              No projects yet. Scrape a website to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
