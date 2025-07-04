import { useEffect } from "react";

type Props = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, type = "success", onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", top: 30, right: 30, zIndex: 9999,
      background: type === "success" ? "#4caf50" : "#e53935",
      color: "#fff", padding: "14px 32px", borderRadius: 10,
      boxShadow: "0 4px 24px #0003", fontWeight: 600, fontSize: 17,
      letterSpacing: 0.3, minWidth: 180, textAlign: "center"
    }}>
      {message}
    </div>
  );
}
