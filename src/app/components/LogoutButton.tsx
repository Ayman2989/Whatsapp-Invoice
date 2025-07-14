"use client";

import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/accounts/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all font-medium"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
