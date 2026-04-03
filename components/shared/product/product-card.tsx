import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-0 ">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="h-56 w-full flex items-center justify-center overflow-hidden rounded-t-xl bg-white">
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-xs text-muted-foreground">{product.brand}</div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium leading-snug min-h-[40px] line-clamp-2">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center justify-between gap-4 mt-auto">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
