import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  CloudIcon as CloudCheck,
  Zap,
  Users2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface GameStorageAlertProps {
  onClose: () => void;
}

export default function GameStorageAlert({ onClose }: GameStorageAlertProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideGameStorageAlert", "true");
    }
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    const shouldHideAlert =
      localStorage.getItem("hideGameStorageAlert") === "true";
    if (shouldHideAlert) {
      setIsOpen(false);
      onClose();
    }
    setLoading(false);

    const timer = setTimeout(() => {
      if (dontShowAgain) {
        localStorage.setItem("hideGameStorageAlert", "true");
      }
      setIsOpen(false);
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose, dontShowAgain]);

  if (loading || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
        <Alert
          variant="destructive"
          className="bg-amber-50 dark:bg-amber-950 border-none shadow-none"
        >
          <div className="flex items-center justify-center gap-2 text-center">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-amber-900 dark:text-amber-200 text-xl underline">
              Game Storage Information
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-amber-800 dark:text-amber-300">
            <p className="mb-3">
              Your games are currently stored in your browser&apos;s local
              storage. While refreshing or closing the page won&apos;t affect
              your progress, you may lose your games if you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Clear your browser cache/data</li>
              <li>Use a different device or browser</li>
              <li>Use private/incognito mode</li>
            </ul>
            <p className="mb-3">
              Create an account to unlock premium features and enhance your
              chess experience:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                <CloudCheck className="inline-block mr-1 h-4 w-4" /> Cloud-saved
                games for access across devices
              </li>
              <li>
                <Zap className="inline-block mr-1 h-4 w-4" /> Multiple AI
                difficulty levels
              </li>
              <li>
                <Users2 className="inline-block mr-1 h-4 w-4" /> Real-time
                online multiplayer
              </li>
            </ul>
            <div className="flex flex-col justify-center sm:flex-row gap-3">
              <Button
                variant="default"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                onClick={() => router.push("/auth/login")}
              >
                <Lock className="mr-2 h-4 w-4" />
                Create Account
              </Button>
              <Button
                variant="outline"
                className="border-amber-600 text-amber-700 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-900"
                onClick={() => router.push("/account-features")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View All Account Features
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="dontShowAgain"
                  checked={dontShowAgain}
                  onCheckedChange={(checked) =>
                    setDontShowAgain(checked as boolean)
                  }
                />
                <label
                  htmlFor="dontShowAgain"
                  className="text-sm text-amber-800 dark:text-amber-300 cursor-pointer"
                >
                  Don&apos;t show this message again
                </label>
              </div>
              <Button
                variant="ghost"
                className="bg-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700"
                onClick={handleClose}
              >
                <X size={20} className="h-10 w-10" /> Close
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
