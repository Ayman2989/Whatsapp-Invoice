import { connectDB } from "@/db/config";
import Invoice from "@/models/Invoice";
import { NextRequest, NextResponse } from "next/server";

interface InvoiceDoc {
  customerName: string;
  customerNumber: string;
  companyId: string;
  products: {
    name: string;
    qty: number;
    price: number;
  }[];
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;
  console.log("Received request to fetch invoice with ID:", _id);

  await connectDB();

  console.log("Fetching invoice with ID:", _id);

  const invoiceId = _id;

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  try {
    const invoice = await Invoice.findById(_id).lean<InvoiceDoc>();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        invoice,
        breadcrumb: invoice?.customerName || "Unknown Invoice",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching invoice:", err);
    return NextResponse.json(
      { error: "Error fetching invoice" },
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
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(_id);
    if (!deletedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting invoice:", err);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
