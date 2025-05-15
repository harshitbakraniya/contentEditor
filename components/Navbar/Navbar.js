"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import Button from "../Button/Button";
import { AuthContext } from "../AuthProvider/AuthProvide";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [router]);

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
    <header className="bg-white shadow fixed w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Content Editor</h1>
        <div>
          {isLoggedIn ? (
            <div className="flex space-x-4">
              <Button
                buttonText={"Invite Team Member"}
                className={"px-4 py-2 border border-gray-300 hover:bg-gray-100"}
                clickHandler={handleInvite}
              />
              <Button
                clickHandler={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  router.push("/login");
                }}
                className="px-4 py-2 border border-gray-300  hover:bg-gray-100"
                buttonText="Logout"
              />
              <div className="w-10 h-10 flex items-center justify-center bg-slate-300">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/login" legacyBehavior>
                <a className="px-4 py-2 border border-gray-300  hover:bg-gray-100">
                  Login
                </a>
              </Link>
              <Link href="/signup" legacyBehavior>
                <a className="px-4 py-2 bg-blue-500 text-white  hover:bg-blue-600">
                  Sign Up
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
