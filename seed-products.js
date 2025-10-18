
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase URL or Service Key. Make sure they are set in your .env.local file.');
  process.exit(1);
}

// Create a Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const productsToSeed = [
  {
    name: "Té de Boldo de los Andes",
    description: "Infusión herbal de boldo, ideal para la digestión y el bienestar.",
    price: 4990,
    original_price: 5490,
    image_url: "/boldo-leaves-infusion-from-the-andes-mountains.jpg",
    rating: 4.8,
    reviews_count: 98,
    badge: "Local",
    stock: 80
  },
  {
    name: "Infusión de Maqui Patagónico",
    description: "Potente antioxidante natural del sur de Chile, de sabor intenso y frutal.",
    price: 6490,
    image_url: "/patagonian-maqui-berry-infusion-deep-purple-color.jpg",
    rating: 4.9,
    reviews_count: 152,
    badge: "Superfruta",
    stock: 60
  },
  {
    name: "Té Verde con Menta y Cedrón",
    description: "Refrescante mezcla de té verde, menta y cedrón, perfecta para cualquier momento.",
    price: 5990,
    image_url: "/green-tea-blend-with-mint-and-cedron-herbs.jpg",
    rating: 4.7,
    reviews_count: 110,
    badge: "Refrescante",
    stock: 95
  },
  {
    name: "Rooibos con Murta Sureña",
    description: "Dulce y aromática infusión de rooibos con el toque único de la murta chilena.",
    price: 6990,
    original_price: 7500,
    image_url: "/rooibos-infusion-with-sweet-southern-murta-berries.jpg",
    rating: 4.9,
    reviews_count: 215,
    badge: "Más Vendido",
    stock: 70
  },
];

async function seedDatabase() {
  console.log('Seeding database with products...');

  // First, delete all existing products to avoid duplicates
  const { error: deleteError } = await supabase.from('products').delete().neq('id', 0);
  if (deleteError) {
    console.error('Error deleting existing products:', deleteError);
    return;
  }
  console.log('Existing products deleted.');

  const { data, error } = await supabase
    .from('products')
    .insert(productsToSeed)
    .select();

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('Successfully seeded products:', data);
  }
}

seedDatabase();
