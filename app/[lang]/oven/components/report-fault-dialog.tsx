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
import { Button } from '@/components/ui/button';
import type { Locale } from '@/lib/config/i18n';
import { AlertTriangle, X } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import type { Dictionary } from '../lib/dict';
import type { OvenFaultType } from '../lib/types';

interface ReportFaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (faultKey: string) => Promise<boolean>;
  operatorNames: string[];
  faultTypes: OvenFaultType[];
  lang: Locale;
  dict: Dictionary;
}

export const ReportFaultDialog = memo<ReportFaultDialogProps>(
  function ReportFaultDialog({
    open,
    onOpenChange,
    onConfirm,
    operatorNames,
    faultTypes,
    lang,
    dict,
  }) {
    const [selectedFaultKey, setSelectedFaultKey] = useState<string | null>(null);

    // Reset selection when dialog opens
    useEffect(() => {
      if (open) {
        setSelectedFaultKey(null);
      }
    }, [open]);

    const handleConfirm = async () => {
      if (!selectedFaultKey) return;

      const success = await onConfirm(selectedFaultKey);
      if (success) {
        onOpenChange(false);
      }
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className='max-w-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.reportFaultDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.reportFaultDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='grid grid-cols-1 gap-3 py-4'>
            {faultTypes.map((faultType) => (
              <Button
                key={faultType.key}
                variant={selectedFaultKey === faultType.key ? 'default' : 'outline'}
                className='h-auto min-h-16 whitespace-normal text-left justify-start px-4 py-3'
                onClick={() => setSelectedFaultKey(faultType.key)}
              >
                {faultType.translations[lang]}
              </Button>
            ))}
          </div>
          <AlertDialogFooter className='flex w-full flex-row gap-2'>
            <AlertDialogCancel className='flex w-1/4 items-center justify-center gap-2'>
              <X className='h-4 w-4' />
              {dict.reportFaultDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={!selectedFaultKey}
              className='flex w-3/4 items-center justify-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90'
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

