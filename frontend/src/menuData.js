// ==========================================
// 1. CAMPUS EATERIES LIST
// ==========================================
export const OUTLETS = [
  {
    id: 1,
    name: "Just Chill Cafe",
    cuisines: "Chinese, Starters, Egg Items, Momos, Parathas",
    rating: 4.5,
    cost_for_two: 200,
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Go Insta Cafe",
    cuisines: "Cold Coffee, Shakes, Sandwiches, Fries, Toasts",
    rating: 4.4,
    cost_for_two: 180,
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Mahaveer Juice & Milkshake",
    cuisines: "Milkshakes, Fresh Juices, Lassi, Sundaes",
    rating: 4.6,
    cost_for_two: 120,
    image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Nescafe Hostel",
    cuisines: "Buns, Sandwiches, Garlic Bread, Burgers, Wraps",
    rating: 4.3,
    cost_for_two: 200,
    image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Tea Post",
    cuisines: "Chai, Nasta, Grilled Sandwiches, Coolers, Milkshakes",
    rating: 4.5,
    cost_for_two: 150,
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
  }
];

// ==========================================
// 2. MASTER MENU ITEMS (FLATTENED BY OUTLET)
// ==========================================
export const MENU_ITEMS = [
  // OUTLET 1: JUST CHILL CAFE
  { id: 101, outletId: 1, name: "Veg Fried Rice", price: 80, is_veg: true },
  { id: 102, outletId: 1, name: "Manchurian Rice", price: 80, is_veg: true },
  { id: 103, outletId: 1, name: "Schezwan Rice", price: 80, is_veg: true },
  { id: 104, outletId: 1, name: "Manch-Schez Rice", price: 90, is_veg: true },
  { id: 105, outletId: 1, name: "Paneer Fried Rice", price: 90, is_veg: true },
  { id: 106, outletId: 1, name: "Veg Hakka Noodles", price: 80, is_veg: true },
  { id: 107, outletId: 1, name: "Manchurian Noodles", price: 80, is_veg: true },
  { id: 108, outletId: 1, name: "Schezwan Noodles", price: 80, is_veg: true },
  { id: 109, outletId: 1, name: "Paneer Hakka Noodles", price: 90, is_veg: true },
  { id: 110, outletId: 1, name: "Egg Fried Rice", price: 80, is_veg: false },
  { id: 111, outletId: 1, name: "Egg Noodles", price: 80, is_veg: false },
  { id: 112, outletId: 1, name: "Chicken Fried Rice", price: 90, is_veg: false },
  { id: 113, outletId: 1, name: "Chicken Schezwan Rice", price: 90, is_veg: false },
  { id: 114, outletId: 1, name: "Chicken Combination Rice", price: 90, is_veg: false },
  { id: 115, outletId: 1, name: "Chicken Noodles", price: 90, is_veg: false },
  { id: 116, outletId: 1, name: "Chicken Schezwan Noodles", price: 90, is_veg: false },
  { id: 117, outletId: 1, name: "Veg Manchurian (Gravy/Dry)", price: 80, is_veg: true },
  { id: 118, outletId: 1, name: "Paneer Chilli", price: 160, is_veg: true },
  { id: 119, outletId: 1, name: "Chicken Dana", price: 100, is_veg: false },
  { id: 120, outletId: 1, name: "Chicken Chilly", price: 150, is_veg: false },
  { id: 121, outletId: 1, name: "Omelette + 2 Bread", price: 55, is_veg: false },
  { id: 122, outletId: 1, name: "Half-Fry + 2 Bread", price: 55, is_veg: false },
  { id: 123, outletId: 1, name: "Egg Burji + 2 Bread", price: 55, is_veg: false },
  { id: 124, outletId: 1, name: "Classic Veg Momos", price: 80, is_veg: true },
  { id: 125, outletId: 1, name: "Paneer Steam Momos", price: 90, is_veg: true },
  { id: 126, outletId: 1, name: "Paneer Pan Fried Momos", price: 110, is_veg: true },
  { id: 127, outletId: 1, name: "Corn Cheese Momos", price: 110, is_veg: true },
  { id: 128, outletId: 1, name: "Chicken Steam Momos", price: 90, is_veg: false },
  { id: 129, outletId: 1, name: "Chicken Pan Fried Momos", price: 110, is_veg: false },
  { id: 130, outletId: 1, name: "Spicy Mutton Momos", price: 110, is_veg: false },
  { id: 131, outletId: 1, name: "Aloo Paratha", price: 60, is_veg: true },
  { id: 132, outletId: 1, name: "Aloo-Paneer Mix Paratha", price: 70, is_veg: true },
  { id: 133, outletId: 1, name: "Special Paneer Paratha", price: 90, is_veg: true },
  { id: 134, outletId: 1, name: "Plain Rice", price: 60, is_veg: true },
  { id: 135, outletId: 1, name: "Jeera Rice", price: 70, is_veg: true },
  { id: 136, outletId: 1, name: "Chapati", price: 15, is_veg: true },
  { id: 137, outletId: 1, name: "Schezwan Chatni", price: 5, is_veg: true },
  { id: 138, outletId: 1, name: "Mayonnaise", price: 10, is_veg: true },
  { id: 139, outletId: 1, name: "Dahi", price: 10, is_veg: true },
  { id: 140, outletId: 1, name: "Chai (Elaichi Flavour)", price: 10, is_veg: true },

  // OUTLET 2: GO INSTA CAFE
  { id: 201, outletId: 2, name: "Hazelnut Cold Coffee (225ml)", price: 60, is_veg: true },
  { id: 202, outletId: 2, name: "Cappuccino Cold Coffee (225ml)", price: 60, is_veg: true },
  { id: 203, outletId: 2, name: "Brazilian Roast Cold Coffee", price: 60, is_veg: true },
  { id: 204, outletId: 2, name: "Classic French Roast Cold Coffee", price: 50, is_veg: true },
  { id: 205, outletId: 2, name: "Mocha Cold Coffee", price: 50, is_veg: true },
  { id: 206, outletId: 2, name: "Americano (Water Base)", price: 40, is_veg: true },
  { id: 207, outletId: 2, name: "Hot Coffee Mocha (100ml)", price: 30, is_veg: true },
  { id: 208, outletId: 2, name: "Hot Coffee Hazelnut", price: 35, is_veg: true },
  { id: 209, outletId: 2, name: "Hot Coffee Cappuccino", price: 30, is_veg: true },
  { id: 210, outletId: 2, name: "Hot Coffee Brazilian Roast", price: 35, is_veg: true },
  { id: 211, outletId: 2, name: "Hot Coffee Classic French Roast", price: 30, is_veg: true },
  { id: 212, outletId: 2, name: "Adrak Chai Cutting", price: 15, is_veg: true },
  { id: 213, outletId: 2, name: "Adrak Chai Mug", price: 30, is_veg: true },
  { id: 214, outletId: 2, name: "Hot Chocolate", price: 60, is_veg: true },
  { id: 215, outletId: 2, name: "Caramel Hot Chocolate", price: 65, is_veg: true },
  { id: 216, outletId: 2, name: "Vanilla Coffee Shake", price: 60, is_veg: true },
  { id: 217, outletId: 2, name: "Chocolate Coffee Shake", price: 60, is_veg: true },
  { id: 218, outletId: 2, name: "Oreo Coffee Shake", price: 60, is_veg: true },
  { id: 219, outletId: 2, name: "Lemon Ice Tea", price: 40, is_veg: true },
  { id: 220, outletId: 2, name: "Lemon Mint Ice Tea", price: 45, is_veg: true },
  { id: 221, outletId: 2, name: "Peach Ice Tea", price: 40, is_veg: true },
  { id: 222, outletId: 2, name: "Lychee Ice Tea", price: 40, is_veg: true },
  { id: 223, outletId: 2, name: "Blueberry Ice Tea", price: 40, is_veg: true },
  { id: 224, outletId: 2, name: "Mint Crush Slush", price: 40, is_veg: true },
  { id: 225, outletId: 2, name: "Blueberry Slush", price: 40, is_veg: true },
  { id: 226, outletId: 2, name: "Lychee Slush", price: 40, is_veg: true },
  { id: 227, outletId: 2, name: "Peach Slush", price: 40, is_veg: true },
  { id: 228, outletId: 2, name: "Cucumber Cooler Slush", price: 40, is_veg: true },
  { id: 229, outletId: 2, name: "Peach Lemonade", price: 30, is_veg: true },
  { id: 230, outletId: 2, name: "Lychee Lemonade", price: 30, is_veg: true },
  { id: 231, outletId: 2, name: "Blueberry Lemonade", price: 30, is_veg: true },
  { id: 232, outletId: 2, name: "Lemonade", price: 20, is_veg: true },
  { id: 233, outletId: 2, name: "Ginger Lemonade", price: 25, is_veg: true },
  { id: 234, outletId: 2, name: "Veg Masala Oats", price: 60, is_veg: true },
  { id: 235, outletId: 2, name: "Masala Atta Noodles", price: 60, is_veg: true },
  { id: 236, outletId: 2, name: "Veg Atta Noodles", price: 65, is_veg: true },
  { id: 237, outletId: 2, name: "Spicy Corn Sandwich", price: 75, is_veg: true },
  { id: 238, outletId: 2, name: "Mexican Sandwich", price: 70, is_veg: true },
  { id: 239, outletId: 2, name: "Tandoori Paneer Sandwich", price: 90, is_veg: true },
  { id: 240, outletId: 2, name: "Peri Peri Paneer Sandwich", price: 90, is_veg: true },
  { id: 241, outletId: 2, name: "Paneer Makhni Sandwich", price: 100, is_veg: true },
  { id: 242, outletId: 2, name: "Veg Sandwich (Not Grilled)", price: 50, is_veg: true },
  { id: 243, outletId: 2, name: "Grilled Veg Sandwich", price: 60, is_veg: true },
  { id: 244, outletId: 2, name: "Veg Cheese Sandwich", price: 75, is_veg: true },
  { id: 245, outletId: 2, name: "Cheese Corn Sandwich", price: 70, is_veg: true },
  { id: 246, outletId: 2, name: "Cheese Makhni Paneer Toast", price: 100, is_veg: true },
  { id: 247, outletId: 2, name: "Peri Peri Cheese Paneer Toast", price: 100, is_veg: true },
  { id: 248, outletId: 2, name: "Tandoori Cheese Paneer Toast", price: 100, is_veg: true },
  { id: 249, outletId: 2, name: "Cheese Salsa Paneer Toast", price: 100, is_veg: true },
  { id: 250, outletId: 2, name: "Mexican Cheese Paneer Toast", price: 110, is_veg: true },
  { id: 251, outletId: 2, name: "Cheese Mayo Paneer Toast", price: 90, is_veg: true },
  { id: 252, outletId: 2, name: "French Fries (125g)", price: 50, is_veg: true },
  { id: 253, outletId: 2, name: "Masala Fries (125g)", price: 60, is_veg: true },
  { id: 254, outletId: 2, name: "Peri Peri Fries (165g)", price: 75, is_veg: true },
  { id: 255, outletId: 2, name: "Peri Peri Cheese Toast", price: 80, is_veg: true },
  { id: 256, outletId: 2, name: "Tandoori Cheese Toast", price: 80, is_veg: true },
  { id: 257, outletId: 2, name: "Cheese Salsa Toast", price: 80, is_veg: true },
  { id: 258, outletId: 2, name: "Mexican Cheese Toast", price: 90, is_veg: true },
  { id: 259, outletId: 2, name: "Cheese Mayo Toast", price: 70, is_veg: true },
  { id: 260, outletId: 2, name: "Garlic Bread (3 pcs)", price: 50, is_veg: true },
  { id: 261, outletId: 2, name: "Corn Capsicum Cheese Garlic Bread", price: 75, is_veg: true },
  { id: 262, outletId: 2, name: "Veg Bonanza Cheese Garlic Bread", price: 75, is_veg: true },

  // OUTLET 3: MAHAVEER JUICE & MILKSHAKE
  { id: 301, outletId: 3, name: "Banana Milkshake", price: 30, is_veg: true },
  { id: 302, outletId: 3, name: "Banana Choco Milkshake", price: 40, is_veg: true },
  { id: 303, outletId: 3, name: "Apple Milkshake", price: 40, is_veg: true },
  { id: 304, outletId: 3, name: "Chocolate Milkshake", price: 40, is_veg: true },
  { id: 305, outletId: 3, name: "Oreo Milkshake", price: 40, is_veg: true },
  { id: 306, outletId: 3, name: "Oreo Chocolate Milkshake", price: 50, is_veg: true },
  { id: 307, outletId: 3, name: "Oreo Coffee Milkshake", price: 50, is_veg: true },
  { id: 308, outletId: 3, name: "Chiku Milkshake", price: 45, is_veg: true },
  { id: 309, outletId: 3, name: "Chiku Choco Milkshake", price: 50, is_veg: true },
  { id: 310, outletId: 3, name: "Choco Muffin Milkshake", price: 45, is_veg: true },
  { id: 311, outletId: 3, name: "Choco Munch Milkshake", price: 45, is_veg: true },
  { id: 312, outletId: 3, name: "Kit Kat Milkshake", price: 55, is_veg: true },
  { id: 313, outletId: 3, name: "Simple Mango Milkshake", price: 45, is_veg: true },
  { id: 314, outletId: 3, name: "Rapchik Mango Milkshake", price: 50, is_veg: true },
  { id: 315, outletId: 3, name: "Cold Coffee", price: 40, is_veg: true },
  { id: 316, outletId: 3, name: "Choco Coffee", price: 40, is_veg: true },
  { id: 317, outletId: 3, name: "Pineapple Milkshake", price: 40, is_veg: true },
  { id: 318, outletId: 3, name: "Blueberry Milkshake", price: 45, is_veg: true },
  { id: 319, outletId: 3, name: "Orange Fresh Juice", price: 45, is_veg: true },
  { id: 320, outletId: 3, name: "Mosambi Fresh Juice", price: 45, is_veg: true },
  { id: 321, outletId: 3, name: "Pineapple Fresh Juice", price: 40, is_veg: true },
  { id: 322, outletId: 3, name: "Apple Fresh Juice", price: 45, is_veg: true },
  { id: 323, outletId: 3, name: "Anar (Pomegranate) Juice", price: 60, is_veg: true },
  { id: 324, outletId: 3, name: "Watermelon Juice", price: 35, is_veg: true },
  { id: 325, outletId: 3, name: "Mix Fruit Juice", price: 40, is_veg: true },
  { id: 326, outletId: 3, name: "Ganga Jamuna Juice", price: 45, is_veg: true },
  { id: 327, outletId: 3, name: "Strawberry Juice", price: 45, is_veg: true },
  { id: 328, outletId: 3, name: "Pure Mango Juice", price: 50, is_veg: true },
  { id: 329, outletId: 3, name: "Simple Lassi", price: 30, is_veg: true },
  { id: 330, outletId: 3, name: "Fruit Lassi", price: 45, is_veg: true },
  { id: 331, outletId: 3, name: "Dryfruits Lassi", price: 50, is_veg: true },
  { id: 332, outletId: 3, name: "Chocolate Lassi", price: 45, is_veg: true },
  { id: 333, outletId: 3, name: "Rose Lassi", price: 45, is_veg: true },
  { id: 334, outletId: 3, name: "Rajwadi Lassi", price: 55, is_veg: true },
  { id: 335, outletId: 3, name: "Mango Lassi", price: 40, is_veg: true },
  { id: 336, outletId: 3, name: "Carrot Juice", price: 30, is_veg: true },
  { id: 337, outletId: 3, name: "Beet Root Juice", price: 35, is_veg: true },
  { id: 338, outletId: 3, name: "Mix Veg Juice", price: 35, is_veg: true },
  { id: 339, outletId: 3, name: "Veg n Fruit Juice", price: 30, is_veg: true },
  { id: 340, outletId: 3, name: "Tomato Juice", price: 30, is_veg: true },
  { id: 341, outletId: 3, name: "Lemon Juice", price: 15, is_veg: true },
  { id: 342, outletId: 3, name: "Lemon Soda", price: 20, is_veg: true },
  { id: 343, outletId: 3, name: "Pudina Soda", price: 20, is_veg: true },
  { id: 344, outletId: 3, name: "Vanilla Ice-Cream Sundae", price: 40, is_veg: true },
  { id: 345, outletId: 3, name: "Strawberry Ice-Cream Sundae", price: 50, is_veg: true },
  { id: 346, outletId: 3, name: "Mango Ice-Cream Sundae", price: 50, is_veg: true },
  { id: 347, outletId: 3, name: "Cherry-Berry Sundae", price: 50, is_veg: true },
  { id: 348, outletId: 3, name: "Butter Scotch Sundae", price: 55, is_veg: true },
  { id: 349, outletId: 3, name: "Chocolate Sundae", price: 55, is_veg: true },
  { id: 350, outletId: 3, name: "Plain Pista Sundae", price: 50, is_veg: true },
  { id: 351, outletId: 3, name: "American Nuts Sundae", price: 60, is_veg: true },
  { id: 352, outletId: 3, name: "Mahaveer Special Sundae", price: 80, is_veg: true },

  // OUTLET 4: NESCAFE HOSTEL
  { id: 401, outletId: 4, name: "Bread Butter", price: 35, is_veg: true },
  { id: 402, outletId: 4, name: "Maska Bun", price: 40, is_veg: true },
  { id: 403, outletId: 4, name: "Maska Bun With Jam", price: 45, is_veg: true },
  { id: 404, outletId: 4, name: "Cheese Chutney Sandwich", price: 45, is_veg: true },
  { id: 405, outletId: 4, name: "Fresh Vegetable Sandwich", price: 90, is_veg: true },
  { id: 406, outletId: 4, name: "Tandoori Sandwich", price: 90, is_veg: true },
  { id: 407, outletId: 4, name: "Makhani Sandwich", price: 90, is_veg: true },
  { id: 408, outletId: 4, name: "Cheese Grilled Sandwich", price: 90, is_veg: true },
  { id: 409, outletId: 4, name: "Bombay Sandwich", price: 100, is_veg: true },
  { id: 410, outletId: 4, name: "Peri Peri Spicy Sandwich", price: 110, is_veg: true },
  { id: 411, outletId: 4, name: "Paneer Tikka Sandwich", price: 110, is_veg: true },
  { id: 412, outletId: 4, name: "Jumbo Sandwich", price: 120, is_veg: true },
  { id: 413, outletId: 4, name: "Avocado Sandwich", price: 120, is_veg: true },
  { id: 414, outletId: 4, name: "Cheese Garlic Bread", price: 80, is_veg: true },
  { id: 415, outletId: 4, name: "Supreme Garlic Bread", price: 90, is_veg: true },
  { id: 416, outletId: 4, name: "Veggie Fingers", price: 70, is_veg: true },
  { id: 417, outletId: 4, name: "Chilli Garlic Potato Bites", price: 70, is_veg: true },
  { id: 418, outletId: 4, name: "Potato Cheese Shotz", price: 80, is_veg: true },
  { id: 419, outletId: 4, name: "Masala-ae-magic French Fries", price: 70, is_veg: true },
  { id: 420, outletId: 4, name: "Cheesy French Fries", price: 90, is_veg: true },
  { id: 421, outletId: 4, name: "Herb Chilli Burger", price: 60, is_veg: true },
  { id: 422, outletId: 4, name: "Superveg Burger", price: 70, is_veg: true },
  { id: 423, outletId: 4, name: "Spicy Paneer Burger", price: 90, is_veg: true },
  { id: 424, outletId: 4, name: "Mint Paneer Burger", price: 90, is_veg: true },
  { id: 425, outletId: 4, name: "Veg Wrap", price: 90, is_veg: true },
  { id: 426, outletId: 4, name: "Spicy Paneer Wrap", price: 120, is_veg: true },
  { id: 427, outletId: 4, name: "Mint Paneer Wrap", price: 120, is_veg: true },
  { id: 428, outletId: 4, name: "Spicy Butter Masala Omelette", price: 80, is_veg: false },
  { id: 429, outletId: 4, name: "Egg Sandwich", price: 90, is_veg: false },
  { id: 430, outletId: 4, name: "Chicken Finger", price: 80, is_veg: false },
  { id: 431, outletId: 4, name: "Chicken Nuggets", price: 90, is_veg: false },
  { id: 432, outletId: 4, name: "Chicken Tender", price: 90, is_veg: false },
  { id: 433, outletId: 4, name: "Chicken Burger", price: 90, is_veg: false },
  { id: 434, outletId: 4, name: "Hot & Spicy Chicken Burger", price: 120, is_veg: false },
  { id: 435, outletId: 4, name: "Chicken Wrap", price: 120, is_veg: false },
  { id: 436, outletId: 4, name: "Hot & Spicy Chicken Wrap", price: 140, is_veg: false },

  // OUTLET 5: TEA POST
  { id: 501, outletId: 5, name: "Poha (125gm)", price: 25, is_veg: true },
  { id: 502, outletId: 5, name: "Upma (200gm)", price: 35, is_veg: true },
  { id: 503, outletId: 5, name: "Thepla (3 Piece with pickle)", price: 30, is_veg: true },
  { id: 504, outletId: 5, name: "Khichu (250gm)", price: 53, is_veg: true },
  { id: 505, outletId: 5, name: "Maskabun (110gm)", price: 30, is_veg: true },
  { id: 506, outletId: 5, name: "Jam Bun (110gm)", price: 35, is_veg: true },
  { id: 507, outletId: 5, name: "Spicy Bun (110gm - Grilled)", price: 45, is_veg: true },
  { id: 508, outletId: 5, name: "Veggie Finger (5 Piece)", price: 74, is_veg: true },
  { id: 509, outletId: 5, name: "Cheese Garlic Bread (3 Piece)", price: 74, is_veg: true },
  { id: 510, outletId: 5, name: "French Fries (120gm)", price: 68, is_veg: true },
  { id: 511, outletId: 5, name: "French Fries Peri Peri Sprinkle", price: 79, is_veg: true },
  { id: 512, outletId: 5, name: "French Fries Deep Cheezy", price: 95, is_veg: true },
  { id: 513, outletId: 5, name: "Cheese Butter Sandwich", price: 53, is_veg: true },
  { id: 514, outletId: 5, name: "Cheese Chutney Sandwich", price: 63, is_veg: true },
  { id: 515, outletId: 5, name: "Mexican Cheese Sandwich", price: 84, is_veg: true },
  { id: 516, outletId: 5, name: "Tandoori Paneer Sandwich", price: 84, is_veg: true },
  { id: 517, outletId: 5, name: "Cheese Chilli Sandwich", price: 84, is_veg: true },
  { id: 518, outletId: 5, name: "Peri Peri Sandwich", price: 84, is_veg: true },
  { id: 519, outletId: 5, name: "Schezwan Paneer Sandwich", price: 84, is_veg: true },
  { id: 520, outletId: 5, name: "Bread Butter Sandwich", price: 32, is_veg: true },
  { id: 521, outletId: 5, name: "Jam Butter Sandwich", price: 32, is_veg: true },
  { id: 522, outletId: 5, name: "Masala Noodles (150gm)", price: 42, is_veg: true },
  { id: 523, outletId: 5, name: "Tadka Noodles (200gm)", price: 53, is_veg: true },
  { id: 524, outletId: 5, name: "Aloo Puff (100gm)", price: 25, is_veg: true },
  { id: 525, outletId: 5, name: "Chinese Puff (100gm)", price: 32, is_veg: true },
  { id: 526, outletId: 5, name: "Mexican Puff (125gm)", price: 40, is_veg: true },
  { id: 527, outletId: 5, name: "Cheese Puff (125gm)", price: 53, is_veg: true },
  { id: 528, outletId: 5, name: "Traditional Tea", price: 24, is_veg: true },
  { id: 529, outletId: 5, name: "Sugar Free Tea", price: 32, is_veg: true },
  { id: 530, outletId: 5, name: "Elaichi Tea", price: 32, is_veg: true },
  { id: 531, outletId: 5, name: "Ginger Tea", price: 32, is_veg: true },
  { id: 532, outletId: 5, name: "Indian Masala Tea", price: 32, is_veg: true },
  { id: 533, outletId: 5, name: "Black Tea", price: 32, is_veg: true },
  { id: 534, outletId: 5, name: "Kavo", price: 32, is_veg: true },
  { id: 535, outletId: 5, name: "Green Tea", price: 32, is_veg: true },
  { id: 536, outletId: 5, name: "Lemon Ice Tea", price: 63, is_veg: true },
  { id: 537, outletId: 5, name: "Blueberry Rose Mint Ice Tea", price: 63, is_veg: true },
  { id: 538, outletId: 5, name: "Peach Ice Tea", price: 63, is_veg: true },
  { id: 539, outletId: 5, name: "Hot Coffee", price: 30, is_veg: true },
  { id: 540, outletId: 5, name: "Hot Vanilla Coffee", price: 42, is_veg: true },
  { id: 541, outletId: 5, name: "Black Coffee", price: 32, is_veg: true },
  { id: 542, outletId: 5, name: "Cold Coffee", price: 74, is_veg: true },
  { id: 543, outletId: 5, name: "Cappuccino Cold Coffee", price: 79, is_veg: true },
  { id: 544, outletId: 5, name: "Hazelnut Cold Coffee", price: 79, is_veg: true },
  { id: 545, outletId: 5, name: "Hot Milk", price: 25, is_veg: true },
  { id: 546, outletId: 5, name: "Haldi Milk", price: 32, is_veg: true },
  { id: 547, outletId: 5, name: "Bournvita Hot", price: 42, is_veg: true },
  { id: 548, outletId: 5, name: "Bournvita Cold", price: 42, is_veg: true },
  { id: 549, outletId: 5, name: "Hot Chocolate", price: 84, is_veg: true },
  { id: 550, outletId: 5, name: "Chocolate Milkshake", price: 74, is_veg: true },
  { id: 551, outletId: 5, name: "Rose Milkshake", price: 74, is_veg: true },
  { id: 552, outletId: 5, name: "Strawberry Milkshake", price: 74, is_veg: true },
  { id: 553, outletId: 5, name: "Fruit Punch Cooler", price: 37, is_veg: true },
  { id: 554, outletId: 5, name: "Lemon Ginger Cooler", price: 37, is_veg: true },
  { id: 555, outletId: 5, name: "Mojito Cooler", price: 42, is_veg: true }
];

