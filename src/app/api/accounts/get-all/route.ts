import { connectDB } from "@/db/config";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

connectDB();

export const GET = async () => {
  try {
    await connectDB();
    //import everything except password
    const accounts = await Account.find({}, "-password");

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
