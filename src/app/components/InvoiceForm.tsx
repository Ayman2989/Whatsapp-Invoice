"use client";

import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Select from "react-select";

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

    fetch("/api/accounts/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?._id) {
          setCompanyId(data.user._id);
        }
      });
    const urlParams = new URLSearchParams(window.location.search);
    let param = urlParams.get("payload") || "";

    param = decodeURIComponent(param).trim();

    // 🧼 Remove +974 or 974 at the start
    if (param.startsWith("+974")) {
      param = param.slice(4).trim();
    } else if (param.startsWith("974")) {
      param = param.slice(3).trim();
    }

    const parts = param.split(/\s+/);
    let numberParts: string[] = [];
    let nameParts: string[] = [];

    for (const part of parts) {
      if (/^\d+$/.test(part)) {
        numberParts.push(part);
      } else if (/^[\p{L}]+$/u.test(part)) {
        nameParts.push(part);
      }
    }

    const number = numberParts.join(""); // Combine all digits (e.g., '5575' + '7581')
    const name = nameParts.join(" ");

    if (number) setContactNumber(number);
    if (name) setCustomerName(name);
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);
  const totalAmount = products.reduce((sum, p) => sum + p.qty * p.price, 0);

  const saveInvoice = async (updatedProducts: Product[]) => {
    const isIncomplete =
      !customerName ||
      !contactNumber ||
      !companyId ||
      updatedProducts.length === 0 ||
      !updatedProducts.every((p) => p.name && p.qty && p.price >= 0);

    if (isIncomplete) {
      console.warn("Auto-save skipped due to missing fields");
      return;
    }

    setSaving("saving");

    const payload = {
      customerName,
      customerNumber: contactNumber,
      companyId,
      products: updatedProducts,
      totalAmount,
      invoiceId,
    };

    try {
      const res = await fetch("/api/invoices/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Invoice save error:", data.error);
        setSaving(null);
        return;
      }

      if (data?.invoiceId) setInvoiceId(data.invoiceId);
      setSaving("saved");
      setTimeout(() => setSaving(null), 2000);
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaving(null);
    }
  };

  const handleQtyChange = (i: number, qty: string) => {
    const updated = [...products];
    updated[i].qty = +qty;
    setProducts(updated);
    // Delay auto-save slightly to allow state to settle
    setTimeout(() => saveInvoice(updated), 200);
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
    setTimeout(() => saveInvoice(updated), 200);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm">
      <div className="space-y-4 bg-white rounded-xl shadow-md p-6 border">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Invoice Creator
        </h2>
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Contact Number (no +974)"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        {products.map((p, i) => (
          <div key={i} className="flex gap-2 items-center text-primary">
            <div className="flex-1 text-primary">
              <Select
                className="text-sm text-primary focus:ring-2 focus:ring-primary"
                placeholder="Select Product"
                options={productOptions}
                value={
                  productOptions.find((opt) => opt.value === p.name) || null
                }
                onChange={(val) => handleProductSelect(i, val)}
                isClearable
              />
            </div>
            <input
              className="border border-gray-300 bg-gray-100  rounded px-2 py-2 w-20 text-center"
              placeholder="Qty"
              type="number"
              value={p.qty}
              onChange={(e) => handleQtyChange(i, e.target.value)}
            />
            <input
              className="border border-gray-200 bg-gray-100 rounded px-2 py-2 w-24 text-center"
              type="number"
              value={p.price}
              disabled
            />
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-2"
              onClick={() => removeProduct(i)}
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
            }`}
          >
            {saving === "saving" ? "Saving..." : "Saved!"}
          </div>
        )}
      </div>

      <div
        ref={previewRef}
        className="bg-white border shadow rounded-xl p-6 max-w-3xl w-full text-black"
      >
        <h2 className="text-xl font-bold mb-4 text-primary">Invoice Preview</h2>
        <p className="mb-2">Customer: {customerName}</p>
        <p className="mb-2">Contact: {contactNumber}</p>
        <div className="grid grid-cols-4 font-semibold border-b pb-2 mb-2">
          <div>Product</div>
          <div className="text-center">Qty</div>
          <div className="text-center">Price</div>
          <div className="text-right">Total</div>
        </div>
        {products.map((p, i) => (
          <div key={i} className="grid grid-cols-4 mb-1">
            <div>{p.name}</div>
            <div className="text-center">{p.qty}</div>
            <div className="text-center">{p.price}</div>
            <div className="text-right">{p.qty * p.price}</div>
          </div>
        ))}
        <div className="text-right font-bold mt-4 border-t pt-2 text-lg">
          Total: {totalAmount} QR
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
