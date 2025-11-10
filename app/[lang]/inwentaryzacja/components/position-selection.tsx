'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { PositionType } from '../lib/types';
import { useGetCardPositions } from '../data/get-card-positions';
import {
  useCardStore,
  usePersonalNumberStore,
  usePositionStore,
} from '../lib/stores';
import ErrorAlert from './error-alert';
import TableSkeleton from './table-skeleton';

export default function PositionSelection() {
  const { personalNumber1, personalNumber2, personalNumber3 } =
    usePersonalNumberStore();
  const { card } = useCardStore();
  const { setPosition } = usePositionStore();

  const persons = [personalNumber1, personalNumber2, personalNumber3].filter(
    (person) => person,
  );
  const { data, error, isSuccess, refetch, isFetching } = useGetCardPositions(
    persons,
    card,
  );

  useEffect(() => {
    if (isSuccess && data.message === 'no positions') {
      setPosition(1);
    }
  }, [data?.message, isSuccess, setPosition]);

  if (data?.error || error) {
    return <ErrorAlert refetch={refetch} isFetching={isFetching} />;
  }

  return (
    <Card className='sm:w-[600px] mb-8 sm:mb-0'>
      <CardHeader>
        <CardTitle className={clsx('', isFetching && 'animate-pulse')}>
          Wybór pozycji
        </CardTitle>
        <CardDescription>Numer karty: {card}</CardDescription>
      </CardHeader>
      <CardContent className='grid w-full items-center gap-4'>
        {data?.success && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numer</TableHead>
                <TableHead>Identyfikator</TableHead>
                <TableHead>Numer art.</TableHead>
                <TableHead>Nazwa</TableHead>
                <TableHead>Ilość</TableHead>
                <TableHead>WIP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.success.map((position: PositionType) => (
                <TableRow
                  key={position.position}
                  onClick={() => {
                    setPosition(position.position);
                  }}
                >
                  <TableCell>{position.position}</TableCell>
                  <TableCell>{position.identifier}</TableCell>
                  <TableCell>{position.articleNumber}</TableCell>
                  <TableCell>{position.articleName}</TableCell>
                  <TableCell>{`${position.quantity} ${position.unit}`}</TableCell>
                  <TableCell>{position.wip ? 'Tak' : 'Nie'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {isFetching && !data?.success && (
          <TableSkeleton
            headers={['Numer', 'Identyfikator', 'Numer art.', 'Nazwa', 'Ilość', 'WIP']}
          />
        )}
      </CardContent>
      <div className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t pt-4 pb-4 sm:static sm:border-t-0 sm:pt-0 sm:pb-0'>
        <CardFooter className='flex max-w-[600px] mx-auto py-0 sm:max-w-none sm:py-6'>
          <Button
            onClick={() => {
              setPosition(data.success.length + 1);
            }}
            disabled={isFetching || !data?.success}
            className='w-full'
          >
            <Plus />
            Nowa pozycja
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
