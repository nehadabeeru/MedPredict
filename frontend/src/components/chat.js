import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/chatbot.css";
import "../App.css";
import ConfirmationModal from "./ConfirmationModal";

const Chat = () => {
  const [messages, setMessages] = useState([{ sender: "ai", text: "Hello! Welcome to MedPredict. How can I assist you today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState([{ id: 1, name: "Session 1", messages: [], isTerminated: false }]);
  const [currentSession, setCurrentSession] = useState("Session 1");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isChatTerminated, setIsChatTerminated] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [similarCasesModalOpen, setSimilarCasesModalOpen] = useState(false);
  const [similarCases, setSimilarCases] = useState([]);

  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isValidInput = (input) => {
    const keywords = ["predict", "how", "what", "why", "where", "when", "patient", "treatment", "symptom"];
    const inputWords = input.toLowerCase().split(/\s+/);
    const containsKeyword = inputWords.some(word => keywords.includes(word));
    return input.trim().length >= 10 && containsKeyword;
  };

  const handleSendMessage = async () => {
    if (!isValidInput(input)) {
      const validationMessage = { sender: "ai", text: `Your input "${input}" is invalid. Please enter a valid and meaningful question or details for a prediction.` };
      setMessages(prev => [...prev, { sender: "user", text: input }, validationMessage]);
      setInput("");
      return;
    }
    const newUserMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    try {
      const response = await sendMessageToBackend(input);
      processBackendResponse(response);
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const sendMessageToBackend = async (text) => {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prediction. Please check the backend server.");
    }
    return response.json();
  };

  const processBackendResponse = (data) => {
    console.log(data);
    if (data.message) {
      setMessages(prevMessages => [...prevMessages, { sender: "ai", text: data.message }]);
      return;
    }
    const { prediction, explanation } = data;
    const predictionMessage = `Given the information, the patient is at '${prediction}' risk for readmission within 30 days. Key factors: ${explanation.key_factors.join(", ")} Recommendations: ${explanation.recommendations.join(" ")}`;
    setMessages(prevMessages => [
      ...prevMessages,
      {
        sender: "ai",
        text: (
          <div>
            <p>{predictionMessage}</p>
            {explanation.similar_cases.length > 0 && (
              <span
                className="similar-cases-link"
                onClick={() => {
                  setSimilarCases(explanation.similar_cases);
                  setSimilarCasesModalOpen(true);
                }}
                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
              >
                View Similar Cases
              </span>
            )}
          </div>
        ),
      },
    ]);
    setButtonsDisabled(false);
  };

  const handleErrorResponse = (error) => {
    setMessages(prevMessages => [...prevMessages, { sender: "ai", text: error.message || "Sorry, I couldn't process your request. Please try again." }]);
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTerminateChat = () => {
    setModalMessage("Are you sure you want to terminate the chat?");
    setModalAction(() => () => {
      const updatedSessions = chatSessions.map((session) =>
        session.name === currentSession
          ? { ...session, messages: [...messages], isTerminated: true }
          : session
      );
      setChatSessions(updatedSessions);
      setIsChatTerminated(true);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  const handleNewChat = () => {
    const updatedSessions = chatSessions.map((session) =>
      session.name === currentSession
        ? { ...session, messages: [...messages] }
        : session
    );
    setChatSessions(updatedSessions);
    const newSessionName = `Session ${chatSessions.length + 1}`;
    const newSession = {
      id: chatSessions.length + 1,
      name: newSessionName,
      messages: [{ sender: "ai", text: "Welcome to MedPredict. Please provide your question for a new prediction." }],
      isTerminated: false,
    };
    setChatSessions([...updatedSessions, newSession]);
    setCurrentSession(newSessionName);
    setMessages(newSession.messages);
    setIsChatTerminated(false);
  };

  const handleLogout = () => {
    setModalMessage("Are you sure you want to log out?");
    setModalAction(() => async () => {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
    setModalOpen(true);
  };

  const handleChatSelection = (session) => {
    const updatedSessions = chatSessions.map((s) =>
      s.name === currentSession ? { ...s, messages: [...messages] } : s
    );
    setChatSessions(updatedSessions);
    const selectedSession = updatedSessions.find((s) => s.name === session.name);
    setCurrentSession(session.name);
    setMessages(selectedSession.messages || []);
    setIsChatTerminated(selectedSession.isTerminated);
  };

  const handleNeedHelp = () => {
    setHelpModalOpen(true);
  };

  return (
    <div className="chatgpt-container">
      <div className="sidebar">
        <h2>Chat Sessions</h2>
        <ul className="chat-list">
          {chatSessions.map((session) => (
            <li
              key={session.id}
              className={`session-button ${session.name === currentSession ? "active" : ""}`}
              onClick={() => handleChatSelection(session)}
            >
              <span className={`status-dot ${session.isTerminated ? "grey" : "green"}`}></span>
              {session.name}
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="chatbox">
        <div className="chat-header">
          <h2>{currentSession}</h2>
          <div>
            <button onClick={handleTerminateChat} className="terminate-btn" disabled={isChatTerminated}>
              Terminate Chat
            </button>
            <button onClick={handleNewChat} className="newChat-btn" disabled={!isChatTerminated}>
              New Chat
            </button>
          </div>
        </div>
        <div className="chat-content">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-bubble-container">
                {message.sender === "ai" ? <div className="ai-icon"></div> : <i className="bx bxs-user user-icon"></i>}
                <div className={`message-bubble ${message.sender}`}>{message.text}</div>
              </div>
            </div>
          ))}
          {isTyping && <div className="typing-indicator">MedPredict is typing...</div>}
          <div ref={chatEndRef}></div>
        </div>
        <div className="chat-input-container">
          <textarea
            placeholder="Enter your message here..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            disabled={loading || isChatTerminated}
          />
          <button
            onClick={handleSendMessage}
            className="send-btn"
            disabled={loading || input.trim() === "" || isChatTerminated}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
        {!buttonsDisabled && (
          <div className="action-buttons">
            <button onClick={handleNeedHelp} className="help-btn">
              Need Help
            </button>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        message={modalMessage}
        onConfirm={() => {
          modalAction();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
      {helpModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Emergency Assistance</h2>
            <p>If this is a medical emergency, please contact <strong>911</strong> immediately.</p>
            <p>
              For additional government emergency services, visit:
              <ul>
                <li>
                  <a href="https://www.usa.gov/emergency-health" target="_blank" rel="noopener noreferrer">
                    USA Emergency Health Services
                  </a>
                </li>
                <li>
                  <a href="https://www.ready.gov/" target="_blank" rel="noopener noreferrer">
                    Ready.gov - Emergency Preparedness
                  </a>
                </li>
              </ul>
            </p>
            <button onClick={() => setHelpModalOpen(false)} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
      {similarCasesModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Similar Cases</h2>
            <ul>
              {similarCases.map((caseItem, index) => (
                <li key={index}>{caseItem}</li>
              ))}
            </ul>
            <button onClick={() => setSimilarCasesModalOpen(false)} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;