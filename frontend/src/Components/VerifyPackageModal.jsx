import React, { useEffect, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/library";

export default function VerifyPackageModal({ pkg, onClose, onVerify }) {
  const [email, setEmail] = useState("");
  const [raw, setRaw] = useState("");

  // Parse QR content: "Email:<email>"
  const parseQR = (text) => {
    if (text.startsWith("Email:")) {
      return text.replace("Email:", "").trim();
    }
    return null;
  };

  useEffect(() => {
    const reader = new BrowserQRCodeReader();

    reader.decodeFromVideoDevice(
      undefined,
      "qr-video",
      (result, err) => {
        if (result) {
          const text = result.getText();
          console.log("QR RAW:", text);
          setRaw(text);

          const extractedEmail = parseQR(text);
          console.log("PARSED EMAIL:", extractedEmail);

          if (extractedEmail) {
            setEmail(extractedEmail);
          }
        }
      }
    );

    return () => reader.reset();
  }, []);

  const confirmPickup = async () => {
    const token = localStorage.getItem("token");

    const body = {
      id: pkg.id,
      email: email
    };

    try {
      const res = await fetch("/api/guard/scan", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Verification failed!");
        return;
      }

      onVerify(pkg);  // update UI
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error verifying pickup");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-purple-700">Verify Pickup</h2>
          <button onClick={onClose} className="text-gray-600 text-xl">✕</button>
        </div>

        {/* CAMERA FEED */}
        <div className="p-4">
          <video
            id="qr-video"
            width="100%"
            height="260"
            playsInline
            className="rounded-xl bg-black"
          />
        </div>

        {/* PARSED EMAIL */}
        <div className="px-4 pb-4">
          {!email && (
            <p className="text-center text-gray-500">
              Point camera at student's QR code
            </p>
          )}

          {email && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-1">
              <p className="text-xs text-gray-500">Scanned Email</p>
              <p className="font-bold text-purple-700 text-lg">{email}</p>
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="px-4 pb-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            disabled={!email}
            onClick={confirmPickup}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-green-300"
          >
            Confirm Pickup
          </button>
        </div>

      </div>
    </div>
  );
}
