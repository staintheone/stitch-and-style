export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic White Tee',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Denim Jacket',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop',
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue', 'Black'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Slim Fit Chinos',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Navy'],
    inStock: false,
  },
  {
    id: '4',
    name: 'Patterned Shirt',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Green', 'Blue'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Black Hoodie',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Linen Summer Dress',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Beige', 'Blue'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Leather Belt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1664285612706-b32633c95820?q=80&w=958&auto=format&fit=crop',
    sizes: ['S', 'M', 'L'],
    colors: ['Brown', 'Black'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Wool Overcoat',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop',
    sizes: ['M', 'L', 'XL'],
    colors: ['Grey', 'Navy', 'Black'],
    inStock: false,
  },
  {
    id: '9',
    name: 'Sneakers',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Red', 'Black'],
    inStock: true,
  },
  {
    id: '10',
    name: 'Striped Polo',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'White', 'Green'],
    inStock: true,
  },
  {
    id: '11',
    name: 'Cargo Shorts',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Khaki', 'Green', 'Black'],
    inStock: true,
  },
  {
    id: '12',
    name: 'Silk Scarf',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1623832101940-647285e32a58?q=80&w=880&auto=format&fit=crop',
    sizes: ['One Size'],
    colors: ['Red', 'Blue', 'Gold'],
    inStock: false,
  },
];
