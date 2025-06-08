import { useState, useRef } from "react";

export default function useToast(duration = 1500) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);

  const showToast = (msg) => {
    setMessage(msg);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(""), duration);
  };

  return [message, showToast];
}
