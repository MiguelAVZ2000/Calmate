'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      }

      if (startPage > 1) {
        pageNumbers.push(1, '...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        pageNumbers.push('...', totalPages);
      }
    }

    return pageNumbers.map((page, index) =>
      typeof page === 'number' ? (
        <Button
          key={index}
          asChild
          variant={page === currentPage ? 'default' : 'outline'}
        >
          <Link href={createPageURL(page)}>{page}</Link>
        </Button>
      ) : (
        <span key={index} className='px-4 py-2'>
          {page}
        </span>
      )
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='flex items-center justify-center space-x-2 mt-12'>
      <Button
        asChild
        variant='outline'
        disabled={currentPage === 1}
      >
        <Link href={createPageURL(currentPage - 1)}>
          <ChevronLeft className='h-4 w-4' />
          <span className='ml-2'>Anterior</span>
        </Link>
      </Button>
      <div className='hidden md:flex items-center space-x-2'>
        {renderPageNumbers()}
      </div>
      <Button
        asChild
        variant='outline'
        disabled={currentPage === totalPages}
      >
        <Link href={createPageURL(currentPage + 1)}>
          <span className='mr-2'>Siguiente</span>
          <ChevronRight className='h-4 w-4' />
        </Link>
      </Button>
    </div>
  );
}