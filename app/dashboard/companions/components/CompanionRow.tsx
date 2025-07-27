"use client";

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/app/store/modalSlice';

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  images?: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
}

interface CompanionRowProps {
  companion: ShopifyProduct;
  children: React.ReactNode;
}

export default function CompanionRow({ companion, children }: CompanionRowProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setLoading({ loading: true, message: "Loading companion..." }));
    router.push(`/companions/edit/${companion.id}`);
  };

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={handleClick}
    >
      {children}
    </tr>
  );
}