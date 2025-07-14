import React from "react";
import LogoutButton from "../../components/LogoutButton";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="text-lg text-gray-600">You're logged in 🚀</p>
    </div>
  );
};

export default DashboardPage;
