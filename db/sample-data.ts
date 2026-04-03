import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "Yummy Admin",
      email: "admin@yummykingdom.lk",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "Yummy Customer",
      email: "customer@yummykingdom.lk",
      password: hashSync("123456", 10),
      role: "user",
    },
  ],
  products: [
    {
      name: "Margherita Classic Pizza",
      slug: "margherita-classic-pizza",
      category: "Classic Pizza",
      description:
        "Classic Italian tomato sauce, mozzarella, and basil with Yummy Kingdom signature crust.",
      images: [
        "/images/sample-products/p1-1.jpg",
        "/images/sample-products/p1-2.jpg",
      ],
      price: 2250,
      brand: "Yummy Kingdom",
      rating: 4.8,
      numReviews: 32,
      stock: 25,
      isFeatured: true,
      banner: "/images/banner-1.jpg",
    },
    {
      name: "Chicken Supreme Pizza",
      slug: "chicken-supreme-pizza",
      category: "Chicken Pizza",
      description:
        "Loaded with chicken tikka, sweet onions, capsicum, and cheese blend.",
      images: [
        "/images/sample-products/p2-1.jpg",
        "/images/sample-products/p2-2.jpg",
      ],
      price: 3250,
      brand: "Yummy Kingdom",
      rating: 4.7,
      numReviews: 21,
      stock: 30,
      isFeatured: true,
      banner: "/images/banner-2.jpg",
    },
    {
      name: "Spicy Sausage Kingdom Pizza",
      slug: "spicy-sausage-kingdom-pizza",
      category: "Signature Pizza",
      description:
        "Spicy sausage, red chili flakes, caramelized onion, and smoky cheese.",
      images: [
        "/images/sample-products/p3-1.jpg",
        "/images/sample-products/p3-2.jpg",
      ],
      price: 3650,
      brand: "Yummy Kingdom",
      rating: 4.9,
      numReviews: 17,
      stock: 18,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Garden Veggie Pizza",
      slug: "garden-veggie-pizza",
      category: "Veggie Pizza",
      description:
        "Bell peppers, mushrooms, olives, onions, and sweet corn on rich tomato base.",
      images: [
        "/images/sample-products/p4-1.jpg",
        "/images/sample-products/p4-2.jpg",
      ],
      price: 2650,
      brand: "Yummy Kingdom",
      rating: 4.5,
      numReviews: 25,
      stock: 20,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Creamy Chicken Alfredo Pasta",
      slug: "creamy-chicken-alfredo-pasta",
      category: "Pasta",
      description:
        "Creamy alfredo sauce with grilled chicken, herbs, and parmesan finish.",
      images: [
        "/images/sample-products/p5-1.jpg",
        "/images/sample-products/p5-2.jpg",
      ],
      price: 1950,
      brand: "Yummy Kingdom",
      rating: 4.6,
      numReviews: 14,
      stock: 26,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Garlic Bread with Cheese",
      slug: "garlic-bread-with-cheese",
      category: "Sides",
      description:
        "Toasted garlic bread topped with melted mozzarella and herbs.",
      images: [
        "/images/sample-products/p6-1.jpg",
        "/images/sample-products/p6-2.jpg",
      ],
      price: 990,
      brand: "Yummy Kingdom",
      rating: 4.4,
      numReviews: 19,
      stock: 40,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
