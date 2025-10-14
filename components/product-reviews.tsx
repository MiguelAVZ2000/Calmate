import type { Review } from "./product-details-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>Aún no hay reseñas para este producto.</p>
        <p>¡Sé el primero en dejar una!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${review.user?.id}`} />
                <AvatarFallback>{review.user?.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(review.created_at), "dd/MM/yyyy")}
                </p>
              </div>
              <div className="flex items-center ml-auto">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}