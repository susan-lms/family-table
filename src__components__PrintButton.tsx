"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="no-print rounded-xl border-2 border-emerald-700 px-5 py-3 text-lg font-semibold text-emerald-800">
      Print this page 🖨
    </button>
  );
}
