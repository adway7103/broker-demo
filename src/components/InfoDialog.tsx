"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttonText?: string;
  variant?: "default" | "success" | "error" | "warning";
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: "text-blue-500",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
  },
};

export function InfoDialog({
  open,
  onOpenChange,
  title,
  description,
  buttonText = "OK",
  variant = "default",
}: InfoDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 