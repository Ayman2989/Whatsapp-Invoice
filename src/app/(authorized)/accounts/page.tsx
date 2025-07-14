import Link from "next/link";
import React from "react";
import AccountList from "../../components/AccountList";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/db/config";
import Account from "@/models/Account";
import { log } from "console";

export default async function AccountsPage() {
  // const data = await fetchAccounts();
  // console.log("Fetched accounts data:", data);
  // const accounts = data.accounts || [];
  await connectDB();
  const currentUser = await getCurrentUser();
  const currentAccountId = currentUser?.id || ""; // 👈 use this instead
  const user = await getCurrentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  let accounts;

  console.log("Current user:", user);
  if (user.role === "Admin") {
    // If the user is an admin, fetch accounts where the parentAccount field matches the user's ID and fetch the currentuser as well
    accounts = await Account.find(
      {
        $or: [{ parentAccount: user.id }, { _id: user.id }],
      },
      "-password"
    );
    console.log("Admin user fetching accounts:", accounts);
  } else {
    accounts = await Account.find({}, "-password");
    console.log("Non-admin user fetching accounts:", accounts);
  }

  //parentaccounts are accounts in which the parenAccount field has nothing in it
  const parentAccounts = accounts.filter((account) => !account.parentAccount);
  const childrenAccounts = accounts.filter((account) => account.parentAccount);

  console.log("All accounts fetched:", accounts);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Accounts</h1>
          <Link
            href="/accounts/create-account"
            className="inline-block bg-primary text-white px-5 py-2 rounded-lg hover:scale-95 transition-all duration-300 shadow-sm"
          >
            + New Account
          </Link>
        </div>

        <p className="text-lg mb-6 text-gray-600">
          View and manage all your business accounts.
        </p>

        <div className="bg-white shadow-md shadow-primary rounded-3xl p-6">
          <AccountList
            accounts={accounts}
            currentAccountId={currentAccountId}
            parentAccounts={parentAccounts}
            childrenAccounts={childrenAccounts}
          />
        </div>
      </div>
    </div>
  );
}
