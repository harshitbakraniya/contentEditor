"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Content Collaboration Platform</title>
        <meta
          name="description"
          content="Collaborate on content with your team"
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Collaborative Content Editing
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Scrape websites, edit content, and collaborate with your team in
            real-time.
          </p>
          <div className="mt-8">
            {isLoggedIn ? (
              <Link href="/workspace" legacyBehavior className="rounded-md">
                <a className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Go to Workspace
                </a>
              </Link>
            ) : (
              <Link href="/signup" legacyBehavior>
                <a className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Get Started
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Web Scraping</h3>
            <p className="mt-2 text-gray-500">
              Scrape any website and import its content for editing and
              collaboration.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Team Collaboration
            </h3>
            <p className="mt-2 text-gray-500">
              Invite team members to collaborate on content in real-time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Rich Text Editing
            </h3>
            <p className="mt-2 text-gray-500">
              Edit content with a powerful rich text editor and see changes
              instantly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
