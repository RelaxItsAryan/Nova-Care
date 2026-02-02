import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, MessageSquare, Trash2, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  conversation_id: string;
  last_message: string;
  message_count: number;
  last_updated: string;
}

interface ChatHistoryProps {
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  currentConversationId?: string;
}

const ChatHistory = ({ onSelectConversation, onNewChat, currentConversationId }: ChatHistoryProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      loadConversations();
    }
  }, [user, isOpen]);

  const loadConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('conversation_id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation_id
      const grouped = data?.reduce((acc, msg) => {
        if (!acc[msg.conversation_id]) {
          acc[msg.conversation_id] = {
            conversation_id: msg.conversation_id,
            last_message: msg.content,
            message_count: 0,
            last_updated: msg.created_at,
          };
        }
        acc[msg.conversation_id].message_count++;
        return acc;
      }, {} as Record<string, Conversation>) || {};

      setConversations(Object.values(grouped).slice(0, 10));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id)
        .eq('conversation_id', conversationId);

      setConversations(prev => prev.filter(c => c.conversation_id !== conversationId));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <History className="w-5 h-5 text-muted-foreground" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 glass-card rounded-2xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-border/30 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Chat History</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onNewChat();
                    setIsOpen(false);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  + New Chat
                </motion.button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Loading...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No previous conversations
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <motion.div
                      key={conv.conversation_id}
                      whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
                      onClick={() => {
                        onSelectConversation(conv.conversation_id);
                        setIsOpen(false);
                      }}
                      className={`p-3 cursor-pointer flex items-start gap-3 group border-b border-border/10 last:border-0 ${
                        currentConversationId === conv.conversation_id ? 'bg-primary/10' : ''
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {conv.last_message.slice(0, 40)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conv.message_count} messages • {formatDistanceToNow(new Date(conv.last_updated), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => deleteConversation(conv.conversation_id, e)}
                          className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHistory;
