'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { newCardSchema as formSchema } from '../lib/zod';
import { getWarehouseOptions, getSectorOptions } from '../actions';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createNewCard } from '../actions';
import { useGetCards } from '../data/get-cards';
import { useCardStore, usePersonalNumberStore } from '../lib/stores';
import { CardType } from '../lib/types';
import ErrorAlert from './error-alert';
import TableSkeleton from './table-skeleton';

export default function CardSelection() {
  const [isPending, setIsPending] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState<any[]>([]);
  const [sectorOptions, setSectorOptions] = useState<any[]>([]);
  const [configsLoading, setConfigsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const {
    personalNumber1,
    personalNumber2,
    personalNumber3,
  } = usePersonalNumberStore();
  const { setCard } = useCardStore();
  const persons = [personalNumber1, personalNumber2, personalNumber3].filter(
    (person) => person,
  );
  const { data, error, refetch, isFetching } = useGetCards(persons);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setConfigsLoading(true);
        const [warehouseRes, sectorRes] = await Promise.all([
          getWarehouseOptions(),
          getSectorOptions(),
        ]);

        if ('error' in warehouseRes) {
          setConfigError(warehouseRes.error || 'Unknown error');
          return;
        }
        if ('error' in sectorRes) {
          setConfigError(sectorRes.error || 'Unknown error');
          return;
        }

        setWarehouseOptions(warehouseRes.success || []);
        setSectorOptions(sectorRes.success || []);
        setConfigError(null);
      } catch (err) {
        setConfigError('Nie udało się załadować konfiguracji');
      } finally {
        setConfigsLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouse: undefined,
      sector: undefined,
    },
  });

  const onSubmitNewCard = async (data: z.infer<typeof formSchema>) => {
    setIsPending(true);
    try {
      const res = await createNewCard(persons, data.warehouse, data.sector);
      if ('error' in res) {
        switch (res.error) {
          case 'persons not found':
            toast.error(
              'Problem z zalogowanymi osobami, zaloguj się ponownie!!',
            );
            break;
          case 'not created':
            toast.error(
              'Nie udało się utworzyć karty! Spróbuj ponownie lub skontaktuj się z IT!',
            );
            break;
          default:
            toast.error('Skontaktuj się z IT!');
        }
      } else if (res.success && res.cardNumber) {
        setCard(res.cardNumber, data.warehouse, data.sector);
      }
    } catch (error) {
      toast.error('Skontaktuj się z IT!');
    } finally {
      setIsPending(false);
    }
  };

  if (data?.error || error) {
    return <ErrorAlert refetch={refetch} isFetching={isFetching} />;
  }

  if (configError) {
    return (
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive'>Błąd konfiguracji</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{configError}</p>
        </CardContent>
      </Card>
    );
  }

  // Process cards data
  const processedCards = data?.success
    ? (data.success as CardType[]).map((card) => ({
        ...card,
        positionsLength: card.positions?.length || 0,
      }))
    : [];

  return (
    <Tabs defaultValue='new' className='w-full sm:w-[600px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='new'>Utwórz nową kartę</TabsTrigger>
        <TabsTrigger value='exists'>Wybierz istniejącą kartę</TabsTrigger>
      </TabsList>
      <TabsContent value='new'>
        <Card className=''>
          <CardHeader>
            <CardTitle>Nowa karta</CardTitle>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewCard)}>
              <CardContent className='grid w-full items-center gap-4 pb-20 sm:pb-0'>
                <FormField
                  control={form.control}
                  name='warehouse'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Magazyn</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          {configsLoading ? (
                            <Skeleton className='h-5 w-32' />
                          ) : (
                            warehouseOptions.map((warehouse) => (
                              <FormItem
                                key={warehouse.value}
                                className='flex items-center space-y-0 space-x-3'
                              >
                                <FormControl>
                                  <RadioGroupItem value={warehouse.value} />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  {warehouse.label}
                                </FormLabel>
                              </FormItem>
                            ))
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sector'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Sektor</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          {configsLoading ? (
                            <Skeleton className='h-5 w-32' />
                          ) : (
                            sectorOptions.map((sector) => (
                              <FormItem
                                key={sector.value}
                                className='flex items-center space-y-0 space-x-3'
                              >
                                <FormControl>
                                  <RadioGroupItem value={sector.value} />
                                </FormControl>
                                <FormLabel className='font-normal'>
                                  {sector.label}
                                </FormLabel>
                              </FormItem>
                            ))
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <div className='fixed bottom-1 left-0 right-0 z-50 bg-background border-t pt-4 pb-4 sm:static sm:border-t-0 sm:pt-0 sm:pb-0'>
                <CardFooter className='flex max-w-[600px] mx-auto py-0 sm:max-w-none sm:py-6'>
                  <Button type='submit' disabled={isPending} className='w-full'>
                    {isPending ? <Loader2 className='animate-spin' /> : <Plus />}
                    Utwórz kartę
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value='exists'>
        {data?.success ? (
          <Card>
            <CardHeader>
              <CardTitle className={clsx('', isFetching && 'animate-pulse')}>
                Wybór wcześniej utworzonej karty
              </CardTitle>
              <CardDescription>
                Tylko karty gdzie autorem jest jedna z zalogowanych osób.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid w-full items-center gap-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numer</TableHead>
                    <TableHead>Pozycje</TableHead>
                    <TableHead>Magazyn</TableHead>
                    <TableHead>Sektor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedCards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center py-4'>
                        Brak kart spełniających kryteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedCards.map((card) => (
                      <TableRow
                        key={card.number}
                        onClick={() => {
                          setCard(card.number, card.warehouse, card.sector);
                        }}
                      >
                        <TableCell>{card.number}</TableCell>
                        <TableCell>
                          <span>{card.positionsLength}</span>
                        </TableCell>
                        <TableCell>{card.warehouse}</TableCell>
                        <TableCell>{card.sector}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          data?.message === 'no cards' && (
            <Card>
              <CardHeader>
                <CardTitle>Nie znaleziono istniejących kart</CardTitle>
                <CardDescription>
                  Utwórz nową kartę, aby rozpocząć!
                </CardDescription>
              </CardHeader>
            </Card>
          )
        )}
        {isFetching && !data?.success && (
          <Card>
            <CardHeader>
              <CardTitle>Wybór wcześniej utworzonej karty</CardTitle>
              <CardDescription>
                Tylko karty gdzie autorem jest jedna z zalogowanych osób.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid w-full items-center gap-4'>
              <TableSkeleton
                headers={['Numer', 'Liczba pozycji', 'Magazyn', 'Sektor']}
              />
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
