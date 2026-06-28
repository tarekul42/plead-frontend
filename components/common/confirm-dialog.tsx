"use client";

import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmDialogProvider");
  return ctx.confirm;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>({ isOpen: false, message: "" });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ ...options, isOpen: true, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!state.isOpen) return <>{children}</>;

  const variantStyles: Record<string, { bg: string; icon: string; button: string }> = {
    danger: { bg: "bg-danger/10", icon: "text-danger", button: "bg-danger text-white hover:bg-danger/90" },
    warning: { bg: "bg-warning/10", icon: "text-warning", button: "bg-warning text-white hover:bg-warning/90" },
    default: { bg: "bg-brand/5", icon: "text-brand", button: "bg-brand text-white hover:bg-brand/90" },
  };

  const styles = variantStyles[state.variant || "default"];

  return (
    <>
      {children}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
          <div className="mb-4 flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.bg}`}>
              <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold">{state.title || "Confirm"}</h3>
              <p className="mt-1 text-sm text-muted">{state.message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCancel}>
              {state.cancelLabel || "Cancel"}
            </Button>
            <button
              onClick={handleConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${styles.button}`}
            >
              {state.confirmLabel || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
