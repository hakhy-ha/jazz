import { useEffect, useState, useRef } from 'react';
import api from '../lib/api';
import { uploadFile } from '../lib/firebase';
import { useRequireAuth } from '../lib/auth';
import { Search, Phone, Video, MoreVertical, Paperclip, Mic, Smile, Send, Check, CheckCheck } from 'lucide-react';
import Head from 'next/head';

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaUrl?: string;
  type: string;
  status: string; // SENT, DELIVERED, READ
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  nickname?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
};

type Friend = {
  id: string;
  user: User;
};

export default function ChatPage() {
  useRequireAuth();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [peerId, setPeerId] = useState('');
  const [peerUser, setPeerUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFriends();
    loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    try {
      const res = await api.get('/users/me');
      setAuthUser(res.data);
    } catch (err) {
      // user not logged in
    }
  }

  useEffect(() => {
    if (peerId) {
      api.get(`/messages/${peerId}`).then((res) => setMessages(res.data)).catch(() => {});
      const friend = friends.find(f => f.user.id === peerId);
      if (friend) {
        setPeerUser({ ...friend.user, isOnline: true }); // Simulated online status
      } else {
        api.get(`/users/${peerId}`).then((res) => setPeerUser({ ...res.data, isOnline: true })).catch(() => setPeerUser(null));
      }
    } else {
      setPeerUser(null);
    }
  }, [peerId, friends]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerIsTyping]);

  async function loadFriends() {
    try {
      const res = await api.get('/friends/list');
      setFriends(res.data);
    } catch (err) {
      console.error('Error loading friends:', err);
    }
  }

  async function searchUsers(query: string) {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (err) {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => searchUsers(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    
    // Simulate typing indicator
    if (!isTyping) {
      setIsTyping(true);
      // Here we would emit 'typing' socket event
    }
    
    // Clear typing after 2 seconds of no input
    const timeoutId = setTimeout(() => {
      setIsTyping(false);
      // Emit 'stopTyping' event
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  };

  async function sendTextMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!peerId || !content.trim()) return;

    // Optimistic UI update
    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: authUser?.id || '',
      receiverId: peerId,
      content,
      type: 'TEXT',
      status: 'SENT',
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    setContent('');
    setIsTyping(false);

    try {
      const response = await api.post('/messages', { receiverId: peerId, type: 'TEXT', content });
      // Update with real message
      setMessages((prev) => prev.map(m => m.id === tempMessage.id ? response.data : m));
      
      // Simulate fake reply after 3 seconds for showcase
      setTimeout(() => setPeerIsTyping(true), 1500);
      setTimeout(() => {
        setPeerIsTyping(false);
        const replyMessage: Message = {
          id: Date.now().toString(),
          senderId: peerId,
          receiverId: authUser?.id || '',
          content: 'That sounds awesome! 😎',
          type: 'TEXT',
          status: 'READ',
          createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 4000);

    } catch (err) {
      console.error('Send text failed', err);
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden text-[#e9edef] font-sans">
      <Head>
        <title>Jazz Chat</title>
      </Head>

      {/* Sidebar */}
      <aside className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-[#222d34] bg-[#111b21]">
        {/* Sidebar Header */}
        <header className="h-[60px] bg-[#202c33] px-4 flex items-center justify-between flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#6a7175] overflow-hidden flex items-center justify-center">
            {authUser?.avatarUrl ? (
              <img src={authUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-6 h-6 text-[#d1d7db]" />
            )}
          </div>
          <div className="flex gap-4 text-[#aebac1]">
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-[#e9edef]" />
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-2 bg-[#111b21]">
          <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5 h-[35px]">
            <Search className="w-4 h-4 text-[#8696a0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="bg-transparent border-none outline-none w-full ml-4 text-sm text-[#d1d7db] placeholder:text-[#8696a0]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#111b21]">
          {(searchQuery ? searchResults : friends).map((item) => {
            const user = searchQuery ? (item as User) : (item as Friend).user;
            const isSelected = peerId === user.id;
            
            return (
              <button
                key={user.id}
                onClick={() => setPeerId(user.id)}
                className={`w-full flex items-center px-3 py-3 hover:bg-[#202c33] transition-colors ${isSelected ? 'bg-[#2a3942]' : ''}`}
              >
                <div className="w-[49px] h-[49px] rounded-full overflow-hidden mr-4 flex-shrink-0 bg-[#6a7175]">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-full h-full text-[#d1d7db] p-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0 border-b border-[#222d34] pb-3 pr-2 flex flex-col justify-center h-full">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-[17px] text-[#e9edef] truncate">{user.nickname || user.name}</span>
                    <span className="text-xs text-[#8696a0]">10:42 AM</span>
                  </div>
                  <div className="text-sm text-[#8696a0] truncate text-left">
                    {isSelected && peerIsTyping ? (
                      <span className="text-[#00a884] font-medium">typing...</span>
                    ) : (
                      "Tap to chat"
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col bg-[#0b141a] relative ${!peerId ? 'hidden md:flex' : 'flex'}`}>
        {peerId && peerUser ? (
          <>
            {/* Chat Header */}
            <header className="h-[60px] bg-[#202c33] px-4 flex items-center justify-between flex-shrink-0 z-10 border-l border-[#222d34]">
              <div className="flex items-center cursor-pointer">
                <button className="md:hidden mr-2" onClick={() => setPeerId('')}>
                  <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#aebac1]"><path fill="currentColor" d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-[#6a7175]">
                  {peerUser.avatarUrl ? (
                    <img src={peerUser.avatarUrl} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-full h-full text-[#d1d7db] p-1.5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-medium text-[#e9edef]">{peerUser.nickname || peerUser.name}</span>
                  <span className="text-[13px] text-[#8696a0]">
                    {peerUser.isOnline ? 'online' : 'last seen recently'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[#aebac1]">
                <Video className="w-[19px] h-[19px] cursor-pointer hover:text-[#e9edef]" />
                <Phone className="w-[19px] h-[19px] cursor-pointer hover:text-[#e9edef]" />
                <Search className="w-[19px] h-[19px] cursor-pointer hover:text-[#e9edef]" />
              </div>
            </header>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-4 md:px-[6%] flex flex-col gap-1 relative z-0 no-scrollbar"
              style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/17vXoB1393G.png')", backgroundSize: 'contain', backgroundRepeat: 'repeat' }}
            >
              <div className="bg-black/50 absolute inset-0 z-[-1]" /> {/* Dark overlay for background */}
              
              <div className="bg-[#182229] text-[#8696a0] text-xs uppercase px-3 py-1.5 rounded-lg self-center mb-4 shadow-sm">
                Today
              </div>

              {messages.map((message, index) => {
                const isSent = message.senderId === authUser?.id;
                const showTail = index === 0 || messages[index - 1].senderId !== message.senderId;
                
                return (
                  <div key={message.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-1.5' : ''}`}>
                    <div 
                      className={`relative max-w-[65%] rounded-lg px-2 pt-1.5 pb-2 text-[15px] shadow-sm flex flex-col
                        ${isSent ? 'bg-[#005c4b] rounded-tr-none text-[#e9edef]' : 'bg-[#202c33] rounded-tl-none text-[#e9edef]'}
                      `}
                    >
                      {/* Tail SVG */}
                      {showTail && (
                        <span className={`absolute top-0 w-2 h-3 ${isSent ? '-right-2 text-[#005c4b]' : '-left-2 text-[#202c33]'}`}>
                          <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                            {isSent ? (
                              <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                            ) : (
                              <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
                            )}
                          </svg>
                        </span>
                      )}

                      <span className="leading-snug pr-8 whitespace-pre-wrap pl-1">{message.content}</span>
                      
                      <div className="flex items-center justify-end gap-1 mt-[-10px] ml-4 float-right pt-2">
                        <span className="text-[11px] text-white/60">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isSent && (
                          <span className="text-[#53bdeb] ml-0.5">
                            <CheckCheck className="w-[15px] h-[15px]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {peerIsTyping && (
                <div className="flex justify-start mt-2">
                  <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-2 flex items-center gap-1 shadow-sm relative">
                    <span className="absolute top-0 w-2 h-3 -left-2 text-[#202c33]">
                      <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current"><path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" /></svg>
                    </span>
                    <span className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendTextMessage} className="bg-[#202c33] px-4 py-3 flex items-end gap-4 flex-shrink-0 z-10">
              <div className="flex gap-4 pb-2 text-[#8696a0]">
                <Smile className="w-[26px] h-[26px] cursor-pointer hover:text-[#aebac1]" />
                <Paperclip className="w-[26px] h-[26px] cursor-pointer hover:text-[#aebac1]" />
              </div>
              <div className="flex-1 bg-[#2a3942] rounded-lg flex items-end px-3 py-1.5 min-h-[42px] max-h-[120px]">
                <input
                  type="text"
                  value={content}
                  onChange={handleInputChange}
                  placeholder="Type a message"
                  className="w-full bg-transparent border-none outline-none text-[#e9edef] text-[15px] placeholder:text-[#8696a0] py-1"
                />
              </div>
              <div className="pb-2 text-[#8696a0]">
                {content.trim() ? (
                  <button type="submit" className="hover:text-[#aebac1]">
                    <Send className="w-[26px] h-[26px]" />
                  </button>
                ) : (
                  <Mic className="w-[26px] h-[26px] cursor-pointer hover:text-[#aebac1]" />
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border-l border-[#222d34]">
            <img src="/jazz-logo.png" alt="Jazz" className="w-64 h-64 object-contain opacity-20 mb-8" onError={(e) => e.currentTarget.style.display = 'none'} />
            <h1 className="text-[32px] font-light text-[#e9edef] mb-4">Jazz Web</h1>
            <p className="text-[#8696a0] text-sm text-center max-w-md">
              Send and receive messages without keeping your phone online.<br/>
              Use Jazz on up to 4 linked devices and 1 phone at the same time.
            </p>
            <div className="absolute bottom-10 flex items-center gap-2 text-xs text-[#8696a0]">
              <svg viewBox="0 0 10 12" width="10" height="12"><path fill="currentColor" d="M5 0C2.2 0 0 2.2 0 5v2c0 2.8 2.2 5 5 5s5-2.2 5-5V5c0-2.8-2.2-5-5-5zm3.5 7.5c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5v-2c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5v2z"></path></svg>
              End-to-end encrypted
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  );
}
