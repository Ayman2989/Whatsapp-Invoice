import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/Invoice";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      invoiceId,
      customerName,
      customerNumber,
      companyId,
      products,
      totalAmount,
    } = await req.json();

    // ✅ Basic input validation
    if (
      !customerName ||
      !customerNumber ||
      !products?.length ||
      totalAmount == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Final data to save
    const data: any = {
      customerName,
      customerNumber,
      products,
      totalAmount,
    };

    // ✅ Role-based company ID enforcement
    if (user.role === "User") {
      if (!user.parentAccount) {
        return NextResponse.json(
          { error: "Parent account not assigned to user" },
          { status: 403 }
        );
      }
      data.companyId = user.parentAccount;
    } else {
      if (!companyId) {
        return NextResponse.json(
          { error: "Company ID is required" },
          { status: 400 }
        );
      }
      data.companyId = companyId;
    }

    // ✅ Create or Update
    const invoice = invoiceId
      ? await Invoice.findByIdAndUpdate(invoiceId, data, { new: true })
      : await Invoice.create(data);

    return NextResponse.json({ invoiceId: invoice._id }, { status: 200 });
  } catch (error) {
    console.error("Invoice Save Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
