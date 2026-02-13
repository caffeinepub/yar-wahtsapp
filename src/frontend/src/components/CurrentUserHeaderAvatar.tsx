import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CurrentUserHeaderAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CurrentUserHeaderAvatar({ size = 'md', className = '' }: CurrentUserHeaderAvatarProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  // If user has an avatar, show it; otherwise show the app icon
  if (userProfile?.avatar) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
          {userProfile.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Fallback to app icon
  return (
    <img
      src="/assets/generated/yar-wahtsapp-icon.dim_1024x1024.png"
      alt="YAR-WAHTSAPP"
      className={`${sizeClasses[size]} rounded-full ${className}`}
    />
  );
}
