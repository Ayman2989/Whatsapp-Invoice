import InvoiceList from "@/app/components/InvoiceList";
import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/db/config";
import Invoice from "@/models/Invoice";
import { Invoice as InvoiceType } from "../../../types/Invoice";

export const dynamic = "force-dynamic";

const Page = async () => {
  await connectDB();

  const user = await getCurrentUser();
  if (!user) return <p className="text-center text-red-600">Unauthorized</p>;

  let rawInvoices;

  if (user.role === "User") {
    rawInvoices = await Invoice.find({ companyId: user.parentAccount })
      .sort({ createdAt: -1 })
      .lean();
  } else {
    rawInvoices = await Invoice.find({ companyId: user.id })
      .sort({ createdAt: -1 })
      .lean();
  }

  const invoices: InvoiceType[] = rawInvoices.map((inv: any) => ({
    _id: inv._id.toString(),
    customerName: inv.customerName,
    customerNumber: inv.customerNumber,
    totalAmount: inv.totalAmount,
    createdAt: new Date(inv.createdAt).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Invoices</h1>
          <Link
            href="/invoices/create-invoice"
            className="inline-block bg-primary text-white px-5 py-2 rounded-lg hover:scale-95 transition-all duration-300 shadow-sm"
          >
            + New Invoice
          </Link>
        </div>

        <p className="text-lg mb-6 text-gray-600">
          Manage all your invoices in one place.
        </p>

        <div className="bg-white shadow-md shadow-primary rounded-3xl p-6">
          <InvoiceList invoices={invoices} />
        </div>
      </div>
    </div>
  );
};

export default Page;
