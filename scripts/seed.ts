
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase URL or Service Key. Make sure they are set in your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = [
  { name: 'Té Negro', slug: 'te-negro' },
  { name: 'Té Verde', slug: 'te-verde' },
  { name: 'Oolong', slug: 'oolong' },
  { name: 'Infusiones', slug: 'infusiones' },
];

const products = [
  {
    name: 'English Breakfast',
    description: 'Un clásico robusto y con cuerpo, perfecto para empezar el día con energía.',
    price: 8990,
    image_url: '/images/english-breakfast.jpg',
    rating: 4.8,
    reviews_count: 120,
    stock: 100,
    category_name: 'Té Negro',
  },
  {
    name: 'Earl Grey',
    description: 'Elegante té negro aromatizado con aceite de bergamota, de sabor cítrico y floral.',
    price: 9490,
    original_price: 10500,
    image_url: '/images/earl-grey.jpg',
    rating: 4.9,
    reviews_count: 250,
    stock: 80,
    category_name: 'Té Negro',
  },
  {
    name: 'Sencha Japonés',
    description: 'Fresco y vegetal, este té verde es conocido por su delicado dulzor y notas marinas.',
    price: 10990,
    image_url: '/images/sencha.jpg',
    rating: 4.7,
    reviews_count: 95,
    stock: 60,
    category_name: 'Té Verde',
  },
  {
    name: 'Té Verde con Menta',
    description: 'Refrescante mezcla de té verde y hojas de menta, ideal para después de las comidas.',
    price: 7990,
    image_url: '/images/green-mint.jpg',
    rating: 4.6,
    reviews_count: 150,
    stock: 120,
    category_name: 'Té Verde',
  },
  {
    name: 'Oolong Tie Guan Yin',
    description: '"Diosa de Hierro de la Misericordia", un oolong floral con notas de orquídea.',
    price: 14990,
    image_url: '/images/tie-guan-yin.jpg',
    rating: 4.9,
    reviews_count: 70,
    stock: 40,
    category_name: 'Oolong',
  },
  {
    name: 'Manzanilla y Lavanda',
    description: 'Infusión relajante que combina la suavidad de la manzanilla con el aroma calmante de la lavanda.',
    price: 6990,
    image_url: '/images/chamomile-lavender.jpg',
    rating: 4.8,
    reviews_count: 180,
    stock: 200,
    category_name: 'Infusiones',
  },
  {
    name: 'Frutos del Bosque',
    description: 'Explosión de sabor con fresas, frambuesas y arándanos. Dulce, ácida y sin cafeína.',
    price: 7490,
    image_url: '/images/forest-fruits.jpg',
    rating: 4.7,
    reviews_count: 220,
    stock: 150,
    category_name: 'Infusiones',
  },
];


async function main() {
  console.log('Iniciando el proceso de seeding...');

  // Limpiar tablas
  console.log('Limpiando datos antiguos...');
  const { error: deleteProductsError } = await supabase.from('products').delete().neq('id', 0);
  if (deleteProductsError) {
    console.error('Error limpiando la tabla products:', deleteProductsError);
    return;
  }
  const { error: deleteCategoriesError } = await supabase.from('categories').delete().neq('id', 0);
  if (deleteCategoriesError) {
    console.error('Error limpiando la tabla categories:', deleteCategoriesError);
    return;
  }
  console.log('Tablas limpiadas.');

  // Insertar categorías
  console.log('Insertando categorías...');
  const { data: insertedCategories, error: insertCategoriesError } = await supabase
    .from('categories')
    .insert(categories)
    .select();

  if (insertCategoriesError || !insertedCategories) {
    console.error('Error insertando categorías:', insertCategoriesError);
    return;
  }
  console.log(`${insertedCategories.length} categorías insertadas.`);

  // Mapear nombres de categoría a IDs
  const categoryMap = insertedCategories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, number>);

  // Preparar productos con category_id
  const productsToInsert = products.map(product => ({
    ...product,
    category_id: categoryMap[product.category_name],
    category_name: undefined, // Eliminar la propiedad temporal
  }));

  // Insertar productos
  console.log('Insertando productos...');
  const { error: insertProductsError } = await supabase.from('products').insert(productsToInsert);

  if (insertProductsError) {
    console.error('Error insertando productos:', insertProductsError);
    return;
  }
  console.log(`${products.length} productos insertados.`);
  
  console.log('¡Seeding completado con éxito!');
}

main().catch(e => console.error(e));
