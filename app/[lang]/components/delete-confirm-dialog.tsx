'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Trash2, X } from 'lucide-react';
import { ReactNode } from 'react';

export interface DeleteConfirmDialogProps {
  trigger?: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  labels: {
    cancel: string;
    delete: string;
  };
  destructive?: boolean;
}

export default function DeleteConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  labels,
  destructive = false,
}: DeleteConfirmDialogProps) {
  const defaultTrigger = (
    <Button size='icon' variant='ghost' className='h-9 w-9'>
      <Trash2 className='h-4 w-4' />
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex w-full flex-row gap-2'>
          <AlertDialogCancel className='flex w-1/4 items-center justify-center gap-2'>
            <X className='h-4 w-4' />
            {labels.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              'flex w-3/4 items-center justify-center gap-2',
              destructive && buttonVariants({ variant: 'destructive' })
            )}
          >
            <Trash2 className='h-4 w-4' />
            {labels.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
