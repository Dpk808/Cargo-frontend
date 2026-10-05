// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import Button from '@/src/components/ui/Button';
// import Card from '@/src/components/ui/Card';
// import InputBox from '@/src/components/ui/InputBox';
// import { useAuth } from '@/src/hooks/useAuth';

// export default function SignupPage() {
//   const { register } = useAuth();
//   const router = useRouter();

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError('');
//     setIsSubmitting(true);

//     try {
//       await register({ firstName, lastName, email, password });
//       router.push('/auth/login');
//     } catch {
//       setError('Registration failed. Please verify your details and retry.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="grid min-h-screen place-items-center p-4">
//       <div className="w-full max-w-lg">
//         <Card className="border-white/80 bg-white/85" title="Create Account" subtitle="Start using the cargo management workspace.">
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div className="grid gap-4 md:grid-cols-2">
//               <InputBox
//                 label="First Name"
//                 placeholder="Ava"
//                 value={firstName}
//                 onChange={(event) => setFirstName(event.target.value)}
//                 required
//               />
//               <InputBox
//                 label="Last Name"
//                 placeholder="Cooper"
//                 value={lastName}
//                 onChange={(event) => setLastName(event.target.value)}
//                 required
//               />
//             </div>

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
//               placeholder="Minimum 6 characters"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               minLength={6}
//               required
//             />

//             {error && <p className="text-sm text-red-600">{error}</p>}

//             <Button type="submit" fullWidth isLoading={isSubmitting}>
//               Create account
//             </Button>
//           </form>

//           <p className="mt-4 text-sm text-[var(--color-ink)]/75">
//             Already have an account?{' '}
//             <Link className="font-semibold text-[var(--color-ocean)] hover:underline" href="/auth/login">
//               Sign in
//             </Link>
//           </p>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { SignupCard } from '@/src/features/auth/componenets/AuthCard';
import { SignupForm } from '@/src/features/auth/forms/SignupForm';

export default function SignupPage() {
  return (
    <SignupCard>
      <SignupForm />
    </SignupCard>
  );
}