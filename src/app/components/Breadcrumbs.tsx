"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

// Capitalize and format normal text segments
const prettify = (segment: string) =>
  segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Check if it's a MongoDB-like ObjectId
const isObjectId = (str: string) => /^[a-f\d]{24}$/i.test(str);

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [resolvedLabels, setResolvedLabels] = useState<
    (string | null)[] | null
  >(null);

  useEffect(() => {
    const resolveBreadcrumbs = async () => {
      const results: (string | null)[] = [];

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const prevSegment = pathSegments[i - 1];

        if (isObjectId(segment) && prevSegment) {
          try {
            const res = await fetch(`/api/${prevSegment}/${segment}`);
            const data = await res.json();
            results.push(data?.breadcrumb || "Unknown");
          } catch {
            results.push("Unknown");
          }
        } else {
          results.push(prettify(segment));
        }
      }

      setResolvedLabels(results);
    };

    resolveBreadcrumbs();
  }, [pathname]);

  if (!resolvedLabels) return null; // 🔒 Prevent any render until everything is resolved

  return (
    <nav aria-label="breadcrumb" className="text-md text-gray-600 mb-4 p-10">
      <ol className="flex flex-wrap gap-1 items-center">
        <li>
          <Link href="/" className="hover:text-primary font-semibold">
            Home
          </Link>
          <span className="mx-1 text-gray-400">/</span>
        </li>

        {pathSegments.map((_, idx) => {
          const href = "/" + pathSegments.slice(0, idx + 1).join("/");
          const isLast = idx === pathSegments.length - 1;
          const label = resolvedLabels[idx];

          return (
            <li key={href} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={href}
                    className="hover:text-primary font-semibold"
                  >
                    {label}
                  </Link>
                  <span className="mx-1 text-gray-400">/</span>
                </>
              ) : (
                <span className="text-gray-800 font-semibold">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
