import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const draftApplied = useRef(false);
  const { user, token } = useAuth();
  const { conversations, fetchConversations } = useAppContext();
  const { socket, subscribe, emit } = useSocket(token);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loadingThread, setLoadingThread] = useState(false);
  const [activeConvId, setActiveConvId] = useState(conversationId || '');
  const [receiverId, setReceiverId] = useState('');
  const [peerName, setPeerName] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    if (draftApplied.current) return;
    const st = location.state as { receiverId?: string; userName?: string } | undefined;
    if (st?.receiverId && !conversationId) {
      draftApplied.current = true;
      setReceiverId(st.receiverId);
      setPeerName(st.userName || 'Professional');
      window.history.replaceState({}, document.title);
    }
  }, [conversationId, location.state]);

  useEffect(() => {
    setActiveConvId(conversationId || '');
  }, [conversationId]);

  const selectedConv = conversations.find((c) => c.id === activeConvId);
  useEffect(() => {
    if (!activeConvId) return;
    const other = selectedConv?.participants?.[0];
    setPeerName(other?.fullName || 'Conversation');
    setReceiverId(other?.id || '');
  }, [selectedConv, activeConvId]);

  const loadMessages = useCallback(async (cid: string) => {
    if (!cid) return;
    setLoadingThread(true);
    try {
      const res = await api.get(`/chat/${cid}/messages?limit=120`);
      setMessages(res.data.data || []);
      await api.put(`/chat/${cid}/read`).catch(() => {});
      fetchConversations();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingThread(false);
    }
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConvId) loadMessages(activeConvId);
    else {
      setMessages([]);
    }
  }, [activeConvId, loadMessages]);

  useEffect(() => {
    if (!socket || !activeConvId) return;
    emit('join:conversation', activeConvId);
  }, [socket, activeConvId, emit]);

  useEffect(() => {
    const unsub = subscribe('message:new', (raw: unknown) => {
      const msg = raw as ChatMessage & { conversationId?: string };
      if (msg.conversationId === activeConvId) {
        setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      }
      fetchConversations();
    });
    return unsub;
  }, [subscribe, activeConvId, fetchConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = (id: string) => {
    navigate(`/messages/${id}`);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || (!receiverId && !activeConvId)) return;
    try {
      const res = await api.post('/chat/send', {
        conversationId: activeConvId || null,
        receiverId: receiverId || undefined,
        content: text,
        type: 'TEXT',
      });
      const msg = res.data.data as ChatMessage & { conversationId?: string };
      setMessages((prev) => [...prev, msg]);
      setInput('');
      if (!activeConvId && msg.conversationId) {
        navigate(`/messages/${msg.conversationId}`, { replace: true });
      }
      fetchConversations();
    } catch (e) {
      console.error(e);
      alert('Could not send message.');
    }
  };

  const filtered = conversations.filter((c) => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return true;
    const name = (c.participants?.[0]?.fullName || '').toLowerCase();
    const last = (c.lastMessage?.content || '').toLowerCase();
    return name.includes(q) || last.includes(q);
  });

  return (
    <AppLayout title="" subtitle="">
      <div className="flex bg-[var(--surface)] border border-[var(--border)] mx-4 lg:mx-8 mb-8 overflow-hidden rounded-none min-h-[calc(100vh-92px)]">
        {/* Thread list */}
        <aside className="hidden md:flex flex-col w-[min(100%,340px)] shrink-0 border-r border-[var(--border)] bg-[var(--white)]">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Messages</h2>
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search"
              className="mt-3 w-full border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)] rounded-none bg-[var(--white)]"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => {
              const p = c.participants?.[0];
              const active = c.id === activeConvId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openConversation(c.id)}
                  className={`w-full text-left px-5 py-4 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-alt)] ${active ? 'bg-[var(--surface-alt)] border-l-2 border-l-[var(--accent)]' : 'border-l-2 border-l-transparent'}`}
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-[var(--navy)] text-sm truncate">{p?.fullName || 'User'}</span>
                    {c.unreadCount > 0 && (
                      <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 bg-[var(--navy)] text-white">{c.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted)] truncate mt-1">{c.lastMessage?.content || 'No messages yet'}</p>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="p-6 text-sm text-[var(--muted)]">No conversations yet. Hire a professional and open Messages from their profile.</p>
            )}
          </div>
        </aside>

        {/* Mobile conversation picker */}
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--white)] p-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Conversation</label>
          <select
            className="mt-2 w-full border border-[var(--border)] px-3 py-2 text-sm rounded-none bg-white"
            value={activeConvId}
            onChange={(e) => (e.target.value ? navigate(`/messages/${e.target.value}`) : navigate('/messages'))}
          >
            <option value="">Select…</option>
            {conversations.map((c) => (
              <option key={c.id} value={c.id}>
                {(c.participants?.[0]?.fullName || 'Chat') + (c.unreadCount ? ` (${c.unreadCount})` : '')}
              </option>
            ))}
          </select>
        </div>

        {/* Thread */}
        <section className="flex-1 flex flex-col min-w-0 bg-[var(--surface-alt)]">
          <header className="px-6 py-4 border-b border-[var(--border)] bg-[var(--white)] flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[var(--navy)]">{peerName}</p>
              <p className="text-xs text-[var(--muted)]">Secure messaging · Fixam</p>
            </div>
            <Link to="/providers" className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] border border-[var(--border)] px-3 py-2 hover:border-[var(--navy)] rounded-none">
              Find talent
            </Link>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {loadingThread ? (
              <p className="text-sm text-[var(--muted)]">Loading messages…</p>
            ) : (
              messages.map((msg) => {
                const mine = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[72%] px-4 py-3 text-sm leading-relaxed rounded-none border ${
                        mine ? 'bg-[var(--navy)] text-white border-[var(--navy)]' : 'bg-[var(--white)] border-[var(--border)] text-[var(--navy)]'
                      }`}
                    >
                      {msg.type === 'IMAGE' ? (
                        <img src={msg.content} alt="Attachment" className="max-w-full rounded-none border border-[var(--border)]" />
                      ) : (
                        msg.content
                      )}
                      <div className={`text-[10px] mt-2 opacity-70 ${mine ? 'text-right' : ''}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <footer className="border-t border-[var(--border)] bg-[var(--white)] px-4 py-3 flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={activeConvId || receiverId ? 'Write a message…' : 'Open a conversation or start from a provider profile'}
              disabled={!activeConvId && !receiverId}
              rows={2}
              className="flex-1 border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)] rounded-none resize-none bg-[var(--white)] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim() || (!activeConvId && !receiverId)}
              className="shrink-0 bg-[var(--accent)] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-none border border-[var(--accent)] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </footer>
        </section>
      </div>
    </AppLayout>
  );
}
