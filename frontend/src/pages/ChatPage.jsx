import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '../../hooks/useChat'
import { useAuthStore } from '../../hooks/useAuth'
import { ModelSelector } from '../../components/chat/ModelSelector'
import { MessageBubble } from '../../components/chat/MessageBubble'
import { sendMessage, getConversations } from '../../services/api'
import { PaperAirplaneIcon, DocumentIcon, MicrophoneIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export const ChatPage = () => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  
  const { currentConversation, setCurrentConversation, addMessage } = useChatStore()
  const { user } = useAuthStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const data = await getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    addMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await sendMessage({
        message: input,
        conversationId: currentConversation?._id,
        model: currentConversation?.model || 'gpt4'
      })

      const aiMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        model: response.model
      }

      addMessage(aiMessage)
      
      if (!currentConversation?._id) {
        setCurrentConversation({
          _id: response.conversationId,
          title: input.slice(0, 50),
          messages: [userMessage, aiMessage]
        })
        loadConversations()
      }
    } catch (error) {
      toast.error('فشل في إرسال الرسالة')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-hidden`}>
        <div className="p-4 h-full overflow-y-auto">
          <button
            onClick={() => setCurrentConversation(null)}
            className="w-full mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90"
          >
            + محادثة جديدة
          </button>
          
          <h3 className="font-bold mb-2 px-2">المحادثات السابقة</h3>
          <div className="space-y-2">
            {conversations.map(conv => (
              <button
                key={conv._id}
                onClick={() => {
                  setCurrentConversation(conv)
                  setShowSidebar(false)
                }}
                className={`w-full p-3 text-right rounded-lg transition ${
                  currentConversation?._id === conv._id 
                    ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-500' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="font-medium truncate">{conv.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(conv.updatedAt).toLocaleDateString('ar')}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h2 className="font-bold">{currentConversation?.title || 'محادثة جديدة'}</h2>
          <ModelSelector />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {currentConversation?.messages?.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">AI</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tr-none p-4">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 items-end bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
            >
              <DocumentIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition">
              <MicrophoneIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              rows="1"
              className="flex-1 bg-transparent border-0 outline-none resize-none max-h-32 p-2"
              placeholder="اكتب رسالتك هنا..."
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt,.jpg,.png"
          />
        </div>
      </div>
    </div>
  )
    }
