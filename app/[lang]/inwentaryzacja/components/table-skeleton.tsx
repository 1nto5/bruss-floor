import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  headers: string[];
  rows?: number;
}

export default function TableSkeleton({ headers, rows = 5 }: TableSkeletonProps) {
  return (
    <Skeleton>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header}></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Skeleton>
  );
}
