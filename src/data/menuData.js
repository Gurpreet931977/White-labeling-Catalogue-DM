export const CATEGORIES = [
  { id: "all", name: "All Items", icon: "Flame" },
  { id: "italian-specials", name: "Artisan Italian", icon: "UtensilsCrossed" },
  { id: "woodfired-pizza", name: "Wood-Fired Pizzas", icon: "Flame" },
  { id: "pastas-mains", name: "Pastas & Bowls", icon: "Soup" },
  { id: "paninis-burgers", name: "Paninis & Burgers", icon: "Sandwich" },
  { id: "appetizers-sides", name: "Starters & Sides", icon: "Sparkles" },
  { id: "coffee-brews", name: "Specialty Coffee", icon: "Coffee" },
  { id: "shakes-coolers", name: "Shakes & Coolers", icon: "GlassWater" },
  { id: "desserts", name: "Decadent Desserts", icon: "Moon" },
];

export const MENU_ITEMS = [
  // ==========================================
  // 1. WOOD-FIRED PIZZAS & ITALIAN SPECIALS
  // ==========================================
  {
    id: "thc-01",
    name: "Wood-Fired Margherita Basilico",
    category: "woodfired-pizza",
    isItalian: true,
    price: 349,
    rating: 5.0,
    reviews: 640,
    prepTime: "12 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Neapolitan slow-fermented crust, San Marzano tomato concasse, fresh buffalo mozzarella, aromatic sweet basil & extra virgin olive oil drizzle.",
    customizable: true,
    spiceOptions: ["Classic Italian", "Spicy Herb Zing (Chili Flakes)"],
    addons: [
      { id: "extra-bocconcini", name: "Fresh Buffalo Mozzarella Bocconcini (+₹55)", price: 55 },
      { id: "truffle-oil", name: "White Truffle Oil Drizzle (+₹45)", price: 45 },
      { id: "burrata-topper", name: "Whole Creamy Burrata Ball (+₹110)", price: 110 }
    ],
    searchKeywords: ["pizza", "margherita", "woodfired", "wood-fired", "mozzarella", "italian", "cheese pizza", "basil"]
  },
  {
    id: "thc-02",
    name: "Quattro Formaggi & Truffle Mushroom Pizza",
    category: "woodfired-pizza",
    isItalian: true,
    price: 429,
    rating: 4.9,
    reviews: 480,
    prepTime: "14 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description: "Four cheese blend of aged Parmesan, Gorgonzola, Fontina & melted Mozzarella, sautéed cremini mushrooms and a fragrant white truffle glaze.",
    customizable: true,
    spiceOptions: ["Classic", "Mild Garlic", "Crushed Black Pepper"],
    addons: [
      { id: "caramelized-onions", name: "Caramelized Balsamic Onions (+₹35)", price: 35 },
      { id: "extra-gorgonzola", name: "Extra Aged Blue Cheese (+₹60)", price: 60 },
      { id: "garlic-dip", name: "Roasted Garlic Aioli Dip (+₹35)", price: 35 }
    ],
    searchKeywords: ["pizza", "quattro formaggi", "four cheese", "mushroom", "truffle", "italian", "white pizza"]
  },
  {
    id: "thc-03",
    name: "Pesto Genovese & Burrata Sourdough Pizza",
    category: "woodfired-pizza",
    isItalian: true,
    price: 449,
    rating: 4.9,
    reviews: 390,
    prepTime: "14 mins",
    isVeg: true,
    isBestseller: false,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description: "Hand-stretched crust spread with fragrant basil pesto, sun-dried cherry tomatoes, toasted pine nuts, and a whole molten Burrata cheese ball.",
    customizable: true,
    spiceOptions: ["Classic Herb", "Zesty Pepper"],
    addons: [
      { id: "olives-capers", name: "Kalamata Olives & Capers (+₹40)", price: 40 },
      { id: "balsamic-glaze", name: "Modena Aged Balsamic Glaze (+₹25)", price: 25 }
    ],
    searchKeywords: ["pizza", "pesto", "burrata", "sourdough", "italian", "artisan pizza"]
  },
  {
    id: "thc-04",
    name: "Rustic Chicken Pepperoni & Hot Honey Pizza",
    category: "woodfired-pizza",
    isItalian: true,
    price: 439,
    rating: 4.9,
    reviews: 510,
    prepTime: "14 mins",
    isVeg: false,
    isBestseller: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    description: "Crispy chicken pepperoni slices, smoked pulled chicken, San Marzano tomato sauce, mozzarella, and a drizzle of spicy chili-infused wildflower honey.",
    customizable: true,
    spiceOptions: ["Medium Zing", "Hot Honey Fire", "Extra Fiery Jalapeño"],
    addons: [
      { id: "double-pepperoni", name: "Double Chicken Pepperoni (+₹70)", price: 70 },
      { id: "extra-cheese", name: "Double Mozzarella Blanket (+₹50)", price: 50 }
    ],
    searchKeywords: ["pizza", "pepperoni", "chicken pizza", "hot honey", "italian", "non veg pizza"]
  },

  // ==========================================
  // 2. ARTISAN PASTAS & BOWLS
  // ==========================================
  {
    id: "thc-05",
    name: "Smoked Alfredo White Sauce Penne",
    category: "pastas-mains",
    isItalian: true,
    price: 269,
    rating: 4.9,
    reviews: 730,
    prepTime: "12 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
    description: "Rich and creamy garlic Parmesan white sauce penne tossed with sweet corn, wild sautéed mushrooms, and herbed European butter.",
    customizable: true,
    spiceOptions: ["Mild Creamy", "Spicy Garlic Herb", "Extra Black Pepper & Chili"],
    addons: [
      { id: "extra-cheese", name: "Mozzarella & Parmesan Melt (+₹45)", price: 45 },
      { id: "garlic-bread", name: "2 Crispy Garlic Bread Slices (+₹49)", price: 49 },
      { id: "extra-chicken", name: "Add Grilled Herb Chicken (+₹60)", price: 60 }
    ],
    searchKeywords: ["white sauce", "white sause", "pasta", "alfredo", "penne", "cheese", "creamy", "italian", "macaroni"]
  },
  {
    id: "thc-06",
    name: "Classico Pomodoro Arrabbiata Penne",
    category: "pastas-mains",
    isItalian: true,
    price: 249,
    rating: 4.8,
    reviews: 490,
    prepTime: "12 mins",
    isVeg: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&w=800&q=80",
    description: "Al dente penne cooked in slow-simmered tangy tomato concasse, garlic, crushed red chili flakes, fresh basil, and Kalamata black olives.",
    customizable: true,
    spiceOptions: ["Medium Zing", "Traditional Spicy Arrabbiata", "Fiery Extra Hot"],
    addons: [
      { id: "extra-cheese", name: "Melted Mozzarella Blanket (+₹40)", price: 40 },
      { id: "garlic-bread", name: "2 Crispy Garlic Bread Slices (+₹49)", price: 49 },
      { id: "parmesan-shavings", name: "Aged Parmesan Shavings (+₹35)", price: 35 }
    ],
    searchKeywords: ["red sauce", "red sause", "pasta", "arrabbiata", "spicy pasta", "tomato pasta", "penne", "italian"]
  },
  {
    id: "thc-07",
    name: "Creamy Basil Pesto Tagliatelle",
    category: "pastas-mains",
    isItalian: true,
    price: 289,
    rating: 4.9,
    reviews: 340,
    prepTime: "12 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    description: "Silky flat ribbon pasta ribbons tossed in homemade Genovese basil & pine nut pesto, light cream, cherry tomatoes, and toasted pine nuts.",
    customizable: true,
    spiceOptions: ["Gentle Herb", "Garlic Punch", "Crushed Red Pepper"],
    addons: [
      { id: "burrata-topper", name: "Half Fresh Burrata Ball (+₹65)", price: 65 },
      { id: "grilled-chicken", name: "Add Grilled Chicken Strips (+₹60)", price: 60 }
    ],
    searchKeywords: ["pesto", "pasta", "tagliatelle", "green pasta", "italian", "basil pesto", "spaghetti"]
  },
  {
    id: "thc-08",
    name: "Slow-Simmered Wild Mushroom & Truffle Risotto",
    category: "pastas-mains",
    isItalian: true,
    price: 349,
    rating: 4.9,
    reviews: 290,
    prepTime: "15 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    description: "Arborio rice slow-cooked with vegetable porcini broth, butter, roasted cremini & shiitake mushrooms, aged Grana Padano, and white truffle aroma.",
    customizable: true,
    spiceOptions: ["Classic Creamy", "Cracked Black Pepper"],
    addons: [
      { id: "extra-parmesan", name: "Extra Grana Padano Shavings (+₹40)", price: 40 },
      { id: "garlic-crostini", name: "2 Toasted Garlic Crostini (+₹40)", price: 40 }
    ],
    searchKeywords: ["risotto", "rice", "mushroom", "truffle", "italian", "creamy rice", "arborio"]
  },

  // ==========================================
  // 3. BISTRO STARTERS & CRISPY SIDES
  // ==========================================
  {
    id: "thc-09",
    name: "Bruschetta al Pomodoro & Aged Balsamic",
    category: "appetizers-sides",
    isItalian: true,
    price: 199,
    rating: 4.8,
    reviews: 420,
    prepTime: "8 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80",
    description: "Toasted artisan sourdough crostini rubbed with fresh garlic, topped with heirloom diced tomatoes, basil, cold-pressed olive oil, and balsamic reduction.",
    customizable: false,
    addons: [
      { id: "feta-crumbles", name: "Crumbled Greek Feta (+₹35)", price: 35 },
      { id: "bocconcini", name: "Mini Mozzarella Pearls (+₹45)", price: 45 }
    ],
    searchKeywords: ["bruschetta", "bread", "tomato", "starter", "italian", "crostini", "appetizer"]
  },
  {
    id: "thc-10",
    name: "Cheesy Garlic Pull-Apart Focaccia",
    category: "appetizers-sides",
    isItalian: true,
    price: 219,
    rating: 4.9,
    reviews: 580,
    prepTime: "10 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    description: "Freshly baked olive oil focaccia loaded with roasted garlic herb butter, bubbling melted mozzarella, and fresh rosemary sprigs.",
    customizable: true,
    spiceOptions: ["Mild Garlic", "Spicy Herb Butter"],
    addons: [
      { id: "marinara-dip", name: "Warm Pomodoro Marinara Dip (+₹35)", price: 35 },
      { id: "jalapeno-toss", name: "Pickled Jalapeños Inside (+₹25)", price: 25 }
    ],
    searchKeywords: ["garlic bread", "focaccia", "cheesy bread", "mozzarella", "starter", "bread"]
  },
  {
    id: "thc-11",
    name: "Truffle & Shaved Parmesan Hand-Cut Fries",
    category: "appetizers-sides",
    price: 189,
    rating: 5.0,
    reviews: 620,
    prepTime: "8 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    description: "Crispy skin-on golden potato fries tossed in aromatic white truffle oil, freshly shaved aged Parmesan, sea salt, and garlic aioli dip.",
    customizable: true,
    spiceOptions: ["Sea Salt & Herbs", "Black Pepper & Truffle", "Spicy Truffle Zing"],
    addons: [
      { id: "extra-aioli", name: "Roasted Garlic Aioli Dip (+₹30)", price: 30 },
      { id: "cheese-sauce", name: "Warm Liquid Cheddar Dip (+₹40)", price: 40 }
    ],
    searchKeywords: ["fries", "truffle fries", "parmesan", "french fries", "chips", "potato", "sides"]
  },
  {
    id: "thc-12",
    name: "Crispy Jalapeño & Cheddar Poppers (6 Pcs)",
    category: "appetizers-sides",
    price: 179,
    rating: 4.8,
    reviews: 360,
    prepTime: "8 mins",
    isVeg: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    description: "Golden panko-crusted cheese croquettes bursting with molten cheddar, cream cheese, and spicy pickled jalapeño chunks served with herb ranch.",
    customizable: false,
    addons: [
      { id: "extra-ranch", name: "Herb Ranch Dip (+₹25)", price: 25 }
    ],
    searchKeywords: ["poppers", "jalapeno", "cheese poppers", "starter", "bites", "appetizer"]
  },
  {
    id: "thc-13",
    name: "Peri-Peri Loaded Cheese Fries",
    category: "appetizers-sides",
    price: 199,
    rating: 4.8,
    reviews: 490,
    prepTime: "8 mins",
    isVeg: true,
    isSpicy: true,
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80",
    description: "Hot crisp fries dusted with tangy peri-peri seasoning, drenched in bubbling cheddar cheese sauce, jalapeño relish, and chipotle drizzle.",
    customizable: true,
    spiceOptions: ["Medium Peri-Peri", "Extra Fiery Dust"],
    addons: [
      { id: "grilled-chicken", name: "Add Shredded Smoked Chicken (+₹50)", price: 50 },
      { id: "extra-cheese", name: "Extra Cheddar Melt (+₹35)", price: 35 }
    ],
    searchKeywords: ["peri peri", "loaded fries", "cheese fries", "fries", "spicy fries", "chips"]
  },

  // ==========================================
  // 4. PANINIS, BURGERS & GOURMET BITES
  // ==========================================
  {
    id: "thc-14",
    name: "Sundried Tomato, Pesto & Bocconcini Panini",
    category: "paninis-burgers",
    isItalian: true,
    price: 229,
    rating: 4.9,
    reviews: 410,
    prepTime: "10 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    description: "Grilled crusty ciabatta pressed with basil pesto, fresh bocconcini mozzarella, sweet sun-dried tomatoes, and baby arugula greens.",
    customizable: true,
    spiceOptions: ["Classic Herb", "Zesty Pepper"],
    addons: [
      { id: "fries-side", name: "Add Small Fries (+₹40)", price: 40 },
      { id: "extra-cheese", name: "Extra Mozzarella Slice (+₹30)", price: 30 }
    ],
    searchKeywords: ["panini", "sandwich", "ciabatta", "pesto panini", "mozzarella", "toastie"]
  },
  {
    id: "thc-15",
    name: "Smoked Herb Chicken & Caramelized Onion Panini",
    category: "paninis-burgers",
    price: 259,
    rating: 4.9,
    reviews: 520,
    prepTime: "10 mins",
    isVeg: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    description: "Rosemary roasted pulled chicken breast, slow-caramelized onions, smoked Gouda cheese, and honey mustard spread on grilled Italian sourdough.",
    customizable: true,
    spiceOptions: ["Mild & Savory", "Chipotle Zing"],
    addons: [
      { id: "bacon-strips", name: "Crispy Smoked Bacon (+₹60)", price: 60 },
      { id: "fries-side", name: "Add Small Fries (+₹40)", price: 40 }
    ],
    searchKeywords: ["panini", "chicken sandwich", "sandwich", "toastie", "chicken panini"]
  },
  {
    id: "thc-16",
    name: "Classic Brioche Smashed Cheeseburger",
    category: "paninis-burgers",
    price: 249,
    rating: 4.8,
    reviews: 690,
    prepTime: "12 mins",
    isVeg: false,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "Double smashed tender patty, double melted sharp Wisconsin cheddar, house secret burger relish, dill pickles, and crispy lettuce in a toasted butter brioche bun.",
    customizable: true,
    spiceOptions: ["Classic Mild", "Spicy Jalapeño Zing"],
    addons: [
      { id: "extra-patty", name: "Add Extra Smashed Patty (+₹75)", price: 75 },
      { id: "peri-fries", name: "Upgrade to Peri-Peri Fries (+₹45)", price: 45 },
      { id: "fried-egg", name: "Sunny Side Egg (+₹25)", price: 25 }
    ],
    searchKeywords: ["burger", "cheeseburger", "smash burger", "brioche", "burger and fries"]
  },
  {
    id: "thc-17",
    name: "Truffle Mushroom & Swiss Smashed Burger",
    category: "paninis-burgers",
    price: 279,
    rating: 4.9,
    reviews: 440,
    prepTime: "12 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    description: "Crispy grilled herb-mushroom patty, melted Swiss Emmental cheese, balsamic caramelized onions, and white truffle garlic aioli on artisan brioche.",
    customizable: true,
    spiceOptions: ["Mild Herb", "Pepper Punch"],
    addons: [
      { id: "extra-cheese", name: "Extra Swiss Cheese Melt (+₹35)", price: 35 },
      { id: "fries-side", name: "Add Salted Fries (+₹40)", price: 40 }
    ],
    searchKeywords: ["burger", "veg burger", "mushroom burger", "truffle burger", "swiss burger"]
  },
  {
    id: "thc-18",
    name: "Gourmet Smashed Avocado & Feta Sourdough",
    category: "paninis-burgers",
    price: 239,
    rating: 4.8,
    reviews: 380,
    prepTime: "8 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    description: "Creamy ripe Hass avocado lightly smashed with lime and sea salt, topped with crumbled feta, roasted pumpkin seeds, and chili flakes on thick grilled sourdough.",
    customizable: true,
    spiceOptions: ["Gentle Citrus & Herb", "Chili Flakes Zing"],
    addons: [
      { id: "poached-egg", name: "Poached Runny Egg (+₹30)", price: 30 },
      { id: "cherry-tomatoes", name: "Slow Roasted Cherry Tomatoes (+₹25)", price: 25 }
    ],
    searchKeywords: ["avocado toast", "sourdough", "avocado", "healthy", "breakfast", "toast"]
  },

  // ==========================================
  // 5. SPECIALTY COFFEE & BREWS
  // ==========================================
  {
    id: "thc-19",
    name: "Signature Velvet Flat White",
    category: "coffee-brews",
    price: 159,
    rating: 5.0,
    reviews: 820,
    prepTime: "4 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description: "Double ristretto shot of 100% Arabica beans expertly poured with silky microfoam milk and custom latte art.",
    customizable: true,
    spiceOptions: ["Whole Milk", "Oat Milk (+₹35)", "Almond Milk (+₹40)"],
    addons: [
      { id: "extra-shot", name: "Extra Espresso Shot (+₹35)", price: 35 },
      { id: "vanilla-syrup", name: "Madagascar Vanilla Syrup (+₹25)", price: 25 }
    ],
    searchKeywords: ["coffee", "flat white", "cappuccino", "latte", "espresso", "hot coffee", "brew"]
  },
  {
    id: "thc-20",
    name: "Iced Spanish Latte with Sweet Cream",
    category: "coffee-brews",
    price: 179,
    rating: 4.9,
    reviews: 640,
    prepTime: "4 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    description: "Double shot of fresh dark espresso shaken over sweet condensed milk, chilled whole milk, and ice with a dust of Ceylon cinnamon.",
    customizable: true,
    spiceOptions: ["Standard Sweetness", "Less Sweet"],
    addons: [
      { id: "extra-shot", name: "Extra Dark Shot (+₹35)", price: 35 }
    ],
    searchKeywords: ["spanish latte", "iced coffee", "latte", "cold coffee", "coffee"]
  },
  {
    id: "thc-21",
    name: "Classic Iced Caramel Macchiato",
    category: "coffee-brews",
    price: 189,
    rating: 4.9,
    reviews: 580,
    prepTime: "5 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    description: "Vanilla-infused cold frothed milk marked with a double shot of dark roasted espresso float and finished with a rich buttery salted caramel lattice.",
    customizable: true,
    spiceOptions: ["Regular Ice", "Light Ice"],
    addons: [
      { id: "caramel-drizzle", name: "Double Caramel Drizzle (+₹25)", price: 25 },
      { id: "whipped-cream", name: "Dollop of Whipped Cream (+₹30)", price: 30 }
    ],
    searchKeywords: ["macchiato", "caramel macchiato", "iced coffee", "caramel coffee", "frappe"]
  },
  {
    id: "thc-22",
    name: "Single-Origin 18-Hour Cold Brew",
    category: "coffee-brews",
    price: 169,
    rating: 4.8,
    reviews: 390,
    prepTime: "2 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    description: "Slow-steeped for 18 hours in cold filtered water. Ultra smooth, low acidity with natural hints of dark chocolate, served over crystal ice with orange twist.",
    customizable: false,
    addons: [
      { id: "tonic-water", name: "Upgrade to Cold Brew Tonic (+₹30)", price: 30 }
    ],
    searchKeywords: ["cold brew", "black coffee", "iced coffee", "brew", "specialty coffee"]
  },
  {
    id: "thc-23",
    name: "Thick Italian Dark Hot Chocolate",
    category: "coffee-brews",
    price: 179,
    rating: 5.0,
    reviews: 710,
    prepTime: "5 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    description: "Traditional thick, spoonable Italian hot chocolate made from 70% dark Belgian cocoa and steamed full cream, topped with mini marshmallows.",
    customizable: true,
    spiceOptions: ["Classic Dark", "With Pinch of Cinnamon & Sea Salt"],
    addons: [
      { id: "marshmallows", name: "Extra Marshmallows (+₹25)", price: 25 },
      { id: "whipped-cream", name: "Fresh Whipped Cream (+₹30)", price: 30 }
    ],
    searchKeywords: ["hot chocolate", "chocolate", "cocoa", "italian hot chocolate", "drink"]
  },
  {
    id: "thc-24",
    name: "Royal Cardamom & Ginger Chai Pot (Serves 2)",
    category: "coffee-brews",
    price: 129,
    rating: 4.9,
    reviews: 840,
    prepTime: "6 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    description: "Slow-brewed strong Assam tea infused with freshly crushed green cardamom pods, fresh ginger root, and lemongrass served in an artisanal teapot.",
    customizable: true,
    spiceOptions: ["Regular Sugar", "Jaggery (Gud)", "Less Sugar", "Sugar Free"],
    addons: [
      { id: "biscuits", name: "2 Butter Shortbread Cookies (+₹25)", price: 25 }
    ],
    searchKeywords: ["chai", "tea", "masala chai", "adrak chai", "cardamom", "hot tea"]
  },

  // ==========================================
  // 6. ARTISANAL SHAKES & COOLERS
  // ==========================================
  {
    id: "thc-25",
    name: "Nutella & Roasted Hazelnut Thickshake",
    category: "shakes-coolers",
    price: 199,
    rating: 4.9,
    reviews: 670,
    prepTime: "5 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    description: "Creamy vanilla ice cream blended with generous spoonfuls of authentic Nutella, roasted crushed hazelnuts, and chocolate drizzle.",
    customizable: true,
    spiceOptions: ["Standard"],
    addons: [
      { id: "whipped-cream", name: "Whipped Cream Mountain (+₹30)", price: 30 },
      { id: "brownie-crumble", name: "Brownie Crumbles on Top (+₹35)", price: 35 }
    ],
    searchKeywords: ["shake", "nutella", "hazelnut", "thickshake", "chocolate shake", "milkshake"]
  },
  {
    id: "thc-26",
    name: "Biscoff Lotus Cookie Butter Frappe",
    category: "shakes-coolers",
    price: 219,
    rating: 5.0,
    reviews: 530,
    prepTime: "5 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80",
    description: "Creamy blended iced frappe with caramelized Lotus Biscoff spread, milk, shot of light espresso, and crunchy Biscoff biscuit crumb.",
    customizable: false,
    addons: [
      { id: "extra-biscoff", name: "Extra Biscoff Sauce (+₹30)", price: 30 }
    ],
    searchKeywords: ["biscoff", "lotus", "frappe", "cookie butter", "shake", "milkshake"]
  },
  {
    id: "thc-27",
    name: "Sparkling Sicilian Lemon & Mint Fizz",
    category: "shakes-coolers",
    price: 139,
    rating: 4.8,
    reviews: 410,
    prepTime: "4 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    description: "Zesty fresh Sicilian lemon juice, bruised sweet mint leaves, simple cane syrup, and sparkling soda served over crushed ice.",
    customizable: false,
    addons: [],
    searchKeywords: ["mojito", "lemonade", "cooler", "fizz", "mint cooler", "sparkling drink"]
  },
  {
    id: "thc-28",
    name: "Wild Peach & Berry Hand-Brewed Iced Tea",
    category: "shakes-coolers",
    price: 149,
    rating: 4.8,
    reviews: 350,
    prepTime: "3 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    description: "Slow-steeped black tea infused with natural white peach nectar, crushed raspberries, mint, and a hint of lime.",
    customizable: false,
    addons: [],
    searchKeywords: ["iced tea", "peach tea", "berry tea", "cooler", "cold drink", "tea"]
  },

  // ==========================================
  // 7. DECADENT DESSERTS
  // ==========================================
  {
    id: "thc-29",
    name: "Tiramisu Classico della Casa",
    category: "desserts",
    isItalian: true,
    price: 229,
    rating: 5.0,
    reviews: 790,
    prepTime: "4 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    description: "Traditional Italian recipe with coffee-soaked Savoiardi ladyfingers, velvety mascarpone cheese custard, and a generous dusting of rich Valrhona cocoa.",
    customizable: false,
    addons: [
      { id: "extra-cocoa", name: "Extra Espresso Shot Beside (+₹35)", price: 35 }
    ],
    searchKeywords: ["tiramisu", "dessert", "italian dessert", "cake", "sweet", "coffee dessert"]
  },
  {
    id: "thc-30",
    name: "Sizzling Belgian Chocolate Brownie",
    category: "desserts",
    price: 189,
    rating: 4.9,
    reviews: 620,
    prepTime: "6 mins",
    isVeg: true,
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description: "Warm walnut fudge brownie placed on a sizzling hot skillet, topped with Madagascar vanilla bean gelato and bubbling hot dark chocolate fudge.",
    customizable: true,
    spiceOptions: ["Standard"],
    addons: [
      { id: "extra-scoop", name: "Extra Gelato Scoop (+₹40)", price: 40 },
      { id: "roasted-nuts", name: "Crushed Almonds & Hazelnuts (+₹30)", price: 30 }
    ],
    searchKeywords: ["brownie", "sizzling brownie", "chocolate", "dessert", "ice cream"]
  },
  {
    id: "thc-31",
    name: "New York Baked Blueberry Cheesecake",
    category: "desserts",
    price: 219,
    rating: 4.9,
    reviews: 470,
    prepTime: "4 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    description: "Dense and creamy baked New York cheesecake on a buttery graham cracker crust, topped with tart wild blueberry compote.",
    customizable: false,
    addons: [],
    searchKeywords: ["cheesecake", "blueberry cheesecake", "cake", "dessert", "sweet"]
  },
  {
    id: "thc-32",
    name: "Crispy Cinnamon Churros with Dulce De Leche",
    category: "desserts",
    price: 179,
    rating: 4.8,
    reviews: 360,
    prepTime: "7 mins",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80",
    description: "Golden fried cinnamon sugar dusted churro loops served with molten warm chocolate ganache and homemade dulce de leche caramel dip.",
    customizable: false,
    addons: [],
    searchKeywords: ["churros", "cinnamon", "caramel", "chocolate", "dessert", "sweet"]
  }
];

