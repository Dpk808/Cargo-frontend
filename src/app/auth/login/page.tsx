// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import Button from '@/src/components/ui/Button';
// import Card from '@/src/components/ui/Card';
// import InputBox from '@/src/components/ui/InputBox';
// import { useAuth } from '@/src/hooks/useAuth';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError('');
//     setIsSubmitting(true);

//     try {
//       await login({ email, password });
//     } catch {
//       setError('Login failed. Check your email and password.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="grid min-h-screen place-items-center p-4">
//       <div className="w-full max-w-md">
//         <Card className="border-white/80 bg-white/85" title="Welcome Back" subtitle="Sign in to manage cargo operations.">
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <InputBox
//               label="Email"
//               type="email"
//               placeholder="name@company.com"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               required
//             />
//             <InputBox
//               label="Password"
//               type="password"
//               placeholder="********"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               required
//             />

//             {error && <p className="text-sm text-red-600">{error}</p>}

//             <Button type="submit" fullWidth isLoading={isSubmitting}>
//               Login
//             </Button>
//           </form>

//           <p className="mt-4 text-sm text-[var(--color-ink)]/75">
//             New to Cargo Nexus?{' '}
//             <Link className="font-semibold text-[var(--color-ocean)] hover:underline" href="/auth/signup">
//               Create account
//             </Link>
//           </p>
//         </Card>
//       </div>
//     </div>
//   );
// }
  // 'use client';

  // import Link from 'next/link';
  // import { useForm } from 'react-hook-form';
  // import { zodResolver } from '@hookform/resolvers/zod';
  // import Button from '@/src/components/ui/Button';
  // import Card from '@/src/components/ui/Card';
  // import InputBox from '@/src/components/ui/InputBox';
  // import { loginSchema, type LoginSchema } from '@/src/features/auth/schemas/auth.schemas';
  // import { useLogin } from '@/src/features/auth/hooks/useAuth';

  // export default function LoginPage() {
  //   const { mutate: login, isPending, error } = useLogin();

  //   const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
  //     resolver: zodResolver(loginSchema),
  //   });

  //   return (
  //     <div className="grid min-h-screen place-items-center p-4">
  //       <div className="w-full max-w-md">
  //         <Card className="border-white/80 bg-white/85" title="Welcome Back" subtitle="Sign in to manage cargo operations.">
  //           <form className="space-y-4" onSubmit={handleSubmit((data) => login(data))}>
  //             <InputBox
  //               label="Email"
  //               type="email"
  //               placeholder="name@company.com"
  //               {...register('email')}
  //               error={errors.email?.message}
  //             />
  //             <InputBox
  //               label="Password"
  //               type="password"
  //               placeholder="********"
  //               {...register('password')}
  //               error={errors.password?.message}
  //             />

  //             {error && <p className="text-sm text-red-600">Login failed. Check your credentials.</p>}

  //             <Button type="submit" fullWidth isLoading={isPending}>
  //               Login
  //             </Button>
  //           </form>

  //           <p className="mt-4 text-sm text-[var(--color-ink)]/75">
  //             New to Cargo Nexus?{' '}
  //             <Link className="font-semibold text-[var(--color-ocean)] hover:underline" href="/auth/signup">
  //               Create account
  //             </Link>
  //           </p>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  // app/auth/login/page.tsx
// import Link from 'next/link';
// import Card from '@/src/components/ui/Card';
// import { LoginForm } from '@/src/features/auth/forms/LoginForm';

// export default function LoginPage() {
//   return (
//     <div className="grid min-h-screen place-items-center p-4">
//       <div className="w-full max-w-md">
//         <Card 
//         title="Welcome Back" 
//         subtitle="Sign in to manage cargo operations."
//         >
//           <LoginForm />
//           <p className="mt-4 text-sm text-[var(--color-ink)]/75">
//             New to Cargo Nexus?{' '}
//             <Link className="font-semibold text-[var(--color-ocean)] hover:underline" href="/auth/signup">
//               Create account
//             </Link>
//           </p>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { LoginCard } from '@/src/features/auth/componenets/AuthCard';
import { LoginForm } from '@/src/features/auth/forms/LoginForm';

export default function LoginPage() {
  return (
    <LoginCard>
      <LoginForm />
    </LoginCard>
  );
}