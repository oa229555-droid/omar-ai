// frontend/src/components/chat/MessageBubble.jsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { ClipboardIcon, CheckIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gray-600' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600'
        }`}>
          {isUser ? (
            <span className="text-white text-sm">👤</span>
          ) : (
            <span className="text-white text-sm">AI</span>
          )}
        </div>

        {/* Message Content */}
        <div className={`relative group ${
          isUser 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        } rounded-2xl p-4 ${isUser ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
          
          {/* Markdown Content */}
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative">
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => handleCopy(String(children))}
                      className="absolute top-2 right-2 p-1 bg-gray-800 rounded hover:bg-gray-700 transition"
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <ClipboardIcon className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Message Footer */}
          <div className="flex justify-between items-center mt-2 text-xs opacity-70">
            <span>{new Date(message.timestamp).toLocaleTimeString('ar')}</span>
            
            {/* Action Buttons (for AI messages) */}
            {!isUser && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button 
                  onClick={() => handleCopy(message.content)}
                  className="hover:text-purple-400"
                >
                  <ClipboardIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleSpeak(message.content)}
                  className="hover:text-purple-400"
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Model Badge (for AI messages) */}
          {!isUser && message.model && (
            <div className="absolute -bottom-2 right-2">
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                {message.model}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
