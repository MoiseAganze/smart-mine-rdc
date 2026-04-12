import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Database,
  Minimize2,
  Maximize2,
  Zap,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type AIContentBlock,
  type AIStatColor,
  aiSuggestedQueries,
  getAIResponse,
} from "@/lib/mock-data";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  blocks?: AIContentBlock[];
  text?: string;
  timestamp: Date;
}

const STAT_COLORS: Record<AIStatColor, string> = {
  red: "text-red-400 bg-red-500/10 border-red-500/25",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/25",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/25",
};

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

function RenderBlock({
  block,
  idx,
}: {
  block: AIContentBlock;
  idx: number;
}) {
  if (block.type === "text") {
    return (
      <p key={idx} className="text-slate-200 text-sm leading-relaxed">
        {parseInline(block.content)}
      </p>
    );
  }

  if (block.type === "stats") {
    return (
      <div
        key={idx}
        className={cn(
          "grid gap-2 my-1",
          block.items.length <= 2 ? "grid-cols-2" : "grid-cols-2"
        )}
      >
        {block.items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-2.5 transition-colors",
              STAT_COLORS[item.color] ?? STAT_COLORS.blue
            )}
          >
            <p className="text-[10px] text-slate-400 mb-0.5 font-medium uppercase tracking-wide">
              {item.label}
            </p>
            <p className="text-base font-bold leading-none">{item.value}</p>
            {item.sub && (
              <p className="text-[10px] mt-1 opacity-70">{item.sub}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "table") {
    return (
      <div
        key={idx}
        className="my-1.5 rounded-lg border border-slate-700/60 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-slate-700/70">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-2.5 py-1.5 text-left text-slate-300 font-semibold whitespace-nowrap border-b border-slate-700/60"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-t border-slate-700/40 transition-colors",
                    i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/10"
                  )}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-2.5 py-1.5 text-slate-300 whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div key={idx} className="space-y-1.5 my-1">
        {block.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-2.5 p-2 rounded-lg bg-slate-700/25 border border-slate-700/40 hover:bg-slate-700/40 transition-colors"
          >
            <span className="text-sm shrink-0 leading-none mt-0.5">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 leading-snug">
                {item.text}
              </p>
              {item.sub && (
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {item.sub}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2.5">
      <div className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
      <span className="text-[11px] text-slate-500 italic">
        Analyse de la base de données…
      </span>
    </div>
  );
}

const WELCOME_BLOCKS: AIContentBlock[] = [
  {
    type: "text",
    content:
      "Bonjour Admin ! Je suis votre **Analyste IA** connecté en temps réel à la base de données SMART MINE RDC.",
  },
  {
    type: "text",
    content:
      "Je peux analyser vos **transports**, **alertes**, **équipements GPS**, **minerais** et vous fournir des insights opérationnels détaillés. Que souhaitez-vous explorer ?",
  },
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      blocks: WELCOME_BLOCKS,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized, messages, scrollToBottom]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setHasNewMessage(false);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isThinking) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: query,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsThinking(true);
      scrollToBottom();

      const { blocks, delay } = getAIResponse(query);

      await new Promise((r) => setTimeout(r, delay));

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        blocks,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    },
    [isThinking, scrollToBottom]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        blocks: WELCOME_BLOCKS,
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setIsThinking(false);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── Chat Panel ── */}
      <div
        ref={panelRef}
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[420px] flex flex-col rounded-2xl overflow-hidden",
          "border border-slate-700/60 shadow-2xl shadow-black/60",
          "bg-slate-900/95 backdrop-blur-xl",
          "transition-all duration-300 ease-out origin-bottom-right",
          isOpen && !isMinimized
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : isOpen && isMinimized
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto h-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
        style={{ maxHeight: isMinimized ? "auto" : "600px" }}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 px-4 py-3 shrink-0 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-violet-900/50" />
          <div className="absolute inset-0 border-b border-primary-700/40" />

          {/* Avatar */}
          <div className="relative shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-900/50">
            <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            {/* Live indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 pulse-dot" />
          </div>

          {/* Title */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-white leading-none">
                IA Analyst
              </p>
              <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
            </div>
            <p className="text-[10px] text-primary-300/80 mt-0.5 flex items-center gap-1">
              <Database className="w-2.5 h-2.5" />
              Connecté · Base SMART MINE RDC
            </p>
          </div>

          {/* Actions */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Réinitialiser la conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized((v) => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isMinimized ? "Agrandir" : "Réduire"}
            >
              {isMinimized ? (
                <Maximize2 className="w-3.5 h-3.5" />
              ) : (
                <Minimize2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body — collapses when minimized */}
        <div
          className={cn(
            "flex flex-col flex-1 overflow-hidden transition-all duration-300",
            isMinimized ? "h-0 opacity-0" : "opacity-100"
          )}
          style={{ maxHeight: isMinimized ? 0 : 520 }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                {msg.role === "assistant" && (
                  <div className="shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-primary-600 to-violet-700 flex items-center justify-center mt-0.5 shadow-sm">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    "flex flex-col gap-1.5 max-w-[88%]",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {msg.role === "user" ? (
                    <div className="bg-primary-600/90 text-white text-sm px-3 py-2 rounded-2xl rounded-tr-sm shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="bg-slate-800/70 border border-slate-700/40 rounded-2xl rounded-tl-sm px-3 py-2.5 space-y-2 shadow-sm w-full">
                      {msg.blocks?.map((block, i) => (
                        <RenderBlock key={i} block={block} idx={i} />
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-600 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-primary-600 to-violet-700 flex items-center justify-center mt-0.5">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-slate-800/70 border border-slate-700/40 rounded-2xl rounded-tl-sm shadow-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips — shown only on fresh chat */}
          {messages.length <= 1 && !isThinking && (
            <div className="px-3 pb-2 pt-1">
              <p className="text-[10px] text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
                Questions suggérées
              </p>
              <div className="flex flex-wrap gap-1.5">
                {aiSuggestedQueries.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => sendMessage(q.query)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-primary-700/30 hover:border-primary-600/50 hover:text-white transition-all cursor-pointer"
                  >
                    <span>{q.icon}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 shrink-0 border-t border-slate-700/40 bg-slate-900/50">
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 focus-within:border-primary-600/60 focus-within:bg-slate-800/80 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question sur les données…"
                disabled={isThinking}
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none disabled:opacity-50 min-w-0"
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isThinking}
                className={cn(
                  "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                  inputValue.trim() && !isThinking
                    ? "bg-primary-600 text-white hover:bg-primary-500 shadow-sm"
                    : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                )}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-600 text-center mt-1.5">
              IA connectée à la BDD SMART MINE RDC · Simulation analytique
            </p>
          </div>
        </div>
      </div>

      {/* ── Floating Button ── */}
      <button
        onClick={() => {
          setIsOpen((v) => !v);
          setIsMinimized(false);
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 group",
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br from-primary-500 via-primary-600 to-violet-700",
          "shadow-xl shadow-primary-900/60",
          "transition-all duration-300 cursor-pointer",
          "hover:scale-110 hover:shadow-2xl hover:shadow-primary-800/70",
          isOpen ? "scale-90 rotate-12" : "scale-100 rotate-0 ai-float-btn"
        )}
        title="Assistant IA"
        aria-label="Ouvrir l'assistant IA"
      >
        {/* Outer glow ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 opacity-0 group-hover:opacity-30 scale-110 transition-all duration-300" />
        )}

        {/* Icon */}
        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform duration-300" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-white" />
              {/* Notification dot */}
              {hasNewMessage && (
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </>
          )}
        </div>

        {/* Tooltip label */}
        {!isOpen && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-slate-700/60">
            Assistant IA
            <span className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-slate-800 border-r border-t border-slate-700/60 rotate-45" />
          </span>
        )}
      </button>
    </>
  );
}
