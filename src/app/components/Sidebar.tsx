"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/accounts/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();

        setRole(data.user?.role || null);
        console.log("Fetched role:", data.user?.role);

        setIsLocked(false); // remove `data.isLocked` unless you're actually sending that
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <>
      <div
        className={`hidden lg:flex flex-col bg-primary text-white h-full fixed left-0 top-0 transition-all duration-500 ${
          isLocked || isExpanded ? "w-48" : "w-16"
        } z-20`}
        onMouseEnter={() => !isLocked && setIsExpanded(true)}
        onMouseLeave={() => !isLocked && setIsExpanded(false)}
      >
        <div className="flex items-center justify-between p-2 pb-6">
          {/* Logo on the left */}
          <img
            src="/logo.png"
            alt="Logo"
            className={`rounded-full object-cover cursor-pointer transition-all duration-300 ease-in-out 
             w-12 h-12
            `}
          />

          {/* Lock button on the right */}
          <button
            className={`${isExpanded ? "block" : "hidden"} p-1 rounded`}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? (
              <svg
                className="h-7 w-6 text-etuwaCustom-db animate-bounce-x hover:scale-105 cursor-pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="20" y1="4" x2="20" y2="20" />
                <rect x="4" y="9" width="12" height="6" rx="2" />
              </svg>
            ) : (
              <svg
                className="h-7 w-6 text-etuwaCustom-db animate-pulse cursor-pointer"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="20" y1="4" x2="20" y2="20" />
                <rect x="4" y="9" width="12" height="6" rx="2" />
              </svg>
            )}
          </button>
        </div>

        <nav className={`flex flex-col space-y-2 `}>
          <Link
            href="/dashboard"
            className="flex items-center p-2 bg-gradient-to-r hover:scale-105  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
          >
            <i className={`material-icons text-xl `}>
              <svg
                className="h-7 w-7 text-gray-200 pl-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />{" "}
                <line x1="8" y1="21" x2="16" y2="21" />{" "}
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </i>
            <span
              className={`${
                isExpanded ? "block ml-4" : "hidden"
              } text-gray-200 `}
            >
              Dashboard
            </span>
          </Link>
          {role !== "User" && (
            <Link
              href="/accounts"
              className="flex items-center p-2 bg-gradient-to-r hover:scale-105  from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
            >
              <i className={`material-icons text-xl `}>
                <svg
                  className="h-7 w-7 text-gray-200 pl-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </i>
              <span
                className={`${
                  isExpanded ? "block ml-4" : "hidden"
                } text-gray-200 `}
              >
                Accounts
              </span>
            </Link>
          )}
          <Link
            href="/invoices"
            className="flex items-center p-2 bg-gradient-to-r hover:scale-105 from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
          >
            <i className={`material-icons text-xl `}>
              <svg
                className="h-7 w-7 text-gray-200 pl-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 12h-5"></path>
                <path d="M15 8h-5"></path>
                <path d="M19 17V5a2 2 0 0 0-2-2H4"></path>
                <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"></path>
              </svg>
            </i>
            <span
              className={`${
                isExpanded ? "block ml-4" : "hidden"
              } text-gray-200 `}
            >
              Invoices
            </span>
          </Link>
          <Link
            href="/products"
            className="flex items-center p-2 bg-gradient-to-r hover:scale-105 from-etuwaCustom-b to-etuwaCustom-db rounded-xl ml-2 hover:bg-etuwaCustom-db transition-all duration-500"
          >
            <i className={`material-icons text-xl `}>
              <svg
                className="h-7 w-7 text-gray-200 pl-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                <path d="M14 4h7"></path>
                <path d="M14 9h7"></path>
                <path d="M14 15h7"></path>
                <path d="M14 20h7"></path>
              </svg>
            </i>
            <span
              className={`${
                isExpanded ? "block ml-4" : "hidden"
              } text-gray-200 `}
            >
              Products
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
