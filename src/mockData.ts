import type { Order, PlatformMetrics, Review, Vendor } from "./types";

function items(
  categoryId: string,
  list: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    dietary: Vendor["categories"][number]["items"][number]["dietary"];
    spice?: 0 | 1 | 2 | 3;
    popular?: boolean;
  }>,
): Vendor["categories"][number] {
  return {
    id: categoryId,
    name: categoryId,
    items: list.map((it) => ({
      id: it.id,
      categoryId,
      name: it.name,
      description: it.description,
      price: it.price,
      image: it.image,
      dietary: it.dietary,
      spice: it.spice ?? 0,
      popular: it.popular ?? false,
      available: true,
    })),
  };
}

export const VENDORS: Vendor[] = [
  {
    id: "flame-crust",
    name: "Flame & Crust Pizza",
    tagline: "Stone-fired Naples-style pies, blistered to order.",
    cuisine: "Artisanal Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: "25-35",
    distanceKm: 1.2,
    deliveryFee: 1.9,
    freeDeliveryAbove: 25,
    isOpen: true,
    email: "hello@flamecrust.com",
    phone: "+1 555 0120",
    address: "112 Lombard Street, Downtown",
    status: "APPROVED",
    categories: [
      items("Mains", [
        { id: "fc1", name: "Margherita D.O.P.", description: "San Marzano tomato, fior di latte, basil, cold-pressed olive oil.", price: 12.5, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", dietary: ["Vegetarian"], popular: true },
        { id: "fc2", name: "Diavola", description: "Spicy salami, chili honey, mozzarella, tomato sauce.", price: 15.9, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80", dietary: ["Spicy"], spice: 2, popular: true },
        { id: "fc3", name: "Quattro Formaggi", description: "Gorgonzola, parmesan, mozzarella, smoked provola.", price: 16.5, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80", dietary: ["Vegetarian"] },
        { id: "fc4", name: "Truffle Mushroom", description: "Wild mushroom, truffle cream, thyme, aged pecorino.", price: 18.2, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80", dietary: ["Vegetarian", "Gluten-Free"] },
      ]),
      items("Sides", [
        { id: "fc5", name: "Garlic Knots", description: "Butter-brushed knots, parsley, parmesan, marinara dip.", price: 5.5, image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&q=80", dietary: ["Vegetarian"], popular: true },
        { id: "fc6", name: "Burrata & Crudité", description: "Creamy burrata over blistered cherry tomatoes.", price: 8.9, image: "https://images.unsplash.com/photo-1625937282968-6fbb73f42b93?w=400&q=80", dietary: ["Vegetarian", "Gluten-Free"] },
      ]),
      items("Drinks", [
        { id: "fc7", name: "Blood Orange Soda", description: "House-still blood orange, sparkling water, lime.", price: 3.5, image: "https://images.unsplash.com/photo-1521490876854-776578fff423?w=400&q=80", dietary: ["Vegan", "Kid-Friendly"] },
        { id: "fc8", name: "Craft Root Beer", description: "Small-batch, vanilla-spiced, ice cold.", price: 3.5, image: "https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=400&q=80", dietary: ["Vegan"] },
      ]),
    ],
  },
  {
    id: "tokyo-ramen",
    name: "Tokyo Ramen Bar",
    tagline: "Tonkotsu broth simmered 18 hours, slurp-worthy.",
    cuisine: "Asian Fusion",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    cover: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=1200&q=80",
    rating: 4.7,
    reviewCount: 512,
    deliveryTime: "30-40",
    distanceKm: 2.8,
    deliveryFee: 2.4,
    freeDeliveryAbove: 30,
    isOpen: true,
    email: "ramen@tokyobar.com",
    phone: "+1 555 0188",
    address: "48 Sakura Way, Riverside",
    status: "APPROVED",
    categories: [
      items("Ramen", [
        { id: "tr1", name: "Tonkotsu Classic", description: "18h pork broth, chashu, ajitama egg, scallion, nori.", price: 14.5, image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&q=80", dietary: [], popular: true },
        { id: "tr2", name: "Spicy Miso Fire", description: "Chili miso broth, ground pork, corn, butter, bean sprouts.", price: 15.2, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", dietary: ["Spicy"], spice: 2, popular: true },
        { id: "tr3", name: "Shoyu Chicken", description: "Clear soy broth, char-grilled chicken, bamboo.", price: 13.8, image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&q=80", dietary: [] },
        { id: "tr4", name: "Vegan Miso Vegetable", description: "Smoky miso broth, tofu, mushroom, bok choy.", price: 13.2, image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&q=80", dietary: ["Vegan"], popular: true },
      ]),
      items("Starters", [
        { id: "tr5", name: "Gyoza (6pc)", description: "Pork & chive dumplings, ponzu dipping sauce.", price: 6.9, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80", dietary: [] },
        { id: "tr6", name: "Karaage", description: "Crispy twice-fried chicken, yuzu mayo, shichimi.", price: 8.5, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&q=80", dietary: ["Spicy"], spice: 1 },
      ]),
      items("Drinks", [
        { id: "tr7", name: "Matcha Latte", description: "Ceremonial matcha, oat milk, vanilla.", price: 5.5, image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80", dietary: ["Vegan"] },
        { id: "tr8", name: "Yuzu Cooler", description: "Sparkling yuzu, cucumber, mint.", price: 4.5, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80", dietary: ["Vegan", "Kid-Friendly"] },
      ]),
    ],
  },
  {
    id: "green-table",
    name: "The Green Table",
    tagline: "Plant-forward bowls, grain-made delicious, farm-driven.",
    cuisine: "Healthy Bowls",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    cover: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80",
    rating: 4.9,
    reviewCount: 268,
    deliveryTime: "20-30",
    distanceKm: 0.9,
    deliveryFee: 1.2,
    freeDeliveryAbove: 20,
    isOpen: true,
    email: "bowls@greentable.co",
    phone: "+1 555 0144",
    address: "9 Meadow St, West End",
    status: "APPROVED",
    categories: [
      items("Bowls", [
        { id: "gt1", name: "Harvest Grain Bowl", description: "Farro, roasted squash, kale, tahini, pomegranate.", price: 11.9, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", dietary: ["Vegan", "Vegetarian"], popular: true },
        { id: "gt2", name: "Smashed Avocado Toast", description: "Sourdough, whipped avocado, chili flakes, seeds.", price: 8.2, image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&q=80", dietary: ["Vegetarian"], popular: true },
        { id: "gt3", name: "Superfood Salad", description: "Quinoa, chickpeas, spinach, almond, citrus vinaigrette.", price: 10.5, image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&q=80", dietary: ["Vegan", "Gluten-Free"] },
        { id: "gt4", name: "Berry Power Smoothie", description: "Mixed berries, banana, almond milk, chia, protein.", price: 7.8, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80", dietary: ["Vegan", "Gluten-Free"] },
      ]),
      items("Snacks", [
        { id: "gt5", name: "Chia Pudding Cup", description: "Coconut chia, mango, toasted granola.", price: 6.2, image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80", dietary: ["Vegan", "Vegetarian"] },
        { id: "gt6", name: "Veggie Hummus Plate", description: "Roasted veg, warm flatbread, whipped hummus.", price: 7.4, image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&q=80", dietary: ["Vegan"] },
      ]),
    ],
  },
  {
    id: "ember-burgers",
    name: "Ember Smash Burgers",
    tagline: "Double-smash patties, caramelized edges, brioche buns.",
    cuisine: "Burgers & Grill",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
    cover: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=1200&q=80",
    rating: 4.6,
    reviewCount: 640,
    deliveryTime: "20-25",
    distanceKm: 1.7,
    deliveryFee: 2.0,
    freeDeliveryAbove: 22,
    isOpen: true,
    email: "hi@embersmash.com",
    phone: "+1 555 0177",
    address: "77 Grill Lane, Midtown",
    status: "PENDING_REVIEW",
    categories: [
      items("Burgers", [
        { id: "eb1", name: "Double Ember Smash", description: "Two smashed patties, American cheese, ember sauce, pickles.", price: 13.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", dietary: [], popular: true },
        { id: "eb2", name: "Smokehouse Bacon", description: "Double patty, candied bacon, smoked cheddar, onion jam.", price: 15.9, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80", dietary: [] },
        { id: "eb3", name: "Spicy Crispy Chicken", description: "Buttermilk fried chicken, sriracha slaw, brioche.", price: 12.9, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", dietary: ["Spicy"], spice: 2, popular: true },
        { id: "eb4", name: "Plant Ember", description: "House veggie patty, vegan cheddar, grilled onion.", price: 12.4, image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&q=80", dietary: ["Vegetarian"] },
      ]),
      items("Sides", [
        { id: "eb5", name: "Truffle Fries", description: "Crispy fries, truffle oil, parmesan, parsley.", price: 5.5, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80", dietary: ["Vegetarian"], popular: true },
        { id: "eb6", name: "Loaded Nachos", description: "Seasoned beef, queso, jalapeño, crema.", price: 8.9, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80", dietary: ["Spicy"], spice: 1 },
      ]),
      items("Drinks", [
        { id: "eb7", name: "Craft Cola", description: "House-brewed cola, lime.", price: 3.2, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80", dietary: ["Vegan"] },
        { id: "eb8", name: "Shaken Lemonade", description: "Fresh-squeezed, mint, light sugar.", price: 3.8, image: "https://images.unsplash.com/photo-1523606772308-9654aab3f1c9?w=400&q=80", dietary: ["Vegan", "Kid-Friendly"] },
      ]),
    ],
  },
  {
    id: "cloud-desserts",
    name: "Cloud & Crumb Desserts",
    tagline: "Maison-style pastries, artisanal cakes & micro-batch coffee.",
    cuisine: "Desserts & Coffee",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80",
    cover: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80",
    rating: 4.9,
    reviewCount: 433,
    deliveryTime: "15-20",
    distanceKm: 0.6,
    deliveryFee: 1.5,
    freeDeliveryAbove: 18,
    isOpen: true,
    email: "sweet@cloudcrumb.com",
    phone: "+1 555 0166",
    address: "3 Crumb Court, Old Town",
    status: "APPROVED",
    categories: [
      items("Cakes", [
        { id: "cd1", name: "Salted Caramel Drip Cake", description: "Vanilla sponge, salted caramel, chocolate drip.", price: 9.5, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", dietary: ["Kid-Friendly"], popular: true },
        { id: "cd2", name: "Strawberry Chantilly", description: "Light chantilly, fresh strawberries, chiffon cake.", price: 8.5, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80", dietary: [], popular: true },
        { id: "cd3", name: "Valrhona Chocolate Tart", description: "Dark chocolate ganache, crisp pastry, sea salt.", price: 7.8, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80", dietary: ["Vegetarian"] },
      ]),
      items("Pastries", [
        { id: "cd4", name: "Butter Croissant", description: "72-layer laminated croissant, Lorraine butter.", price: 3.9, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80", dietary: ["Vegetarian"], popular: true },
        { id: "cd5", name: "Pistachio Cruffin", description: "Flaky cruffin, pistachio cream, crushed nuts.", price: 5.4, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80", dietary: ["Vegetarian"] },
      ]),
      items("Coffee", [
        { id: "cd6", name: "Flat White", description: "Double ristretto, velvety micro-foam milk.", price: 4.2, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80", dietary: ["Vegetarian"], popular: true },
        { id: "cd7", name: "Iced Spanish Latte", description: "Sweetened condensed milk, double espresso, ice.", price: 5.2, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80", dietary: ["Vegan"] },
      ]),
    ],
  },
  {
    id: "oasis-kitchen",
    name: "Oasis Middle-Eastern Kitchen",
    tagline: "Char-grilled kebabs, aromatic rice, fresh mezze.",
    cuisine: "Mediterranean",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    cover: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80",
    rating: 4.7,
    reviewCount: 389,
    deliveryTime: "30-45",
    distanceKm: 3.4,
    deliveryFee: 2.6,
    freeDeliveryAbove: 35,
    isOpen: false,
    email: "taste@oasiskitchen.com",
    phone: "+1 555 0133",
    address: "28 Olive Ave, East Side",
    status: "APPROVED",
    categories: [
      items("Grills", [
        { id: "ok1", name: "Mixed Grill Platter", description: "Lamb kofta, chicken shish, grilled veg, garlic sauce.", price: 19.9, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", dietary: ["Halal"], popular: true },
        { id: "ok2", name: "Chicken Shawarma Wrap", description: "Marinated chicken, pickles, garlic toum, flatbread.", price: 9.8, image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80", dietary: ["Halal", "Spicy"], spice: 1 },
        { id: "ok3", name: "Falafel Bowl", description: "Crispy falafel, tabbouleh, hummus, pomegranate.", price: 11.2, image: "https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?w=400&q=80", dietary: ["Vegan", "Vegetarian"], popular: true },
      ]),
      items("Mezze", [
        { id: "ok4", name: "Hummus & Pita", description: "Silky hummus, warm sesame pita, olive oil.", price: 6.5, image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&q=80", dietary: ["Vegetarian"] },
        { id: "ok5", name: "Baba Ganoush", description: "Smoky eggplant dip, pomegranate, fresh herbs.", price: 7.2, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80", dietary: ["Vegan", "Gluten-Free"] },
      ]),
      items("Drinks", [
        { id: "ok6", name: "Fresh Mint Lemonade", description: "Muddled mint, lemon, light agave.", price: 4.2, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80", dietary: ["Vegan", "Kid-Friendly"] },
        { id: "ok7", name: "Turkish Coffee", description: "Brewed in sand, cardamom, served with date.", price: 4.5, image: "https://images.unsplash.com/photo-1524350876685-274059332603?w=400&q=80", dietary: ["Vegan"] },
      ]),
    ],
  },
];

export const SEED_REVIEWS: Review[] = [
  { id: "r1", vendorId: "flame-crust", customerName: "Aisha K.", rating: 5, comment: "The Diavola is genuinely the best Neapolitan pie in town. Arrived blistering hot.", date: "2 days ago" },
  { id: "r2", vendorId: "flame-crust", customerName: "Marco T.", rating: 5, comment: "Garlic knots are criminally good. Order the truffle mushroom, trust me.", date: "5 days ago" },
  { id: "r3", vendorId: "tokyo-ramen", customerName: "Jordan P.", rating: 5, comment: "Tonkotsu broth is rich and deep. Portions are massive.", date: "1 day ago" },
  { id: "r4", vendorId: "tokyo-ramen", customerName: "Sam W.", rating: 4, comment: "Spicy miso had great heat. Gyoza slightly soft but tasty.", date: "3 days ago" },
  { id: "r5", vendorId: "green-table", customerName: "Ellie R.", rating: 5, comment: "Harvest bowl is fresh, filling, and beautiful. My weekly order.", date: "4 hours ago" },
  { id: "r6", vendorId: "cloud-desserts", customerName: "Priya S.", rating: 5, comment: "Salted caramel drip cake was a birthday home run. Stunning.", date: "1 day ago" },
  { id: "r7", vendorId: "ember-burgers", customerName: "Dana M.", rating: 4, comment: "Double smash has real crunch. Truffle fries are addictive.", date: "1 day ago" },
  { id: "r8", vendorId: "oasis-kitchen", customerName: "Omar H.", rating: 5, comment: "Mixed grill platter is a feast for four. Toum is perfect.", date: "6 days ago" },
];

const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;

export const SEED_ORDERS: Order[] = [
  {
    id: "CRV-10482", vendorId: "tokyo-ramen", vendorName: "Tokyo Ramen Bar", customerName: "Jordan P.", customerAddress: "221 Baker St, Apt 4B", items: [{ name: "Tonkotsu Classic", qty: 1, price: 14.5, options: "Large, Normal" }, { name: "Gyoza (6pc)", qty: 1, price: 6.9, options: "" }], subtotal: 21.4, deliveryFee: 2.4, tip: 3, discount: 0, total: 26.8, payment: "CARD", status: "PENDING", placedAt: now - 4 * MIN, etaMinutes: 35, note: "Extra napkins please.",
  },
  {
    id: "CRV-10481", vendorId: "flame-crust", vendorName: "Flame & Crust Pizza", customerName: "Aisha K.", customerAddress: "88 Elm Road", items: [{ name: "Diavola", qty: 1, price: 15.9, options: "Extra Spicy, Thick Crust" }, { name: "Blood Orange Soda", qty: 2, price: 3.5, options: "" }], subtotal: 22.9, deliveryFee: 1.9, tip: 4, discount: 0, total: 28.8, payment: "MOBILE", status: "CONFIRMED", placedAt: now - 9 * MIN, etaMinutes: 28, note: "Cut into 8 slices.",
  },
  {
    id: "CRV-10480", vendorId: "green-table", vendorName: "The Green Table", customerName: "Ellie R.", customerAddress: "5 Garden Square", items: [{ name: "Smashed Avocado Toast", qty: 2, price: 8.2, options: "Gluten free bread" }, { name: "Berry Power Smoothie", qty: 1, price: 7.8, options: "" }], subtotal: 24.2, deliveryFee: 1.2, tip: 2.5, discount: 4.84, total: 23.06, payment: "CARD", status: "PREPARING", placedAt: now - 14 * MIN, etaMinutes: 22, note: "Light on chili flakes.",
  },
  {
    id: "CRV-10479", vendorId: "cloud-desserts", vendorName: "Cloud & Crumb Desserts", customerName: "Priya S.", customerAddress: "12 Berry Lane", items: [{ name: "Flat White", qty: 2, price: 4.2, options: "Oat milk" }, { name: "Butter Croissant", qty: 2, price: 3.9, options: "" }], subtotal: 16.2, deliveryFee: 1.5, tip: 2, discount: 0, total: 19.7, payment: "CASH", status: "READY", placedAt: now - 24 * MIN, etaMinutes: 15, note: "Leave at door.",
  },
  {
    id: "CRV-10478", vendorId: "ember-burgers", vendorName: "Ember Smash Burgers", customerName: "Dana M.", customerAddress: "301 King Ave", items: [{ name: "Double Ember Smash", qty: 2, price: 13.5, options: "Well done, No pickles" }], subtotal: 27.0, deliveryFee: 2.0, tip: 3, discount: 0, total: 32.0, payment: "MOBILE", status: "OUT_FOR_DELIVERY", placedAt: now - 38 * MIN, etaMinutes: 8, note: "",
  },
  {
    id: "CRV-10477", vendorId: "oasis-kitchen", vendorName: "Oasis Middle-Eastern Kitchen", customerName: "Omar H.", customerAddress: "76 Olive Ave", items: [{ name: "Mixed Grill Platter", qty: 1, price: 19.9, options: "" }, { name: "Turkish Coffee", qty: 2, price: 4.5, options: "" }], subtotal: 28.9, deliveryFee: 2.6, tip: 5, discount: 0, total: 36.5, payment: "CARD", status: "DELIVERED", placedAt: now - 2 * HOUR, etaMinutes: 0, note: "",
  },
  {
    id: "CRV-10476", vendorId: "tokyo-ramen", vendorName: "Tokyo Ramen Bar", customerName: "Sam W.", customerAddress: "44 River Dr", items: [{ name: "Spicy Miso Fire", qty: 1, price: 15.2, options: "Extra spicy" }], subtotal: 15.2, deliveryFee: 2.4, tip: 2, discount: 0, total: 19.6, payment: "CASH", status: "DELIVERED", placedAt: now - 26 * HOUR, etaMinutes: 0, note: "Ringing bell.",
  },
  {
    id: "CRV-10475", vendorId: "green-table", vendorName: "The Green Table", customerName: "Noor A.", customerAddress: "2 Orchard Rd", items: [{ name: "Superfood Salad", qty: 1, price: 10.5, options: "" }], subtotal: 10.5, deliveryFee: 1.2, tip: 1.5, discount: 0, total: 13.2, payment: "CARD", status: "REJECTED", placedAt: now - 3 * HOUR, etaMinutes: 0, note: "Vendor unavailable at rush.",
  },
];

export const PROMO_CODES: Record<string, number> = {
  SAVE20: 0.2,
  FREESHIP: 0,
  WELCOME10: 0.1,
  VIP15: 0.15,
};

export const METRICS: PlatformMetrics = {
  gmv: 128450,
  commissionRate: 0.12,
  activeVendors: 24,
  totalOrders: 9320,
};

export const CITIES = ["Sunnyvale", "Downtown", "Riverside", "Old Town", "West End", "Midtown"];

export const CATEGORY_TAGS = ["All", "Pizza", "Asian", "Healthy", "Burgers", "Desserts", "Mediterranean", "Coffee"];