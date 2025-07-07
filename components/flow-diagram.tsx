"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  MessageCircle,
  Database,
  Brain,
  History,
  Trash2,
  CheckCircle,
  ArrowRight,
  FileText,
  Bot,
  User,
  Server,
  Zap,
} from "lucide-react"

export default function ChatbotFlowDiagram() {
  const flowSteps = [
    {
      id: 1,
      title: "User Lands on Application",
      description: "Initial state with empty session list",
      icon: User,
      color: "bg-blue-500",
      api: "GET /sessions",
      details: [
        "Application loads and fetches existing sessions",
        "Empty state shown if no sessions exist",
        "User sees upload interface",
      ],
    },
    {
      id: 2,
      title: "File Upload Process",
      description: "User selects and uploads meeting transcript",
      icon: Upload,
      color: "bg-green-500",
      api: "POST /upload",
      details: [
        "User selects transcript file (.txt, .pdf, .doc, .docx)",
        "File uploaded via FormData to backend",
        "Backend processes and extracts text content",
        "New session created with unique session_id",
      ],
    },
    {
      id: 3,
      title: "Session Initialization",
      description: "Backend creates AI context from transcript",
      icon: Database,
      color: "bg-purple-500",
      api: "Session Created",
      details: [
        "Transcript content processed and stored",
        "AI context initialized with document content",
        "Session memory allocated for conversation",
        "Session ID returned to frontend",
      ],
    },
    {
      id: 4,
      title: "Chat Interface Activation",
      description: "User can now interact with AI about transcript",
      icon: MessageCircle,
      color: "bg-indigo-500",
      api: "GET /session/{id}/history",
      details: [
        "Chat interface becomes active",
        "Previous chat history loaded (if any)",
        "User can ask questions about transcript content",
        "AI has full context of the meeting",
      ],
    },
    {
      id: 5,
      title: "AI Conversation Loop",
      description: "Ongoing chat interaction with context awareness",
      icon: Brain,
      color: "bg-orange-500",
      api: "POST /chat",
      details: [
        "User sends message with session_id",
        "AI processes query with transcript context",
        "Intelligent response generated",
        "Conversation history maintained",
      ],
    },
    {
      id: 6,
      title: "Session Management",
      description: "User can manage multiple sessions",
      icon: History,
      color: "bg-teal-500",
      api: "Multiple APIs",
      details: [
        "Switch between different transcript sessions",
        "View chat history for each session",
        "Delete individual sessions",
        "Clear all sessions if needed",
      ],
    },
  ]

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/",
      purpose: "Welcome message and API status",
      usage: "Initial connection test",
    },
    {
      method: "POST",
      endpoint: "/upload",
      purpose: "Upload transcript and create session",
      usage: "File upload with FormData",
    },
    {
      method: "POST",
      endpoint: "/chat",
      purpose: "Send message and get AI response",
      usage: "JSON: {session_id, message}",
    },
    {
      method: "GET",
      endpoint: "/session/{session_id}",
      purpose: "Get session information",
      usage: "Retrieve session details",
    },
    {
      method: "DELETE",
      endpoint: "/session/{session_id}",
      purpose: "Delete session and clear memory",
      usage: "Remove specific session",
    },
    {
      method: "GET",
      endpoint: "/session/{session_id}/history",
      purpose: "Get chat history for session",
      usage: "Load conversation history",
    },
    {
      method: "GET",
      endpoint: "/sessions",
      purpose: "List all active sessions",
      usage: "Session management interface",
    },
    {
      method: "GET",
      endpoint: "/health",
      purpose: "Health check endpoint",
      usage: "System monitoring",
    },
    {
      method: "POST",
      endpoint: "/clear-all",
      purpose: "Clear all sessions",
      usage: "Development/testing reset",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Meeting Transcript Chatbot Flow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Complete system architecture and user journey for the AI-powered meeting transcript analysis platform
          </p>
        </div>

        {/* Flow Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Zap className="h-6 w-6 text-blue-500" />
            User Journey & System Flow
          </h2>

          <div className="space-y-8">
            {flowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < flowSteps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-200 z-0"></div>
                )}

                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Step Icon */}
                      <div
                        className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className="text-xs font-medium">
                            Step {step.id}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {step.api}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-4">{step.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      {index < flowSteps.length - 1 && (
                        <div className="hidden lg:block">
                          <ArrowRight className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Server className="h-6 w-6 text-green-500" />
            API Endpoints Reference
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiEndpoints.map((endpoint, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        endpoint.method === "GET" ? "default" : endpoint.method === "POST" ? "destructive" : "secondary"
                      }
                      className="font-mono text-xs"
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-900 mb-2">{endpoint.purpose}</h4>
                  <p className="text-sm text-gray-600">{endpoint.usage}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Flow Architecture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Database className="h-6 w-6 text-purple-500" />
            System Architecture & Data Flow
          </h2>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Frontend Layer */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Frontend Layer</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      React/Next.js Interface
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      File Upload Component
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Chat Interface
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Session Management
                    </div>
                  </div>
                </div>

                {/* API Layer */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">API Layer</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      FastAPI Backend
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      File Processing
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Session Management
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI Integration
                    </div>
                  </div>
                </div>

                {/* AI Layer */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">AI Layer</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Language Model
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Context Processing
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Response Generation
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Memory Management
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Zap className="h-6 w-6 text-yellow-500" />
            Key System Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Multi-Format Support",
                description: "Supports .txt, .pdf, .doc, .docx transcript files",
                color: "bg-blue-500",
              },
              {
                icon: Brain,
                title: "Context-Aware AI",
                description: "AI maintains full context of uploaded transcript",
                color: "bg-purple-500",
              },
              {
                icon: History,
                title: "Session Persistence",
                description: "Chat history maintained across sessions",
                color: "bg-green-500",
              },
              {
                icon: MessageCircle,
                title: "Real-time Chat",
                description: "Instant AI responses with conversation flow",
                color: "bg-indigo-500",
              },
              {
                icon: Database,
                title: "Multi-Session Support",
                description: "Handle multiple transcript sessions simultaneously",
                color: "bg-teal-500",
              },
              {
                icon: Trash2,
                title: "Session Management",
                description: "Create, delete, and manage chat sessions",
                color: "bg-red-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
