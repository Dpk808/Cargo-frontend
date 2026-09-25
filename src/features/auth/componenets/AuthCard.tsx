import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import Card from '@/src/components/ui/Card';

export function LoginCard({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <Card title="Welcome Back" subtitle="Sign in to manage cargo operations.">
          {children}
          <p className="mt-4 text-sm text-[var(--color-ink)]/75">
            New to Cargo Nexus?{' '}
            <Link className="font-semibold text-[var(--color-ocean)] hover:underline" href="/auth/signup">
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export function SignupCard({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <Card title="Create Account" subtitle="Start managing your cargo operations.">
          {children}
          <p className="mt-4 text-sm text-[var(--color-ink)]/75">
            Already have an account?{' '}
            <Link className="font-semibold text-[var(--color-ocean)] hover:underline" href="/auth/login">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}