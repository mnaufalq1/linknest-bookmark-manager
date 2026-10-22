
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type FormMessageProps = {
  message?: string;
  type?: "error" | "success" | "info";
};

const messageStyles = {
  error: {
    container:
      "border-[var(--retro-terracotta)] bg-[var(--surface)]",
    icon: "text-[var(--retro-terracotta)]",
    Icon: AlertCircle,
  },
  success: {
    container: "border-[var(--accent)] bg-[var(--surface)]",
    icon: "text-[var(--accent)]",
    Icon: CheckCircle2,
  },
  info: {
    container: "border-[var(--retro-mustard)] bg-[var(--surface)]",
    icon: "text-[var(--retro-mustard)]",
    Icon: Info,
  },
};

export function FormMessage({
  message,
  type = "error",
}: FormMessageProps) {
  if (!message) return null;

  const style = messageStyles[type];
  const Icon = style.Icon;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`mt-2 flex items-start gap-2 rounded-md border-2 p-3 text-sm text-[var(--foreground)] ${style.container}`}
    >
      <Icon
        size={18}
        className={`${style.icon} mt-0.5 shrink-0`}
        aria-hidden="true"
      />

      <p className="min-w-0 break-words">{message}</p>
    </div>
  );
}
