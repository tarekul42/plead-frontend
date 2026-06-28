import { Loader2 } from "lucide-react";

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      <p className="text-sm text-muted">{text}</p>
    </div>
  );
}
