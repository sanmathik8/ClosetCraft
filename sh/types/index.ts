// types/index.ts
export interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  description?: string;
  colour: string;
}

export interface CartItem extends IProduct {
  quantity: number;
  selectedSize: string;
}
