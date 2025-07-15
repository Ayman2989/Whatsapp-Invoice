import React from "react";
import LogoutButton from "../../components/LogoutButton";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Extension Installer */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl">
        <h2 className="text-xl font-semibold mb-2 text-primary">
          🧩 Install WhatsApp Invoice Extension
        </h2>
        <p className="text-gray-600 mb-4">
          Download the Chrome Extension and install it manually in your browser.
        </p>

        <a
          href="/whatsapp-invoice-extension.zip"
          download
          className="inline-block bg-[#25D366] hover:bg-[#1EBE5F] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          ⬇️ Download Extension
        </a>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">How to Install:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Download and unzip the file above.</li>
            <li>
              Go to{" "}
              <code className="bg-gray-200 px-1 rounded">
                chrome://extensions
              </code>
              (copy and paste this on your search bar)
            </li>
            <li>
              Enable <strong>Developer mode</strong> (top right).
            </li>
            <li>
              Click <strong>“Load unpacked”</strong>
            </li>
            <li>Select the unzipped folder.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
