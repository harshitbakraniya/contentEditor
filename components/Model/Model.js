// components/Model.tsx

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

const Model = ({ open, onOpenChange, title, children, buttons = [] }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-full max-w-md shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div>{children}</div>

          {buttons.length > 0 && (
            <div className="flex gap-2 justify-end pt-4">
              {buttons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.onClick}
                  className={`px-4 py-2  text-white transition ${
                    btn.type === "cancel"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Model;
