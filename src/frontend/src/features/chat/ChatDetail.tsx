import { useEffect, useRef } from 'react';
import { useGetMessages } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import MessageComposer from './MessageComposer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import type { ConversationId } from '../../backend';

interface ChatDetailProps {
  conversationId: ConversationId;
}

export default function ChatDetail({ conversationId }: ChatDetailProps) {
  const { data: messages, isLoading } = useGetMessages(conversationId);
  const { identity } = useInternetIdentity();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const myPrincipal = identity?.getPrincipal().toString();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  const getInitials = (principal: string) => {
    return principal.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-12">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages?.map((message) => {
              const isMe = message.sender.toString() === myPrincipal;
              const timestamp = Number(message.timestamp) / 1000000; // Convert nanoseconds to milliseconds

              return (
                <div
                  key={message.id.toString()}
                  className={`flex items-end space-x-2 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={isMe ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'}>
                      {getInitials(message.sender.toString())}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : 'bg-card border border-border rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-1">
                      {format(timestamp, 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message Composer */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <MessageComposer conversationId={conversationId} />
        </div>
      </div>
    </div>
  );
}
