import { connectDB } from "@/db/config";
import Account from "@/models/Account";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

export const POST = async (req: NextRequest) => {
  try {
    const { email, password, role, name, parentAccount } = await req.json();

    await connectDB();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const exists = await Account.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newAccountData: any = {
      name,
      email,
      password: hashed,
      role,
    };

    if (parentAccount) {
      newAccountData.parentAccount = parentAccount;
    }

    // ✅ Create child account
    const createdAccount = await Account.create(newAccountData);

    // ✅ Update parent to link the child
    if (parentAccount) {
      await Account.findByIdAndUpdate(parentAccount, {
        $addToSet: { childrenAccounts: createdAccount._id },
      });
    }

    return NextResponse.json({ message: "Account created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
