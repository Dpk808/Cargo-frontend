"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/src/components/forms/Form';
import { FormField } from '@/src/components/forms/FormField';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { clientSchema, clientDefaults, type ClientSchema } from '../schemas/client.schemas';
import { useCreateClient, useClientById, useUpdateClient,  } from '../hooks/useClient';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientForm({ clientId }: { clientId?: number }) {
  const router = useRouter();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const { data: client } = useClientById(clientId);

  const form = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientDefaults,
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email ?? '',
        phoneNumber: client.phoneNumber ?? '',
        officeNumber: client.officeNumber ?? '',
        poBoxNumber: client.poBoxNumber ?? '',
        address: client.address,
        city: client.city,
        country: client.country,
      });
    }
  }, [client]);

  const onSubmit = async (values: ClientSchema) => {
    try {
      if (clientId) {
        await updateMutation.mutateAsync({ id: clientId, payload: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push('/client');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong';
      form.setError('root', { message });
    }
  };


  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField name="name" label="Name" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="email" label="Email">
          {(field) => <Input type="email" {...field} />}
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="phoneNumber" label="Phone Number">
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="officeNumber" label="Office Number">
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      <FormField name="poBoxNumber" label="PO Box">
        {(field) => <Input {...field} />}
      </FormField>

      <FormField name="address" label="Address" required>
        {(field) => <Input {...field} />}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField name="city" label="City" required>
          {(field) => <Input {...field} />}
        </FormField>

        <FormField name="country" label="Country" required>
          {(field) => <Input {...field} />}
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={() => router.push('/client')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
          {clientId ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </Form>
  );
}
