
"use client";

import {
  useEffect,
  useId,
  type ReactNode,
} from "react";

type AppDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  role?: "dialog" | "alertdialog";
  closeOnOverlayClick?: boolean;
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function AppDialog({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = "md",
  role = "dialog",
  closeOnOverlayClick = true,
}: AppDialogProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          closeOnOverlayClick &&
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`retro-dialog my-auto w-full ${sizeClasses[size]} p-5`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <div className="mb-4 flex items-start gap-3">
          {icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2">
              {icon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>

            {description && (
              <div
                id={descriptionId}
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--muted-foreground)" }}
              >
                {description}
              </div>
            )}
          </div>
        </div>

        {children && <div className="mb-4">{children}</div>}

        {footer && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </section>
    </div>
  );
}
