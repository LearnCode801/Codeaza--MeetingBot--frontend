"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, MessageSquare, Settings, Zap } from "lucide-react"

export default function TechnicalFlow() {
  const technicalSteps = [
    {
      phase: "1. File Upload & Processing",
      endpoint: "POST /upload",
      process: [
        "Frontend sends FormData with transcript file",
        "Backend receives and validates file format",
        "Text extraction from document (PDF/DOC parsing)",
        "Content preprocessing and cleaning",
        "Session ID generation (UUID)",
        "Transcript content stored in session memory",
        "Response: {session_id: 'uuid', status: 'success'}",
      ],
      dataFlow: "File → FastAPI → Text Extraction → Session Storage",
    },
    {
      phase: "2. Session Initialization",
      endpoint: "Internal Processing",
      process: [
        "Session object created with unique ID",
        "Transcript content loaded into AI context",
        "Conversation memory initialized",
        "Session metadata stored (timestamp, file info)",
        "AI system prompt configured with transcript context",
        "Session added to active sessions list",
      ],
      dataFlow: "Session Creation → AI Context → Memory Allocation",
    },
    {
      phase: "3. Chat Interaction",
      endpoint: "POST /chat",
      process: [
        "Frontend sends: {session_id, message}",
        "Backend validates session exists",
        "User message added to conversation history",
        "AI model called with full context (transcript + history)",
        "AI generates contextual response",
        "Response added to conversation history",
        "Response sent to frontend: {response: 'ai_message'}",
      ],
      dataFlow: "User Message → AI Processing → Contextual Response",
    },
    {
      phase: "4. Session Management",
      endpoint: "Multiple Endpoints",
      process: [
        "GET /sessions - List all active sessions",
        "GET /session/{id} - Get specific session info",
        "GET /session/{id}/history - Retrieve chat history",
        "DELETE /session/{id} - Remove session and clear memory",
        "POST /clear-all - Reset all sessions (dev/testing)",
      ],
      dataFlow: "Session CRUD → Memory Management → State Persistence",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-teal-800 bg-clip-text text-transparent mb-4">
            Technical Implementation Flow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Detailed technical breakdown of the chatbot system architecture and data processing pipeline
          </p>
        </div>

        <div className="space-y-8">
          {technicalSteps.map((step, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">{step.phase}</CardTitle>
                  <Badge variant="outline" className="font-mono text-sm">
                    {step.endpoint}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">{step.dataFlow}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {step.process.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Models */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Database className="h-6 w-6 text-purple-500" />
            Data Models & Structures
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Session Object
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  {`{
  "id": "uuid-string",
  "created_at": "2024-01-01T00:00:00Z",
  "transcript_content": "meeting text...",
  "conversation_history": [
    {
      "role": "user|assistant",
      "content": "message text",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "filename": "meeting.pdf",
    "file_size": 1024,
    "upload_time": "2024-01-01T00:00:00Z"
  }
}`}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  API Request/Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  {`// Chat Request
{
  "session_id": "uuid-string",
  "message": "What were the key points?"
}

// Chat Response
{
  "response": "Based on the transcript...",
  "session_id": "uuid-string",
  "timestamp": "2024-01-01T00:00:00Z"
}

// Upload Response
{
  "session_id": "uuid-string",
  "status": "success",
  "message": "Transcript processed"
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
