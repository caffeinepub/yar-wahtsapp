import { useState } from 'react';
import { useStartConversation } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus } from 'lucide-react';
import type { ConversationId } from '../../backend';

interface NewChatProps {
  onConversationCreated: (conversationId: ConversationId) => void;
}

export default function NewChat({ onConversationCreated }: NewChatProps) {
  const [principalInput, setPrincipalInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const startConversation = useStartConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const principal = Principal.fromText(principalInput.trim());
      const conversationId = await startConversation.mutateAsync(principal);
      onConversationCreated(conversationId);
    } catch (err: any) {
      if (err.message?.includes('Cannot start a conversation with yourself')) {
        setError('You cannot start a conversation with yourself');
      } else if (err.message?.includes('Invalid principal')) {
        setError('Invalid principal ID. Please check and try again.');
      } else {
        setError(err.message || 'Failed to start conversation. Please try again.');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/10 dark:via-background dark:to-teal-950/10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <UserPlus className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Start New Chat</h2>
          <p className="text-muted-foreground">
            Enter the Principal ID of the person you want to chat with
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal ID</Label>
            <Input
              id="principal"
              placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx...)"
              value={principalInput}
              onChange={(e) => {
                setPrincipalInput(e.target.value);
                setError(null);
              }}
              className="font-mono text-sm"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Ask your friend for their Principal ID to start chatting
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!principalInput.trim() || startConversation.isPending}
          >
            {startConversation.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Starting Chat...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Start Chat
              </>
            )}
          </Button>
        </form>

        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="font-semibold text-sm text-foreground mb-2">How to find a Principal ID:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Ask your friend to share their Principal ID</li>
            <li>Principal IDs are unique identifiers on the Internet Computer</li>
            <li>They look like: xxxxx-xxxxx-xxxxx-xxxxx-xxx</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