export const CULINARY_SYNONYMS = {
  "white sauce": ["alfredo", "white sauce", "white sause", "creamy", "cheese", "pasta", "penne"],
  "white sause": ["alfredo", "white sauce", "white sause", "creamy", "cheese", "pasta", "penne"],
  "red sauce": ["arrabbiata", "red sauce", "red sause", "tomato", "spicy pasta", "pasta", "penne", "pomodoro"],
  "red sause": ["arrabbiata", "red sauce", "red sause", "tomato", "spicy pasta", "pasta", "penne", "pomodoro"],
  "pasta": ["alfredo", "arrabbiata", "penne", "macaroni", "pasta", "tagliatelle", "white sauce", "red sauce", "pesto", "risotto"],
  "pizza": ["margherita", "quattro formaggi", "pepperoni", "woodfired", "wood-fired", "pizza", "burrata", "crust"],
  "pizzas": ["margherita", "quattro formaggi", "pepperoni", "woodfired", "wood-fired", "pizza", "burrata"],
  "pesto": ["pesto", "tagliatelle", "genovese", "burrata", "panini"],
  "risotto": ["risotto", "rice", "mushroom", "truffle", "arborio"],
  "panini": ["panini", "sandwich", "toastie", "ciabatta"],
  "sandwich": ["panini", "sandwich", "toastie", "sourdough", "avocado toast"],
  "burger": ["burgers", "smash", "patty", "brioche", "cheeseburger"],
  "coffee": ["brew", "cappuccino", "espresso", "flat white", "macchiato", "cold brew", "latte", "spanish latte"],
  "tea": ["chai", "tea", "pot", "cardamom", "ginger", "iced tea"],
  "chai": ["tea", "chai", "pot", "cardamom", "ginger"],
  "shake": ["thickshake", "frappe", "milkshake", "nutella", "biscoff"],
  "dessert": ["tiramisu", "brownie", "cheesecake", "churros", "cake", "sweet"],
  "tiramisu": ["tiramisu", "dessert", "italian", "cake"],
  "fries": ["chips", "potato", "truffle", "peri peri", "parmesan", "fries"],
  "truffle": ["truffle", "mushroom", "fries", "risotto", "burger", "pizza"]
};
