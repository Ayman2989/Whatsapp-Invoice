"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Account {
  _id: string;
  name?: string;
  email: string;
  role: string;
  createdAt?: string;
  parentAccount?: string; // ID of the parent account, if any
  childrenAccounts?: string[]; // Array of child account IDs, if any
}

interface AccountListProps {
  accounts: Account[];
  currentAccountId: string; // 👈 Required to prevent deleting self
  parentAccounts?: Account[]; // Optional, if you want to filter by parent account
  childrenAccounts?: Account[]; // Optional, if you want to filter by child accounts
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  currentAccountId,
  parentAccounts,
  childrenAccounts,
}) => {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const childrenMap = new Map<string, Account[]>();
  childrenAccounts?.forEach((child) => {
    const parentId = child.parentAccount;
    if (parentId) {
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }
      childrenMap.get(parentId)!.push(child);
    }
  });

  const handleDelete = async (accountId: string) => {
    try {
      const res = await fetch(`/api/accounts/${accountId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete account");
        return;
      }

      alert("Account deleted");
      router.refresh(); // Refresh the list
    } catch (err) {
      alert("Error deleting account");
    }
  };

  if (!accounts || accounts.length === 0) {
    return <div className="text-gray-600 italic">No accounts found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parentAccounts?.map((parent) => (
            <React.Fragment key={parent._id}>
              {/* Parent row */}
              <tr className="border-t border-gray-300 bg-gray-50">
                <td className="px-4 py-2 font-semibold">{parent.name}</td>
                <td className="px-4 py-2 font-semibold">{parent.email}</td>
                <td className="px-4 py-2 font-semibold">{parent.role}</td>
                <td className="px-4 py-2 font-semibold">
                  {parent.createdAt
                    ? new Date(parent.createdAt).toLocaleDateString()
                    : "Unknown"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Link
                    href={`/accounts/${parent._id}/update`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition inline-flex justify-center min-w-[80px]"
                  >
                    Update
                  </Link>
                  {parent._id === currentAccountId ? (
                    <span className="text-sm text-gray-400 italic">
                      Cannot delete
                    </span>
                  ) : (
                    <div className="inline-block relative">
                      <button
                        onClick={() =>
                          setConfirmDeleteId(
                            confirmDeleteId === parent._id ? null : parent._id
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition inline-flex justify-center min-w-[80px]"
                      >
                        Delete
                      </button>
                      {confirmDeleteId === parent._id && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded p-3 z-10">
                          <p className="text-sm mb-2">Are you sure?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(parent._id)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>

              {/* Children rows */}
              {childrenMap.get(parent._id)?.map((child) => (
                <tr key={child._id} className="border-t border-gray-100">
                  <td className="px-4 py-2 pl-10">↳ {child.name}</td>
                  <td className="px-4 py-2">{child.email}</td>
                  <td className="px-4 py-2">{child.role}</td>
                  <td className="px-4 py-2">
                    {child.createdAt
                      ? new Date(child.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link
                      href={`/accounts/${child._id}/update`}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition inline-flex justify-center min-w-[80px]"
                    >
                      Update
                    </Link>
                    {child._id === currentAccountId ? (
                      <span className="text-sm text-gray-400 italic">
                        Cannot delete
                      </span>
                    ) : (
                      <div className="inline-block relative">
                        <button
                          onClick={() =>
                            setConfirmDeleteId(
                              confirmDeleteId === child._id ? null : child._id
                            )
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition inline-flex justify-center min-w-[80px]"
                        >
                          Delete
                        </button>
                        {confirmDeleteId === child._id && (
                          <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded p-3 z-10">
                            <p className="text-sm mb-2">Are you sure?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(child._id)}
                                className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountList;
