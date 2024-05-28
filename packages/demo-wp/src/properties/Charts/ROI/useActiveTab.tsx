import { useSearchParams } from 'react-router-dom';

export default function useActiveTab({
  key,
  name,
}: {
  key: string;
  name: string;
}) {
  const [searchParams] = useSearchParams();
  const currTab = searchParams.get(key);

  return {
    isActive: currTab === name,
  };
}
