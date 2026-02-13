import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import NewChat from './NewChat';
import CurrentUserHeaderAvatar from '../../components/CurrentUserHeaderAvatar';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, MessageSquarePlus, X } from 'lucide-react';
import type { ConversationId } from '../../backend';

export default function ChatLayout() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<ConversationId | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleSelectConversation = (conversationId: ConversationId) => {
    setSelectedConversationId(conversationId);
    setShowNewChat(false);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setShowNewChat(true);
    setSelectedConversationId(null);
    setSidebarOpen(false);
  };

  const handleConversationCreated = (conversationId: ConversationId) => {
    setSelectedConversationId(conversationId);
    setShowNewChat(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center space-x-3">
            <CurrentUserHeaderAvatar size="md" />
            <h1 className="text-xl font-bold text-foreground">YAR-WAHTSAPP</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <MessageSquarePlus className="mr-2 h-5 w-5" />
            New Chat
          </Button>
        </div>
        <ChatList
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-card flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center space-x-3">
                <CurrentUserHeaderAvatar size="md" />
                <h1 className="text-xl font-bold text-foreground">YAR-WAHTSAPP</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <Button
                onClick={handleNewChat}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <MessageSquarePlus className="mr-2 h-5 w-5" />
                New Chat
              </Button>
            </div>
            <ChatList
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
            />
            <div className="border-t border-border p-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between border-b border-border p-4 bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <CurrentUserHeaderAvatar size="sm" />
            <h1 className="text-lg font-bold text-foreground">YAR-WAHTSAPP</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        {/* Chat Content */}
        {showNewChat ? (
          <NewChat onConversationCreated={handleConversationCreated} />
        ) : selectedConversationId ? (
          <ChatDetail conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/10 dark:via-background dark:to-teal-950/10">
            <div className="text-center space-y-4 px-4">
              <img
                src="/assets/generated/yar-wahtsapp-logo.dim_512x512.png"
                alt="YAR-WAHTSAPP"
                className="h-32 w-32 mx-auto opacity-50"
              />
              <h2 className="text-2xl font-semibold text-muted-foreground">
                Select a chat to start messaging
              </h2>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar or start a new one
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
