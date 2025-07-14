import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const getCurrentUser = async (req?: NextRequest) => {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get("token")?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  }

  console.log("Token found:", token); // ✅ Add this

  if (!token) {
    console.log("No token found");
    return null;
  }

  try {
    const decoded = await jwtVerify(token, JWT_SECRET);
    console.log("Decoded token:", decoded.payload); // ✅ Add this
    return decoded.payload as {
      id: string;
      email: string;
      role: string;
      parentAccount?: string;
    };
  } catch (err) {
    console.error("JWT verification failed:", err); // ✅ Add this
    return null;
  }
};
