import { motion } from "framer-motion";

interface UserMessageProps {
  content: string;
}

export default function UserMessage({ content }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 md:gap-4 justify-end"
    >
      {/* Message Content */}
      <div className="max-w-[85%] md:max-w-[75%] rounded-lg px-4 py-2 shadow-sm bg-foreground text-background">
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
