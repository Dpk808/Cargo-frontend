'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/src/components/forms/Form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { registerDefaults, registerSchema, type RegisterSchema } from '../schemas/auth.schemas';
import { useRegister } from '../hooks/useAuth';

export function SignupForm() {
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaults,
  });

  return (
    <Form form={form} onSubmit={(data) => register(data)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField name="firstName" label="First Name" required>
          {(field) => <Input placeholder="John" {...field} />}
        </FormField>

        <FormField name="lastName" label="Last Name" required>
          {(field) => <Input placeholder="Doe" {...field} />}
        </FormField>
      </div>

      <FormField name="email" label="Email" required>
        {(field) => (
          <Input type="email" placeholder="name@company.com" {...field} />
        )}
      </FormField>

      <FormField name="password" label="Password" required>
        {(field) => (
          <Input type="password" placeholder="********" {...field} />
        )}
      </FormField>

      {error && <p className="text-sm text-red-600">Registration failed. Please try again.</p>}

      <Button type="submit" fullWidth isLoading={isPending}>
        Create Account
      </Button>
    </Form>
  );
}