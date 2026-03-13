// frontend/src/stores/chatStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set, get) => ({
      currentConversation: null,
      conversations: [],
      currentModel: 'gpt4',
      isLoading: false,
      error: null,

      // Set current conversation
      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
      },

      // Set model
      setModel: (model) => {
        set({ currentModel: model });
      },

      // Add message to current conversation
      addMessage: (message) => {
        const { currentConversation } = get();
        if (currentConversation) {
          set({
            currentConversation: {
              ...currentConversation,
              messages: [...currentConversation.messages, message]
            }
          });
        } else {
          set({
            currentConversation: {
              _id: null,
              title: message.content.slice(0, 50),
              messages: [message],
              model: get().currentModel
            }
          });
        }
      },

      // Update last message (for streaming)
      updateLastMessage: (content) => {
        const { currentConversation } = get();
        if (currentConversation?.messages?.length > 0) {
          const messages = [...currentConversation.messages];
          const lastMessage = messages[messages.length - 1];
          lastMessage.content += content;
          
          set({
            currentConversation: {
              ...currentConversation,
              messages
            }
          });
        }
      },

      // Clear current conversation
      clearConversation: () => {
        set({ currentConversation: null });
      },

      // Set conversations list
      setConversations: (conversations) => {
        set({ conversations });
      },

      // Add conversation to list
      addConversationToList: (conversation) => {
        const { conversations } = get();
        set({
          conversations: [conversation, ...conversations]
        });
      },

      // Update conversation in list
      updateConversationInList: (conversationId, updates) => {
        const { conversations } = get();
        set({
          conversations: conversations.map(conv =>
            conv._id === conversationId ? { ...conv, ...updates } : conv
          )
        });
      },

      // Delete conversation
      deleteConversation: (conversationId) => {
        const { conversations, currentConversation } = get();
        set({
          conversations: conversations.filter(conv => conv._id !== conversationId),
          currentConversation: currentConversation?._id === conversationId 
            ? null 
            : currentConversation
        });
      },

      // Set loading state
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Set error
      setError: (error) => {
        set({ error });
      }
    }),
    {
      name: 'omnia-chat-storage',
      partialize: (state) => ({
        currentModel: state.currentModel,
        conversations: state.conversations.map(conv => ({
          _id: conv._id,
          title: conv.title,
          model: conv.model,
          updatedAt: conv.updatedAt
        }))
      })
    }
  )
);
