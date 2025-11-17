import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StudentQRCode() {
  // load from localStorage (set when login happens)
  const profile = JSON.parse(localStorage.getItem("userProfile")) || {
    name: "Unknown User",
    roll: "UNKNOWN",
  };

  const qrText = `ROLL:${profile.rollNumber}|NAME:${profile.name}`;

  
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your QR Code
        </h2>
        <p className="text-gray-500 text-sm">Show this to the guard during pickup</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100 flex flex-col items-center gap-4">
        <QRCodeCanvas
          id="student-qr"
          value={qrText}
          size={300}
          bgColor="#ffffff"
          fgColor="#000000"
          includeMargin={true}
          className="rounded-xl"
        />

        <div className="text-center">
          <p className="font-bold text-gray-800 text-lg">{profile.name}</p>
          <p className="text-purple-700 font-semibold">{profile.rollNumber}</p>
        </div>
      </div>

     
    </div>
  );
}
