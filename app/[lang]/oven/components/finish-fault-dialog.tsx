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
import { CheckCircle, X } from 'lucide-react';
import { memo } from 'react';
import { formatDateTime } from '@/lib/utils/date-format';
import type { Dictionary } from '../lib/dict';
import type { OvenFaultReportType } from '../lib/types';

interface FinishFaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  fault: OvenFaultReportType | null;
  dict: Dictionary;
}

export const FinishFaultDialog = memo<FinishFaultDialogProps>(
  function FinishFaultDialog({ open, onOpenChange, onConfirm, fault, dict }) {
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
              {dict.finishFaultDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.finishFaultDialog.description}
            </AlertDialogDescription>
            {fault && (
              <div className='mt-2 space-y-1 text-sm'>
                <div>
                  <strong>{dict.finishFaultDialog.startTime}:</strong>{' '}
                  {formatDateTime(new Date(fault.startTime))}
                </div>
                <div>
                  <strong>{dict.finishFaultDialog.reportedBy}:</strong>{' '}
                  {fault.reportedBy.join(', ')}
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className='flex w-full flex-row gap-2'>
            <AlertDialogCancel className='flex w-1/4 items-center justify-center gap-2'>
              <X className='h-4 w-4' />
              {dict.finishFaultDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className='flex w-3/4 items-center justify-center gap-2 bg-green-600 hover:bg-green-700'
            >
              <CheckCircle className='h-4 w-4' />
              {dict.finishFaultDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

