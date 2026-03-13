import React, { useState } from 'react'
import { useChatStore } from '../../hooks/useChat'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

const models = [
  {
    id: 'gpt4',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    icon: '🚀',
    description: 'أقوى نموذج للمهام المعقدة',
    context: '128K',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'claude',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    icon: '🧠',
    description: 'ممتاز للتحليل والمنطق',
    context: '200K',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'gemini',
    name: 'Gemini Pro',
    provider: 'Google',
    icon: '⚡',
    description: 'سريع ومجاني',
    context: '32K',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'mixtral',
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    icon: '🔥',
    description: 'مفتوح المصدر وسريع',
    context: '32K',
    color: 'from-orange-500 to-red-600'
  }
]

export const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentModel, setModel } = useChatStore()
  const selectedModel = models.find(m => m.id === currentModel) || models[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <span className="text-2xl">{selectedModel.icon}</span>
        <div className="text-right">
          <div className="font-bold">{selectedModel.name}</div>
          <div className="text-xs text-gray-500">{selectedModel.provider}</div>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setModel(model.id)
                    setIsOpen(false)
                  }}
                  className={`w-full p-3 text-right rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-start gap-3 ${
                    model.id === currentModel ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                >
                  <span className="text-3xl">{model.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{model.name}</span>
                      {model.id === currentModel && (
                        <CheckIcon className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{model.provider}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {model.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                        {model.context}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                        مجاني
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
