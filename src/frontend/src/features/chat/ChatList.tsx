import { useGetConversations } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationId, ConversationView } from '../../backend';

interface ChatListProps {
  selectedConversationId: ConversationId | null;
  onSelectConversation: (conversationId: ConversationId) => void;
}

export default function ChatList({ selectedConversationId, onSelectConversation }: ChatListProps) {
  const { data: conversations, isLoading } = useGetConversations();
  const { identity } = useInternetIdentity();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No conversations yet</p>
          <p className="text-sm text-muted-foreground">Start a new chat to get started</p>
        </div>
      </div>
    );
  }

  const getOtherParticipant = (conversation: ConversationView) => {
    const myPrincipal = identity?.getPrincipal().toString();
    const [p1, p2] = conversation.participants;
    return p1.toString() === myPrincipal ? p2 : p1;
  };

  const getInitials = (principal: string) => {
    return principal.slice(0, 2).toUpperCase();
  };

  const getLastMessage = (conversation: ConversationView) => {
    if (conversation.messages.length === 0) return null;
    return conversation.messages[conversation.messages.length - 1];
  };

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const lastMessage = getLastMessage(conversation);
          const isSelected = selectedConversationId === conversation.id;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors text-left ${
                isSelected
                  ? 'bg-emerald-100 dark:bg-emerald-900/30'
                  : 'hover:bg-accent'
              }`}
            >
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarFallback className="bg-emerald-600 text-white font-semibold">
                  {getInitials(otherParticipant.toString())}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {otherParticipant.toString().slice(0, 12)}...
                  </h3>
                  {lastMessage && (
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatDistanceToNow(Number(lastMessage.timestamp) / 1000000, { addSuffix: true })}
                    </span>
                  )}
                </div>
                {lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
