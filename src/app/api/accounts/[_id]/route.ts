import { connectDB } from "@/db/config";
import Account from "@/models/Account";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Only used if password update is allowed

interface AccountDoc {
  role: string;
  name: string;
  email: string;
  password?: string; // Optional if not updating password
  parentAccount?: string; // Reference to parent account
  childrenAccounts?: string[]; // Array of child account references
}

export async function GET(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;
  console.log("Received request to fetch invoice with ID:", _id);

  await connectDB();

  console.log("Fetching Account with ID:", _id);

  const AccountId = _id;

  if (!AccountId) {
    return NextResponse.json({ error: "Missing Account ID" }, { status: 400 });
  }

  try {
    const account = await Account.findById(AccountId).lean<AccountDoc>();

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(
      { account, breadcrumb: account.name },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching account:", err);
    return NextResponse.json(
      { error: "Error fetching account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;
  await connectDB();

  if (!_id) {
    return NextResponse.json({ error: "Missing Account ID" }, { status: 400 });
  }

  try {
    const deleted = await Account.findByIdAndDelete(_id);
    if (!deleted) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting account:", err);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

// ✅ Update account
export async function PUT(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;
  await connectDB();

  try {
    const body = await req.json();

    const { name, email, password, role } = body;

    const updateData: any = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updated = await Account.findByIdAndUpdate(_id, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account updated", account: updated });
  } catch (err: any) {
    console.error("Error updating account:", err);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}
