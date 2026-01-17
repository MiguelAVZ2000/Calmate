'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useSupabase } from '@/components/providers/auth-provider';

const reviewSchema = z.object({
  rating: z.number().min(1, 'La calificación es requerida'),
  comment: z
    .string()
    .min(10, 'El comentario debe tener al menos 10 caracteres'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewForm({ productId }: { productId: number }) {
  const { user, supabase } = useSupabase();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña.');
      return;
    }

    const { error } = await supabase.from('reviews').insert([
      {
        product_id: productId,
        user_id: user.id,
        rating: data.rating,
        comment: data.comment,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert('¡Gracias por tu reseña!');
      reset();
      setRating(0);
    }
  };

  if (!user) {
    return (
      <div className='text-center text-muted-foreground'>
        <p>
          <a href='/auth' className='underline'>
            Inicia sesión
          </a>{' '}
          para dejar una reseña.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <p className='font-medium'>Calificación</p>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <Star
                key={i}
                className={`h-8 w-8 cursor-pointer ${
                  ratingValue <= (hoverRating || rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(0)}
              />
            );
          })}
        </div>
        <input type='hidden' {...register('rating')} value={rating} />
        {errors.rating && (
          <p className='text-sm text-destructive'>{errors.rating.message}</p>
        )}
      </div>
      <div>
        <Textarea
          placeholder='Escribe tu reseña aquí...'
          {...register('comment')}
        />
        {errors.comment && (
          <p className='text-sm text-destructive'>{errors.comment.message}</p>
        )}
      </div>
      <Button type='submit'>Enviar Reseña</Button>
    </form>
  );
}
