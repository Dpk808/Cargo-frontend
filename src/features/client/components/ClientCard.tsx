import Card from '@/src/components/ui/Card';
import ClientForm from '../forms/ClientForm';

export function ClientAddCard() {
  return (
    <Card>
      <ClientForm />
    </Card>
  );
}

export function ClientEditCard({ clientId }: {  clientId: number }) {
  return (
    <Card>
      <ClientForm clientId={clientId} />
    </Card>
  );
} 
