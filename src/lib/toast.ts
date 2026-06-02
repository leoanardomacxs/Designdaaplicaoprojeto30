// Simple toast system using DOM events. No external libs.
import { useEffect, useState } from "react";

export type ToastKind = "success" | "error" | "info";
export type ToastMsg = { id: number; kind: ToastKind; title: string; description?: string };

const EVT = "app:toast";
let counter = 0;

export function toast(kind: ToastKind, title: string, description?: string) {
  if (typeof window === "undefined") return;
  const msg: ToastMsg = { id: ++counter, kind, title, description };
  window.dispatchEvent(new CustomEvent<ToastMsg>(EVT, { detail: msg }));
}

export function useToasts() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const onAdd = (e: Event) => {
      const m = (e as CustomEvent<ToastMsg>).detail;
      setItems((prev) => [...prev, m]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== m.id)), 4500);
    };
    window.addEventListener(EVT, onAdd);
    return () => window.removeEventListener(EVT, onAdd);
  }, []);
  return items;
}
