import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { memo } from 'react';
import type { Dictionary } from '../lib/dict';

interface ReportFaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  operatorNames: string[];
  dict: Dictionary;
}

export const ReportFaultDialog = memo<ReportFaultDialogProps>(
  function ReportFaultDialog({
    open,
    onOpenChange,
    onConfirm,
    operatorNames,
    dict,
  }) {
    const handleConfirm = async () => {
      const success = await onConfirm();
      if (success) {
        onOpenChange(false);
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.reportFaultDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.reportFaultDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex w-full flex-row gap-2'>
            <AlertDialogCancel className='flex w-1/4 items-center justify-center gap-2'>
              <X className='h-4 w-4' />
              {dict.reportFaultDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className='flex w-3/4 items-center justify-center gap-2 bg-red-600 hover:bg-red-700'
            >
              <AlertTriangle className='h-4 w-4' />
              {dict.reportFaultDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

