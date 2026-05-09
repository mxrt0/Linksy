import { useEffect, useState } from "react";
import QRCode from "qrcode"

type Props = {
  open: boolean;
  shortCode: string | null;
  url: string | null;
  onClose: () => void;
};

export function QrModal({
  open,
  shortCode,
  url,
  onClose
}: Props) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    if (!open || !url) return;

    QRCode.toDataURL(url, {
      margin: 1,
      width: 320
    }).then(setQr);
  }, [open, url]);

  if (!open || !url || !shortCode) return null;

  const download = () => {
    const a = document.createElement("a");

    a.href = qr;
    a.download = `${shortCode}.png`;

    a.click();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/55 backdrop-blur-sm
        px-4
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-sm rounded-3xl
          bg-white dark:bg-[#111118]
          border border-gray-200 dark:border-white/10
          shadow-2xl shadow-black/25
          p-6
          animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* HEADER */}
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
            QR Code
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Share your link
          </h2>

          <p className="mt-1 text-sm text-gray-400 dark:text-white/35">
            Scan to instantly open the shortened URL.
          </p>
        </div>

        {/* QR */}
        <div
          className="
            rounded-2xl p-4
            bg-gray-50 dark:bg-white/3
            border border-gray-200 dark:border-white/10
            flex items-center justify-center
            mb-4
          "
        >
          {qr && (
            <img
              src={qr}
              alt="QR Code"
              className="w-56 h-56 rounded-xl"
            />
          )}
        </div>

        {/* URL */}
        <div
          className="
            mb-5 px-3 py-2 rounded-xl
            bg-gray-50 dark:bg-white/3
            border border-gray-200 dark:border-white/10
            text-sm text-center
            text-gray-600 dark:text-white/60
            truncate
          "
        >
          {url}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="
              flex-1 py-2.5 rounded-xl
              border border-gray-200 dark:border-white/10
              bg-white dark:bg-white/5
              hover:bg-gray-50 dark:hover:bg-white/10
              text-sm font-medium
              text-gray-700 dark:text-white/70
              transition cursor-pointer
            "
          >
            Close
          </button>

          <button
            onClick={download}
            className="
              flex-1 py-2.5 rounded-xl
              bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-medium
              transition cursor-pointer
            "
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}