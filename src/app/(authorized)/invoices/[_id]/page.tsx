"use client";
import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Select from "react-select";
import { useParams } from "next/navigation";

// Types
type Product = {
  name: string;
  qty: number;
  price: number;
};

type ProductOption = {
  label: string;
  value: string;
  price: number;
};

const InvoiceForm = () => {
  const params = useParams();
  const invoiceIdFromParams = params._id as string;

  const [customerName, setCustomerName] = useState("");
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [contactNumber, setContactNumber] = useState("");
  const [products, setProducts] = useState<Product[]>([
    { name: "", qty: 1, price: 0 },
  ]);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [saving, setSaving] = useState<"saving" | "saved" | null>(null);

  useEffect(() => {
    // Fetch products
    fetch("/api/products/get-all")
      .then((res) => res.json())
      .then((data) => {
        const options = data.products.map((p: any) => ({
          label: p.name,
          value: p.name,
          price: p.price,
        }));
        setProductOptions(options);
      });

    // Fetch user/account
    fetch("/api/accounts/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?._id) setCompanyId(data.user._id);
      });

    // Fetch invoice for updating
    if (invoiceIdFromParams) {
      fetch(`/api/invoices/${invoiceIdFromParams}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.invoice) {
            setCustomerName(data.invoice.customerName);
            setContactNumber(data.invoice.customerNumber);
            setProducts(data.invoice.products);
            setInvoiceId(data.invoice._id);
          }
        });
    }
  }, [invoiceIdFromParams]);

  const previewRef = useRef<HTMLDivElement>(null);

  const totalAmount = products.reduce((sum, p) => sum + p.qty * p.price, 0);

  const saveInvoice = async (updatedProducts: Product[]) => {
    if (
      !customerName ||
      !contactNumber ||
      updatedProducts.length === 0 ||
      !updatedProducts[0].name ||
      !companyId
    )
      return;
    setSaving("saving");

    const payload = {
      customerName,
      customerNumber: contactNumber,
      companyId,
      products: updatedProducts,
      totalAmount,
    };

    const res = await fetch("/api/invoices/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, invoiceId }),
    });

    const data = await res.json();
    if (data?.invoiceId) setInvoiceId(data.invoiceId);
    setSaving("saved");
    setTimeout(() => setSaving(null), 2000);
  };

  const handleProductSelect = (i: number, selected: ProductOption | null) => {
    if (!selected) return;
    const updated = [...products];
    updated[i] = {
      ...updated[i],
      name: selected.value,
      price: selected.price,
    };
    setProducts(updated);
    saveInvoice(updated);
  };

  const handleQtyChange = (i: number, qty: string) => {
    const updated = [...products];
    updated[i].qty = +qty;
    setProducts(updated);
    saveInvoice(updated);
  };

  const addProduct = () => {
    const updated = [...products, { name: "", qty: 1, price: 0 }];
    setProducts(updated);
    saveInvoice(updated);
  };

  const removeProduct = (i: number) => {
    const updated = [...products];
    updated.splice(i, 1);
    setProducts(updated);
    saveInvoice(updated);
  };

  const downloadPDF = () => {
    if (!previewRef.current) return;
    html2pdf()
      .from(previewRef.current)
      .set({
        margin: 0.5,
        filename: `invoice-${customerName}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const generateWhatsAppMessage = () => {
    let msg = `Customer Name: ${customerName}\nContact: ${contactNumber}\n\nProduct        Qty     Price    Total\n-------------------------------------\n`;
    products.forEach((p) => {
      const total = p.qty * p.price;
      msg += `${p.name.padEnd(14)} ${p.qty.toString().padEnd(7)} ${p.price
        .toString()
        .padEnd(8)} ${total}\n`;
    });
    msg += `\n-------------------------------------\nTotal: ${totalAmount} QR\n\nThank you for your order!`;
    return msg;
  };

  const sendWhatsApp = () => {
    const msg = generateWhatsAppMessage();
    const url = `https://web.whatsapp.com/send?phone=974${contactNumber}&text=${encodeURIComponent(
      msg
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 min-h-screen">
      <div className="space-y-5">
        <input
          className="border border-primary text-primary p-3 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          className="border border-primary text-primary p-3 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
          placeholder="Contact Number (no +974)"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        {products.map((p, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Select
              className="flex-grow text-sm text-primary focus:ring-2 focus:ring-primary"
              placeholder="Select Product"
              options={productOptions}
              value={productOptions.find((opt) => opt.value === p.name) || null}
              onChange={(val) => handleProductSelect(i, val)}
              isClearable
            />
            <input
              className="border border-primary text-primary p-2 w-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Qty"
              type="number"
              min={1}
              value={p.qty}
              onChange={(e) => handleQtyChange(i, e.target.value)}
            />
            <input
              className="border border-gray-300 p-2 w-28 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
              type="number"
              value={p.price}
              disabled
            />
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              onClick={() => removeProduct(i)}
              aria-label="Remove product"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            className="bg-primary hover:bg-orange-700 cursor-pointer transition-all duration-300 text-white px-4 py-2 rounded"
            onClick={addProduct}
          >
            + Add Product
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 cursor-pointer transition-all duration-300 text-white px-4 py-2 rounded"
            onClick={sendWhatsApp}
          >
            Send WhatsApp Message
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all duration-300 text-white px-4 py-2 rounded"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition-all duration-300 text-white px-4 py-2 rounded"
            onClick={() => saveInvoice(products)}
          >
            Save Invoice Manually
          </button>
        </div>
        {saving && (
          <div
            className={`text-sm ${
              saving === "saving" ? "text-yellow-600" : "text-green-600"
            } font-medium mt-2`}
          >
            {saving === "saving" ? "Saving..." : "Saved!"}
          </div>
        )}
      </div>

      <div
        ref={previewRef}
        className="bg-white border border-gray-300 shadow-lg rounded-md p-6 max-w-3xl w-full text-gray-900"
      >
        <h2 className="text-2xl font-bold mb-5 text-primary">
          Invoice Preview
        </h2>
        <p className="mb-3 text-lg font-semibold">Customer: {customerName}</p>
        <p className="mb-4 text-lg font-semibold">Contact: {contactNumber}</p>
        <div className="grid grid-cols-4 font-semibold border-b border-gray-300 pb-2 mb-3 text-gray-700">
          <div>Product</div>
          <div className="text-center">Qty</div>
          <div className="text-center">Price</div>
          <div className="text-right">Total</div>
        </div>
        {products.map((p, i) => (
          <div
            key={i}
            className="grid grid-cols-4 mb-2 text-gray-800 border-b border-gray-200 pb-1"
          >
            <div>{p.name}</div>
            <div className="text-center">{p.qty}</div>
            <div className="text-center">{p.price}</div>
            <div className="text-right">{p.qty * p.price}</div>
          </div>
        ))}
        <div className="text-right font-extrabold mt-6 text-lg text-primary">
          Total: {totalAmount} QR
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
