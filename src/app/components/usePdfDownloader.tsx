"use client";

import html2pdf from "html2pdf.js";
import { RefObject } from "react";

export const usePdfDownloader = () => {
  const downloadPdf = (
    ref: RefObject<HTMLDivElement | null>, // ✅ accept null safely
    filename: string
  ) => {
    if (!ref.current) return;

    html2pdf()
      .from(ref.current)
      .set({
        margin: 0.5,
        filename,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return { downloadPdf };
};
