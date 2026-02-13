import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function AuthScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src="/assets/generated/yar-wahtsapp-logo.dim_512x512.png"
              alt="YAR-WAHTSAPP"
              className="h-32 w-32 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            YAR-WAHTSAPP
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with friends and family instantly
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 rounded-2xl bg-card p-6 shadow-lg">
          <div className="flex items-start space-x-3">
            <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Instant Messaging</h3>
              <p className="text-sm text-muted-foreground">Send and receive messages in real-time</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">Your conversations are protected on the blockchain</p>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isLoggingIn ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Connecting...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to use Internet Identity for secure authentication
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} YAR-WAHTSAPP</p>
      </footer>
    </div>
  );
}
