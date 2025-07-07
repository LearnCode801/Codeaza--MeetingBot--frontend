"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Upload,
  MessageCircle,
  Trash2,
  History,
  Send,
  FileText,
  Bot,
  User,
  Sparkles,
  Brain,
  Zap,
  Copy,
  RefreshCw,
  Settings,
  MoreVertical,
  Search,
  Download,
  Star,
  Clock,
  Users,
  Activity,
  Shield,
  UserCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Session {
  session_id: string
  transcript_length: number
  message_count: number
  created_at: string
  last_activity: string
  user_id?: string
  transcript_preview?: string
}

interface ChatMessage {
  sender: "user" | "bot"
  content: string
  timestamp: string
}

interface UserProfile {
  user_id: string
  username: string
  created_at: string
  session_count: number
}

// Safe localStorage access with SSR protection
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

// Generate unique user ID for this browser/device
const generateUserId = (): string => {
  const stored = safeLocalStorage.getItem("ai_assistant_user_id")
  if (stored) return stored

  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  safeLocalStorage.setItem("ai_assistant_user_id", newId)
  return newId
}

// Get or create username - with SSR safety
const getUserProfile = (): UserProfile => {
  const stored = safeLocalStorage.getItem("ai_assistant_user_profile")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      // If parsing fails, create new profile
    }
  }

  const userId = generateUserId()
  const profile: UserProfile = {
    user_id: userId,
    username: `User ${userId.slice(-6)}`,
    created_at: new Date().toISOString(),
    session_count: 0,
  }

  safeLocalStorage.setItem("ai_assistant_user_profile", JSON.stringify(profile))
  return profile
}

// Store user sessions locally for privacy
const getUserSessions = (): Session[] => {
  const stored = safeLocalStorage.getItem("ai_assistant_user_sessions")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return []
    }
  }
  return []
}

const saveUserSessions = (sessions: Session[]) => {
  safeLocalStorage.setItem("ai_assistant_user_sessions", JSON.stringify(sessions))
}

// Store user chat history locally
const getUserChatHistory = (sessionId: string): ChatMessage[] => {
  const stored = safeLocalStorage.getItem(`ai_assistant_chat_${sessionId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      return []
    }
  }
  return []
}

const saveUserChatHistory = (sessionId: string, history: ChatMessage[]) => {
  safeLocalStorage.setItem(`ai_assistant_chat_${sessionId}`, JSON.stringify(history))
}

// Memoized components for better performance
const SessionCard = ({
  session,
  isActive,
  onClick,
  onDelete,
}: {
  session: Session
  isActive: boolean
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}) => {
  const formatDate = useCallback((dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
  }, [])

  return (
    <div
      className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md ring-1 ring-blue-200"
          : "bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"}`}></div>
            <h4 className="font-medium text-gray-900 truncate text-sm">Session {session.session_id.slice(0, 8)}...</h4>
            <Lock className="h-3 w-3 text-green-500" title="Private to you" />
          </div>

          {session.transcript_preview && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2 italic">
              "{(session.transcript_preview || "").slice(0, 60)}..."
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FileText className="h-3 w-3" />
              <span>{Math.round(session.transcript_length / 1000)}K chars</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MessageCircle className="h-3 w-3" />
              <span>{session.message_count} msgs</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{formatDate(session.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
            <Star className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const ChatMessageComponent = ({
  message,
  onCopy,
}: {
  message: ChatMessage
  onCopy: (content: string) => void
}) => {
  const formatTimestamp = useCallback((timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }, [])

  const handleCopy = useCallback(() => {
    onCopy(message.content)
  }, [message.content, onCopy])

  return (
    <div className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-4 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
            message.sender === "user"
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700"
          }`}
        >
          {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        <div
          className={`group rounded-2xl px-6 py-4 shadow-lg relative max-w-full ${
            message.sender === "user"
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "bg-white border border-gray-100 text-gray-900 shadow-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

          <div
            className={`flex items-center justify-between mt-3 pt-2 border-t ${
              message.sender === "user" ? "border-white/20" : "border-gray-100"
            }`}
          >
            <span className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
              {formatTimestamp(message.timestamp)}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                message.sender === "user"
                  ? "text-blue-100 hover:text-white hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserProfileCard = ({
  profile,
  onUsernameChange,
  onClearData,
}: {
  profile: UserProfile
  onUsernameChange: (username: string) => void
  onClearData: () => void
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempUsername, setTempUsername] = useState(profile.username)

  const handleSave = () => {
    onUsernameChange(tempUsername)
    setIsEditing(false)
  }

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <UserCircle className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="h-8 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <Button size="sm" onClick={handleSave} className="h-8 px-3">
                Save
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{profile.username}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          )}
          <p className="text-xs text-gray-500">Private workspace</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-green-500" />
            Secure
          </span>
          <span>{profile.session_count} sessions</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearData}
          className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear Data
        </Button>
      </div>
    </div>
  )
}

