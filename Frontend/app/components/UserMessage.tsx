import { motion } from "framer-motion";
import { Copy, Refresh, CheckCircle, Pen } from "@solar-icons/react";
import { useState } from "react";
// import { cn } from "@/lib/utils";

interface UserMessageProps {
  content: string;
  images?: string[];
  onCopy?: () => void;
  onResend?: () => void;
  onEdit?: (newContent: string) => void;
}

export default function UserMessage({
  content,
  images,
  onCopy,
  onResend,
  onEdit,
}: UserMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit && editValue.trim() !== "") {
      onEdit(editValue);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2 items-end group"
    >
      <div className="max-w-[85%] md:max-w-[75%] space-y-2">
        {/* Images Grid */}
        {images && images.length > 0 && (
          <div
            className={`grid gap-2 mb-2 ${
              images.length === 1
                ? "grid-cols-1"
                : images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-border/50 shadow-sm bg-muted/30"
              >
                <img
                  src={img}
                  alt={`Attached ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Message Content */}
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[300px]">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-muted/50 border border-primary/30 rounded-xl px-4 py-3 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] text-foreground resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-foreground text-background rounded-full text-[12px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Save & Resend
              </button>
            </div>
          </div>
        ) : (
          content && (
            <div className="rounded-2xl px-5 py-3 shadow-md bg-foreground text-background">
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium opacity-95">
                {content}
              </p>
            </div>
          )
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-4 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 pr-1 mt-1">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Edit message"
            >
              <Pen size={14} weight="BoldDuotone" />
              <span>Edit</span>
            </button>

            <button
              onClick={onResend}
              className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Resend request"
            >
              <Refresh size={14} weight="BoldDuotone" />
              <span>Resend</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <>
                  <CheckCircle
                    size={14}
                    weight="BoldDuotone"
                    className="text-green-500"
                  />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} weight="BoldDuotone" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
