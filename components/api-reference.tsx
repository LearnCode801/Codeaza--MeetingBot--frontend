"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Database, MessageSquare, Upload, Trash2 } from "lucide-react"

export default function APIReference() {
  const endpoints = [
    {
      method: "GET",
      path: "/",
      title: "Welcome Endpoint",
      description: "Get welcome message and available endpoints",
      response: {
        message: "👋 Welcome to the Meeting Transcript Chatbot API!",
        endpoints: "{ ... endpoint descriptions ... }",
      },
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      method: "POST",
      path: "/upload",
      title: "Upload Transcript",
      description: "Upload meeting transcript text and create new session",
      request: {
        transcript: "Meeting transcript text content",
        session_id: "Optional session ID (auto-generated if not provided)",
      },
      response: {
        message: "Transcript uploaded successfully",
        session_id: "generated-uuid",
        transcript_length: 1234,
      },
      icon: Upload,
      color: "bg-green-500",
    },
    {
      method: "POST",
      path: "/chat",
      title: "Chat with AI",
      description: "Send message and get AI response based on transcript",
      request: {
        session_id: "session-uuid",
        message: "What were the key points discussed?",
      },
      response: {
        response: "Based on the transcript, the key points were...",
        session_id: "session-uuid",
      },
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      method: "GET",
      path: "/sessions",
      title: "List Sessions",
      description: "Get all active sessions with metadata",
      response: {
        sessions: "[{ session_id, transcript_length, message_count, created_at, last_activity }]",
        total_sessions: 3,
      },
      icon: Database,
      color: "bg-indigo-500",
    },
    {
      method: "GET",
      path: "/session/{session_id}",
      title: "Get Session Info",
      description: "Get detailed information about a specific session",
      response: {
        session_id: "uuid",
        transcript_length: 1234,
        message_count: 5,
        created_at: "2024-01-01T00:00:00Z",
        last_activity: "2024-01-01T01:00:00Z",
      },
      icon: Database,
      color: "bg-teal-500",
    },
    {
      method: "GET",
      path: "/session/{session_id}/history",
      title: "Get Chat History",
      description: "Retrieve complete chat history for a session",
      response: {
        session_id: "uuid",
        chat_history: "[{ sender: 'user|bot', content: 'message', timestamp: 'iso-date' }]",
      },
      icon: MessageSquare,
      color: "bg-orange-500",
    },
    {
      method: "DELETE",
      path: "/session/{session_id}",
      title: "Delete Session",
      description: "Delete a session and clear its memory",
      response: {
        message: "Session deleted successfully",
      },
      icon: Trash2,
      color: "bg-red-500",
    },
    {
      method: "POST",
      path: "/clear-all",
      title: "Clear All Sessions",
      description: "Clear all sessions (development/testing)",
      response: {
        message: "Cleared X sessions successfully",
      },
      icon: Trash2,
      color: "bg-red-600",
    },
    {
      method: "GET",
      path: "/health",
      title: "Health Check",
      description: "Check API health and configuration status",
      response: {
        status: "healthy",
        active_sessions: 3,
        google_api_key_configured: true,
      },
      icon: Database,
      color: "bg-green-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">
            API Reference
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Complete API documentation for the Meeting Transcript Chatbot backend
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {endpoints.map((endpoint, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${endpoint.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <endpoint.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          endpoint.method === "GET"
                            ? "default"
                            : endpoint.method === "POST"
                              ? "destructive"
                              : "secondary"
                        }
                        className="font-mono text-xs"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">{endpoint.title}</CardTitle>
                <p className="text-sm text-gray-600">{endpoint.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoint.request && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h4>
                      <ScrollArea className="h-24">
                        <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(endpoint.request, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Response:</h4>
                    <ScrollArea className="h-32">
                      <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Models */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Data Models</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Session Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {`{
  "session_id": "uuid-string",
  "transcript": "full transcript text",
  "chat_history": [
    {
      "sender": "user" | "bot",
      "content": "message content",
      "timestamp": "ISO-8601 datetime"
    }
  ],
  "created_at": "ISO-8601 datetime",
  "last_activity": "ISO-8601 datetime"
}`}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Error Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {`{
  "error": "Error message description"
}

// Common HTTP Status Codes:
// 200 - Success
// 400 - Bad Request (missing fields)
// 404 - Not Found (session not found)
// 500 - Server Error`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
