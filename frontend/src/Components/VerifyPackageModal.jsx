import React, { useEffect, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/library";

export default function VerifyPackageModal({ onClose, onVerify }) {
  const [parsed, setParsed] = useState(null);
  const [raw, setRaw] = useState("");

  // Parse "ROLL:IMT2021010|NAME:Rahul Sharma"
  const parseQR = (text) => {
    try {
      const obj = {};
      text.split("|").forEach((p) => {
        const [key, val] = p.split(":");
        obj[key] = val;
      });
      return obj;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const reader = new BrowserQRCodeReader();

    reader.decodeFromVideoDevice(
      undefined,          // auto-select back camera
      "qr-video",
      (result, err) => {
        if (result) {
          const text = result.getText();
          console.log("QR RAW:", text);
          setRaw(text);

          const parsedData = parseQR(text);
          console.log("PARSED:", parsedData);

          if (parsedData?.ROLL && parsedData?.NAME) {
            setParsed(parsedData);
          }
        }
      }
    );

    return () => reader.reset();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-purple-700">Verify Student</h2>
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

        {/* PARSED RESULT */}
        <div className="px-4 pb-4">
          {!parsed && (
            <p className="text-center text-gray-500">
              Point camera at student's QR code
            </p>
          )}

          {parsed && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-2">

              <div>
                <p className="text-xs text-gray-500">Roll Number</p>
                <p className="font-bold text-purple-700 text-lg">{parsed.ROLL}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Student Name</p>
                <p className="font-bold text-gray-900 text-lg">{parsed.NAME}</p>
              </div>

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
            disabled={!parsed}
            onClick={() => onVerify(parsed)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-green-300"
          >
            Confirm Pickup
          </button>
        </div>

      </div>
    </div>
  );
}
