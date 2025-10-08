"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

const Popover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
  }
>(({ className, children, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === PopoverTrigger) {
            return React.cloneElement(
              child as React.ReactElement<{ onClick?: () => void }>,
              {
                onClick: () => handleOpenChange(!isOpen),
              }
            );
          }
          if (child.type === PopoverContent) {
            return isOpen ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
});
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, children, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      ...props,
    });
  }
  return (
    <button ref={ref} className={cn("", className)} {...props}>
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    alignOffset?: number;
  }
>(
  (
    { className, align = "center", side = "bottom", sideOffset = 4, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style={{
        position: "absolute",
        top: side === "bottom" ? "100%" : side === "top" ? "auto" : "50%",
        bottom: side === "top" ? "100%" : "auto",
        left:
          side === "right"
            ? "auto"
            : align === "start"
            ? "0%"
            : align === "end"
            ? "auto"
            : "50%",
        right: side === "left" ? "auto" : align === "end" ? "0%" : "auto",
        transform:
          side === "top" || side === "bottom"
            ? `translateX(${
                align === "start" ? "0" : align === "end" ? "0" : "-50%"
              })`
            : `translateY(${
                align === "start" ? "0" : align === "end" ? "0" : "-50%"
              })`,
        marginTop: side === "bottom" ? sideOffset : 0,
        marginBottom: side === "top" ? sideOffset : 0,
        marginLeft: side === "right" ? sideOffset : 0,
        marginRight: side === "left" ? sideOffset : 0,
      }}
      {...props}
    />
  )
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverContent, PopoverTrigger };
