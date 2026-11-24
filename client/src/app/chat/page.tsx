'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { chatAPI, getImageUrl } from '@/lib/api';
import { Conversation, Message } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ChatPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.data?.data) {
        setConversations(res.data.data);
        if (!selectedConv && res.data.data.length > 0) {
          setSelectedConv(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll messages every 5 seconds
  useEffect(() => {
    if (!selectedConv) return;

    const loadMessages = async () => {
      try {
        const res = await chatAPI.getMessages(selectedConv.id);
        if (res.data?.data) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedConv]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    setSending(true);
    try {
      const res = await chatAPI.sendMessage({
        conversationId: selectedConv.id,
        content: newMessage.trim(),
      });
      if (res.data?.data) {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMessage('');
      }
    } catch (err) {
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    const other = conv.participants?.find((p) => p.user?.id !== user?.id);
    return other?.user || { name: 'Seller / Buyer', email: '' };
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Messages</h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] h-[75vh]">
          {/* Conversation list */}
          <div className="md:col-span-4 border-r border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300">
              Conversations ({conversations.length})
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading inbox...</div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const isSelected = selectedConv?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv)}
                      className={`w-full text-left p-4 flex gap-3 items-center transition-colors ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-950/40'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center shrink-0">
                        {other.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {other.name}
                          </p>
                        </div>
                        <p className="text-xs text-primary-600 dark:text-primary-400 truncate">
                          🚗 {conv.listing?.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {conv.messages?.[conv.messages.length - 1]?.content || 'Start a conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No active conversations yet. Visit a vehicle page and click "Contact Seller".
                </div>
              )}
            </div>
          </div>

          {/* Active Conversation messages */}
          <div className="md:col-span-8 flex flex-col h-full bg-gray-50 dark:bg-gray-900/50">
            {selectedConv ? (
              <>
                {/* Header */}
                <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      {getOtherParticipant(selectedConv).name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Concerning: <span className="font-medium text-primary-600">{selectedConv.listing?.title}</span>
                    </p>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => {
                    const isMe = m.senderId === user?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            isMe
                              ? 'bg-primary-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 input-field"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary px-6"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
