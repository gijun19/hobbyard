import { useParams } from 'react-router-dom';

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Card Detail</h1>
      <p className="text-gray-600">Card ID: {id}</p>
    </div>
  );
}