// ==========================================
// 3. SAFE HELPER FUNCTIONS FOR APP INTEGRATION
// ==========================================

export const getMenuByOutletId = (outletId) => {
  if (!outletId) return [];
  const safeMenuItems = Array.isArray(MENU_ITEMS) ? MENU_ITEMS : [];
  return safeMenuItems.filter((item) => String(item?.outletId) === String(outletId));
};

export const searchGlobalMenu = (query, outlets = OUTLETS) => {
  try {
    // Return empty results if query is invalid
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return { dishes: [], outlets: [] };
    }

    const q = query.toLowerCase().trim();
    const safeOutlets = Array.isArray(outlets) ? outlets : OUTLETS;
    const safeMenuItems = Array.isArray(MENU_ITEMS) ? MENU_ITEMS : [];

    // Safe outlets search
    const matchedOutlets = safeOutlets.filter((o) => {
      const nameMatch = o?.name?.toLowerCase().includes(q) ?? false;
      const cuisineMatch = o?.cuisines?.toLowerCase().includes(q) ?? false;
      return nameMatch || cuisineMatch;
    });

    // Safe dishes search with guaranteed fallback properties to prevent UI crashes
    const matchedDishes = safeMenuItems
      .filter((dish) => dish?.name?.toLowerCase().includes(q))
      .map((dish) => {
        const parentOutlet = safeOutlets.find(
          (o) => String(o?.id) === String(dish?.outletId)
        );

        // Fallback default outlet structure prevents `TypeError: Cannot read property of null` in UI components
        const defaultOutlet = {
          id: dish?.outletId || 0,
          name: 'Campus Eatery',
          rating: 4.0,
          cuisines: '',
          cost_for_two: 100,
          image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'
        };

        const resolvedOutlet = parentOutlet || defaultOutlet;

        return {
          ...dish,
          outlet: resolvedOutlet,
          outlet_name: resolvedOutlet.name
        };
      });

    return {
      dishes: matchedDishes,
      outlets: matchedOutlets
    };
  } catch (error) {
    console.error("Search failed safely without crashing the UI:", error);
    return { dishes: [], outlets: [] };
  }
};