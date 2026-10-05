'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/src/components/forms/Form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { loginDefaults, loginSchema, type LoginSchema } from '../schemas/auth.schemas';
import { useLogin } from '../hooks/useAuth';

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaults,
  });

  return (
    <Form form={form} onSubmit={(data) => login(data)} className="space-y-4">
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

      {error && <p className="text-sm text-red-600">Login failed. Check your credentials.</p>}

      <Button type="submit" fullWidth isLoading={isPending}>
        Login
      </Button>
    </Form>
  );
}