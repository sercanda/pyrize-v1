'use client';

import { Button } from '@heroui/react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface ConfettiButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export function ConfettiButton({
  label = 'Yeni Sunum Oluştur',
  href = '/dashboard/olustur',
  className,
}: ConfettiButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.9, x: 0.1 },
      colors: ['#DBE64C', '#22d3ee', '#818cf8'],
    });
    router.push(href);
  };

  return (
    <Button
      disableRipple
      onPress={handlePress}
      className={
        className ??
        'relative w-full overflow-visible rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#030822] shadow-[0_0_24px_rgba(219,230,76,0.35)] transition-transform hover:-translate-y-0.5 after:absolute after:inset-0 after:rounded-xl after:bg-[#DBE64C]/40 after:content-[""] after:transition after:duration-500 hover:after:scale-150 hover:after:opacity-0'
      }
    >
      <Plus className="mr-1.5 inline h-4 w-4" />
      {label}
    </Button>
  );
}
