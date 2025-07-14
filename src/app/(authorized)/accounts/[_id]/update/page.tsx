"use client";

import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AccountFormInputs {
  name: string;
  email: string;
  role: string;
  password?: string;
}

const UpdateAccountPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountFormInputs>();

  const router = useRouter();
  const params = useParams();
  const accountId = params._id as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetch(`/api/accounts/${accountId}`);
      const data = await res.json();
      if (data.account) {
        setValue("name", data.account.name || "");
        setValue("email", data.account.email);
        setValue("role", data.account.role);
        setValue("password", data.account.password); // Password should not be pre-filled
      }
      setLoading(false);
    };

    const fetchCurrentUser = async () => {
      const res = await fetch("/api/accounts/me");
      const data = await res.json();
      setCurrentUserId(data.user._id);
    };

    fetchAccount();
    fetchCurrentUser();
  }, [accountId, setValue]);

  const onSubmit = async (data: AccountFormInputs) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Something went wrong");
        return;
      }

      alert("Account updated successfully!");
      router.push("/accounts");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update account");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;
    if (accountId === currentUserId)
      return alert("You cannot delete the account you're using.");

    const res = await fetch(`/api/accounts/${accountId}`, { method: "DELETE" });
    if (res.ok) {
      alert("Account deleted successfully");
      router.push("/accounts");
    } else {
      alert("Failed to delete account");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-gray-800">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Update Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to keep current password"
            />
          </div>

          {/* <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
    
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
          >
            Update Account
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
            disabled={accountId === currentUserId}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountPage;
