import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { usePapers } from "../context/PaperContext";
import { Send, MessageSquare, AlertCircle } from "lucide-react";
import "../styles/dashboard.css";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function Chat() {
  const { papers, chatWithPaper } = usePapers();
  const [selectedPaperId, setSelectedPaperId] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedPaper = papers.find((p) => p.id === selectedPaperId);
  const currentMessages = selectedPaperId ? messagesMap[selectedPaperId] || [] : [];
  const isMessageLoading = selectedPaperId ? loadingMap[selectedPaperId] || false : false;

  // Auto-scroll to bottom of chat when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isMessageLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaperId || !inputMessage.trim() || isMessageLoading) {
      return;
    }

    const messageText = inputMessage.trim();
    setInputMessage("");

    // Append user message immediately
    const userMessage: Message = { role: "user", text: messageText };
    const updatedHistory = [...currentMessages, userMessage];

    setMessagesMap((prev) => ({
      ...prev,
      [selectedPaperId]: updatedHistory,
    }));

    setLoadingMap((prev) => ({
      ...prev,
      [selectedPaperId]: true,
    }));

    try {
      // Send history excluding the last message because the backend takes it as 'message' parameter
      const historyForBackend = currentMessages;

      const aiResponseText = await chatWithPaper(selectedPaperId, messageText, historyForBackend);

      const aiResponse: Message = { role: "model", text: aiResponseText };

      setMessagesMap((prev) => ({
        ...prev,
        [selectedPaperId]: [...updatedHistory, aiResponse],
      }));
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "model",
        text: `⚠️ Error: ${error.message || "Failed to retrieve response from Gemini. Please make sure this paper has been uploaded and parsed in memory."}`,
      };
      setMessagesMap((prev) => ({
        ...prev,
        [selectedPaperId]: [...updatedHistory, errorMessage],
      }));
    } finally {
      setLoadingMap((prev) => ({
        ...prev,
        [selectedPaperId]: false,
      }));
    }
  };

  return (
    <div className="dashboardPage">
      <Sidebar />

      <main className="dashboardContent">
        <Topbar />

        <section className="pageHeader">
          <h1>Ask AI</h1>
          <p>Chat naturally with your uploaded research papers using Gemini AI.</p>
        </section>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 280px)",
            padding: "0 50px 30px",
          }}
        >
          {/* Paper selector row */}
          <div
            className="summaryCard"
            style={{
              padding: "16px 24px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text, #1e293b)" }}>
              Active Research Paper:
            </span>
            <select
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              style={{
                flex: 1,
                maxWidth: "500px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
                background: "var(--bg-select, rgba(255, 255, 255, 0.05))",
                color: "inherit",
                fontSize: "14px",
                outline: "none",
              }}
            >
              <option value="" style={{ color: "#000" }}>-- Select a Paper to Discuss --</option>
              {papers.map((p) => (
                <option key={p.id} value={p.id} style={{ color: "#000" }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chat main area */}
          <div
            className="summaryOutput"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              overflow: "hidden",
            }}
          >
            {!selectedPaperId ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "var(--color-text-muted, #64748b)",
                }}
              >
                <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: "15px" }} />
                <h3>No Paper Selected</h3>
                <p>Select a paper from the dropdown to start chatting with the AI.</p>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Scrollable messages container */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: "8px",
                    marginBottom: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "flex-start",
                      background: "rgba(99, 102, 241, 0.08)",
                      border: "1px solid rgba(99, 102, 241, 0.15)",
                      borderRadius: "12px 12px 12px 0",
                      padding: "12px 16px",
                      maxWidth: "80%",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    👋 Hello! I've loaded <strong>{selectedPaper?.name || ""}</strong>. Feel free to ask me questions about its objectives, methodology, findings, or limitations.
                  </div>

                  {currentMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        background:
                          msg.role === "user"
                            ? "var(--color-primary, #6366f1)"
                            : "var(--bg-card, rgba(255, 255, 255, 0.03))",
                        color: msg.role === "user" ? "#ffffff" : "inherit",
                        border:
                          msg.role === "user"
                            ? "none"
                            : "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                        borderRadius: msg.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                        padding: "12px 16px",
                        maxWidth: "80%",
                        fontSize: "14px",
                        lineHeight: "1.6",
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}

                  {isMessageLoading && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        background: "var(--bg-card, rgba(255, 255, 255, 0.03))",
                        border: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                        borderRadius: "12px 12px 12px 0",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        className="spinner"
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(99, 102, 241, 0.1)",
                          borderTopColor: "#6366f1",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <span style={{ fontSize: "13px", color: "var(--color-text-muted, #64748b)" }}>
                        AI is reading paper...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input box */}
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    display: "flex",
                    gap: "10px",
                    borderTop: "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
                    paddingTop: "16px",
                  }}
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={selectedPaper ? `Ask ResearchMate about "${selectedPaper.name}"...` : "Ask ResearchMate..."}
                    disabled={isMessageLoading}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color, rgba(255, 255, 255, 0.1))",
                      background: "var(--bg-select, rgba(255, 255, 255, 0.05))",
                      color: "inherit",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="primaryAction"
                    disabled={!inputMessage.trim() || isMessageLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "45px",
                      height: "45px",
                      padding: 0,
                      borderRadius: "8px",
                      opacity: !inputMessage.trim() || isMessageLoading ? 0.6 : 1,
                      cursor: !inputMessage.trim() || isMessageLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}