import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { convertImageToDataUrl } from '../../utils/avatarImage';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    try {
      const dataUrl = await convertImageToDataUrl(file);
      setAvatarDataUrl(dataUrl);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : 'Failed to load image');
      setAvatarDataUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await saveProfile.mutateAsync({
        name: name.trim(),
        avatar: avatarDataUrl || undefined,
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to YAR-WAHTSAPP!</DialogTitle>
          <DialogDescription>
            Please enter your name and optionally add a profile picture to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Selection */}
          <div className="space-y-2">
            <Label>Profile Picture (Optional)</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {avatarDataUrl ? (
                  <AvatarImage src={avatarDataUrl} alt="Preview" />
                ) : (
                  <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900">
                    <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {avatarError && (
                  <p className="text-sm text-destructive mt-1">{avatarError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={!name.trim() || saveProfile.isPending}
          >
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