export default function MeetingTranscriptChatbot() {
  // State with default values that work on server
  const [userProfile, setUserProfile] = useState<UserProfile>({
    user_id: "",
    username: "Loading...",
    created_at: new Date().toISOString(),
    session_count: 0,
  })
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { toast } = useToast()

  const API_BASE = "https://codeaza-meeting-bot-fastapibackend.vercel.app"

  // Initialize client-side data after hydration
  useEffect(() => {
    setIsClient(true)

    // Load user data from localStorage after component mounts
    const profile = getUserProfile()
    const userSessions = getUserSessions()

    setUserProfile(profile)
    setSessions(userSessions)
    setInitialLoading(false)
  }, [])

  // Memoized calculations for better performance
  const stats = useMemo(() => {
    const totalMessages = sessions.reduce((acc, session) => acc + session.message_count, 0)
    const totalCharacters = sessions.reduce((acc, session) => acc + session.transcript_length, 0)
    return { totalMessages, totalCharacters }
  }, [sessions])

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions
    return sessions.filter(
      (session) =>
        session.session_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.transcript_preview?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [sessions, searchQuery])

  // Update user profile
  const updateUserProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!isClient) return

      const updatedProfile = { ...userProfile, ...updates }
      setUserProfile(updatedProfile)
      safeLocalStorage.setItem("ai_assistant_user_profile", JSON.stringify(updatedProfile))
    },
    [userProfile, isClient],
  )

  // Update username
  const handleUsernameChange = useCallback(
    (newUsername: string) => {
      updateUserProfile({ username: newUsername })
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully.",
      })
    },
    [updateUserProfile, toast],
  )

  // Clear all user data
  const clearAllUserData = useCallback(() => {
    if (!isClient) return

    // Clear localStorage
    safeLocalStorage.removeItem("ai_assistant_user_sessions")
    safeLocalStorage.removeItem("ai_assistant_user_profile")

    // Clear chat histories
    sessions.forEach((session) => {
      safeLocalStorage.removeItem(`ai_assistant_chat_${session.session_id}`)
    })

    // Reset state
    setSessions([])
    setCurrentSession(null)
    setChatHistory([])

    // Create new user profile
    const newProfile = getUserProfile()
    setUserProfile(newProfile)

    toast({
      title: "Data cleared",
      description: "All your data has been cleared from this device.",
    })
  }, [sessions, toast, isClient])

  // Optimized scroll function with requestAnimationFrame
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }, [])

  // Debounced API calls
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }, [])

  // Optimized API calls with abort controller
  const makeAPICall = useCallback(async (url: string, options?: RequestInit) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })
      return response
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted")
        return null
      }
      throw error
    }
  }, [])

  const checkHealth = useCallback(async () => {
    try {
      const response = await makeAPICall(`${API_BASE}/health`)
      if (response?.ok) {
        setIsConnected(true)
      }
    } catch (error) {
      setIsConnected(false)
    }
  }, [makeAPICall, API_BASE])

  // Load chat history from local storage
  const loadChatHistory = useCallback(
    (sessionId: string) => {
      if (!isClient) return

      const history = getUserChatHistory(sessionId)
      setChatHistory(history)
    },
    [isClient],
  )

  // Save session to local storage
  const saveSession = useCallback(
    (session: Session) => {
      if (!isClient) return

      const updatedSessions = [...sessions.filter((s) => s.session_id !== session.session_id), session]
      setSessions(updatedSessions)
      saveUserSessions(updatedSessions)

      // Update user profile session count
      updateUserProfile({ session_count: updatedSessions.length })
    },
    [sessions, updateUserProfile, isClient],
  )

  // Optimized upload function with user isolation
  const uploadTranscript = useCallback(async () => {
    if (!transcript.trim()) {
      toast({
        title: "No transcript provided",
        description: "Please paste your meeting transcript to continue.",
        variant: "destructive",
      })
      return
    }

    if (transcript.length < 10) {
      toast({
        title: "Transcript too short",
        description: "Please provide a longer, valid meeting transcript.",
        variant: "destructive",
      })
      return
    }

    setUploadLoading(true)
    try {
      // Create session with user identification
      const sessionId = `${userProfile.user_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const response = await makeAPICall(`${API_BASE}/upload`, {
        method: "POST",
        body: JSON.stringify({
          transcript: transcript,
          session_id: sessionId, // Use our custom session ID
        }),
      })

      if (response?.ok) {
        const data = await response.json()

        // Create session object with user data
        const newSession: Session = {
          session_id: data.session_id || sessionId,
          transcript_length: transcript.length,
          message_count: 0,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          user_id: userProfile.user_id,
          transcript_preview: transcript.slice(0, 100),
        }

        // Save session locally
        saveSession(newSession)
        setCurrentSession(newSession.session_id)
        setTranscript("")

        toast({
          title: "Upload successful",
          description: `Private session created: ${newSession.session_id.slice(0, 8)}...`,
        })
      } else if (response) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload transcript.",
        variant: "destructive",
      })
    } finally {
      setUploadLoading(false)
    }
  }, [transcript, makeAPICall, API_BASE, userProfile.user_id, saveSession, toast])

  // Optimized send message function with local storage
  const sendMessage = useCallback(async () => {
    if (!message.trim() || !currentSession || !isClient) return

    const userMessage: ChatMessage = {
      sender: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    // Optimistically update UI and save locally
    const newHistory = [...chatHistory, userMessage]
    setChatHistory(newHistory)
    saveUserChatHistory(currentSession, newHistory)

    const currentMessage = message
    setMessage("")
    setLoading(true)

    try {
      const response = await makeAPICall(`${API_BASE}/chat`, {
        method: "POST",
        body: JSON.stringify({
          session_id: currentSession,
          message: currentMessage,
        }),
      })

      if (response?.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          sender: "bot",
          content: data.response,
          timestamp: new Date().toISOString(),
        }

        // Update chat history locally
        const finalHistory = [...newHistory, assistantMessage]
        setChatHistory(finalHistory)
        saveUserChatHistory(currentSession, finalHistory)

        // Update session message count
        const currentSessionData = sessions.find((s) => s.session_id === currentSession)
        if (currentSessionData) {
          const updatedSession = {
            ...currentSessionData,
            message_count: finalHistory.length,
            last_activity: new Date().toISOString(),
          }
          saveSession(updatedSession)
        }
      } else if (response) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Chat request failed")
      }
    } catch (error) {
      toast({
        title: "Message failed",
        description: error instanceof Error ? error.message : "Failed to send message.",
        variant: "destructive",
      })
      // Revert optimistic update
      setChatHistory(chatHistory)
      if (isClient) {
        saveUserChatHistory(currentSession, chatHistory)
      }
    } finally {
      setLoading(false)
    }
  }, [message, currentSession, chatHistory, makeAPICall, API_BASE, sessions, saveSession, toast, isClient])

  const deleteSession = useCallback(
    (sessionId: string) => {
      if (!isClient) return

      // Remove from local storage
      const updatedSessions = sessions.filter((s) => s.session_id !== sessionId)
      setSessions(updatedSessions)
      saveUserSessions(updatedSessions)

      // Remove chat history
      safeLocalStorage.removeItem(`ai_assistant_chat_${sessionId}`)

      // Update UI
      if (currentSession === sessionId) {
        setCurrentSession(null)
        setChatHistory([])
      }

      // Update user profile
      updateUserProfile({ session_count: updatedSessions.length })

      toast({
        title: "Session deleted",
        description: "Session has been deleted from your private workspace.",
      })
    },
    [sessions, currentSession, updateUserProfile, toast, isClient],
  )

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied to clipboard",
          description: "Message copied successfully.",
        })
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy message.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Optimized keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  // Initial setup - only run on client
  useEffect(() => {
    if (isClient) {
      checkHealth()
    }
  }, [checkHealth, isClient])

  // Load chat history when session changes
  useEffect(() => {
    if (currentSession && isClient) {
      loadChatHistory(currentSession)
    }
  }, [currentSession, loadChatHistory, isClient])

  // Auto-scroll with debouncing
  useEffect(() => {
    if (isClient) {
      const debouncedScroll = debounce(scrollToBottom, 100)
      debouncedScroll()
    }
  }, [chatHistory, debounce, scrollToBottom, isClient])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Show loading skeleton for initial load
  if (initialLoading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50">
        <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Meeting Assistant</h1>
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600">Initializing...</span>
            </div>
          </div>
        </div>
        <div className="flex h-[calc(100vh-80px)]">
          <div className="w-80 border-r bg-white/50 backdrop-blur-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded-xl"></div>
                <div className="h-20 bg-gray-200 rounded-xl"></div>
                <div className="h-20 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading AI Assistant...</h2>
              <p className="text-gray-500">Setting up your private workspace...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Meeting Assistant</h1>
                <p className="text-sm text-gray-500">Private & Secure Analysis</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Privacy Info Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              {showPrivacyInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden md:inline">Privacy Info</span>
            </Button>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{sessions.length} Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span>{stats.totalMessages} Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <span>{Math.round(stats.totalCharacters / 1000)}K Characters</span>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className={`text-sm font-medium ${isConnected ? "text-green-600" : "text-red-600"}`}>
                {isConnected ? "Online" : "Offline"}
              </span>
              <Button variant="ghost" size="sm" onClick={checkHealth} className="h-8 w-8 p-0">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Privacy Information Banner */}
        {showPrivacyInfo && (
          <div className="px-6 py-3 bg-green-50 border-t border-green-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-800 mb-1">🔒 Your Privacy is Protected</h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  All your transcripts and conversations are stored locally on your device only. Other users cannot see
                  your data. Each user has their own private workspace identified by a unique ID stored in your browser.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrivacyInfo(false)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Sidebar */}
          <div className="w-80 border-r bg-white/50 backdrop-blur-sm flex flex-col">
            {/* User Profile Section */}
            <div className="p-4 border-b">
              <UserProfileCard
                profile={userProfile}
                onUsernameChange={handleUsernameChange}
                onClearData={clearAllUserData}
              />
            </div>

            {/* Upload Section */}
            <div className="p-6 border-b bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  New Private Session
                </h2>
                <p className="text-sm text-gray-600">Upload your meeting transcript - only you can see it</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Paste your meeting transcript here..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="min-h-[100px] resize-none border-2 border-dashed border-blue-200 bg-white/80 focus:border-blue-400 transition-colors"
                  />
                  {transcript && (
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        {transcript.length} chars
                      </Badge>
                    </div>
                  )}
                </div>

                <Button
                  onClick={uploadTranscript}
                  disabled={!transcript.trim() || uploadLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {uploadLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Private Session...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Create Private Session
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <History className="h-4 w-4 text-green-600" />
                    Your Private Sessions
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {sessions.length}
                  </Badge>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search your sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 bg-white/80"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">No private sessions found</h4>
                      <p className="text-sm text-gray-500">
                        {searchQuery
                          ? "Try a different search term"
                          : "Upload a transcript to create your first private session"}
                      </p>
                    </div>
                  ) : (
                    filteredSessions.map((session) => (
                      <SessionCard
                        key={session.session_id}
                        session={session}
                        isActive={currentSession === session.session_id}
                        onClick={() => setCurrentSession(session.session_id)}
                        onDelete={(e) => {
                          e.stopPropagation()
                          deleteSession(session.session_id)
                        }}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>

              {sessions.length > 0 && (
                <div className="p-4 border-t bg-gray-50/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllUserData}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Private Data
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {currentSession ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Private AI Chat</h2>
                        <p className="text-blue-100 text-sm">Your secure conversation space</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Private: {currentSession.slice(0, 8)}...
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-9 w-9 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-9 w-9 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {chatHistory.length === 0 ? (
                        <div className="text-center py-20">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <Bot className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Analyze Privately</h3>
                          <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                            Your transcript is loaded in your private workspace. Ask me anything about the meeting
                            content - this conversation is completely private to you.
                          </p>
                          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Private & Secure
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Context Aware
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              AI Powered
                            </div>
                          </div>
                        </div>
                      ) : (
                        chatHistory.map((msg, index) => (
                          <ChatMessageComponent
                            key={`${msg.timestamp}-${index}`}
                            message={msg}
                            onCopy={copyToClipboard}
                          />
                        ))
                      )}

                      {loading && (
                        <div className="flex gap-4 justify-start">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
                            <Bot className="h-5 w-5 text-gray-700" />
                          </div>
                          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">AI is analyzing your private request...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t bg-gray-50/50">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Ask me anything about your private transcript..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-[60px] max-h-[150px] resize-none border-2 border-gray-200 focus:border-blue-400 rounded-2xl bg-white shadow-sm transition-all duration-200 pr-12"
                        disabled={loading}
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <Lock className="h-3 w-3 text-green-500" title="Private conversation" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim() || loading}
                      size="lg"
                      className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      Press Enter to send, Shift+Enter for new line
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Lock className="h-3 w-3 text-green-500" />
                      <span>Private & Secure</span>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span>AI Powered</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center max-w-lg px-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Lock className="h-16 w-16 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Private AI Workspace</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Welcome to your secure, private meeting analysis space. Only you can see your transcripts and
                    conversations. Select a session or upload a new transcript to get started.
                  </p>
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Lock className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">100% Private</h4>
                      <p className="text-gray-500">Your data stays on your device</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">Instant Analysis</h4>
                      <p className="text-gray-500">Get insights in seconds</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">Secure & Isolated</h4>
                      <p className="text-gray-500">Each user has their own space</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
