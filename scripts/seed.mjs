import "dotenv/config";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL required");

const conn = await mysql.createConnection(url);
console.log("Connected. Seeding alien.mx...");

const products = [
  {
    slug: "conos-oro-24k",
    name: "Conos Oro 24K",
    category: "paraphernalia",
    description:
      "Pack de 3 conos pre-rolados con papel de oro real para una combustion lenta y cosmica. Edicion de contacto.",
    priceMxn: "420.00",
    imageUrl:
      "https://images.unsplash.com/photo-1567400358593-c8e5b9c9f3a3?q=80&w=1200&auto=format&fit=crop",
    badge: "EN STOCK",
    inStock: 1,
    sizes: null,
    amazonAsin: "B07XGOLD24",
    mercadolibreId: "MLM-1029384756",
    featured: 1,
  },
  {
    slug: "triturador-orbital",
    name: "Triturador Orbital",
    category: "accessories",
    description:
      "Grinder de 4 piezas en aluminio aeroespacial. Dientes afilados como laser, acabado iridiscente morado.",
    priceMxn: "650.00",
    imageUrl:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    inStock: 1,
    sizes: null,
    amazonAsin: "B08GRINDER4",
    mercadolibreId: "MLM-2938475610",
    featured: 1,
  },
  {
    slug: "hoodie-believe",
    name: 'Hoodie "Believe"',
    category: "apparel",
    description:
      "Algodon de alto gramaje. Estampado reactivo a luz UV para visibilidad interestelar. Corte oversize.",
    priceMxn: "1200.00",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    badge: "LIMITED DROP",
    inStock: 1,
    sizes: JSON.stringify(["M", "L", "XL"]),
    amazonAsin: "B09HOODBLV",
    mercadolibreId: "MLM-1122334455",
    featured: 1,
  },
  {
    slug: "conos-del-vacio",
    name: "Conos del Vacio",
    category: "paraphernalia",
    description: "Conos pre-rolados negro mate. Arden lento, se ven infinitos. Paquete de 6.",
    priceMxn: "480.00",
    imageUrl:
      "https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1200&auto=format&fit=crop",
    badge: "LANZAMIENTO LIMITADO",
    inStock: 1,
    sizes: null,
    amazonAsin: "B07VOIDCON6",
    mercadolibreId: "MLM-5566778899",
    featured: 0,
  },
  {
    slug: "grinder-nebula",
    name: "Grinder Nebula",
    category: "cosmic_gear",
    description:
      "Aluminio aeroespacial de 4 piezas con acabado iridiscente morado psicodelico. Dientes de diamante.",
    priceMxn: "1500.00",
    imageUrl:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    inStock: 1,
    sizes: null,
    amazonAsin: "B08NEBULA44",
    mercadolibreId: "MLM-6677889900",
    featured: 0,
  },
  {
    slug: "playera-frecuencia",
    name: "Playera Frecuencia",
    category: "apparel",
    description: "Tee psico-esfera serigrafia glow. 100% algodon pesado. Vibra de transmision.",
    priceMxn: "550.00",
    imageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop",
    badge: "EN STOCK",
    inStock: 1,
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    amazonAsin: "B09FREQTEE",
    mercadolibreId: "MLM-1212343456",
    featured: 0,
  },
  {
    slug: "lentes-vacio",
    name: "Lentes del Vacio",
    category: "accessories",
    description: "Gafas polarizadas espejadas. Vision protegida para encuentros de tercer tipo.",
    priceMxn: "390.00",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    inStock: 0,
    sizes: null,
    amazonAsin: "B08VOIDSHADE",
    mercadolibreId: "MLM-9988776655",
    featured: 0,
  },
  {
    slug: "aceite-cbd-cosmico",
    name: "Aceite CBD Cosmico",
    category: "cbd",
    description: "Tintura CBD espectro completo 1000mg. Calma de otra galaxia. 30ml.",
    priceMxn: "890.00",
    imageUrl:
      "https://images.unsplash.com/photo-1611242320536-f12d3541249b?q=80&w=1200&auto=format&fit=crop",
    badge: "EN STOCK",
    inStock: 1,
    sizes: null,
    amazonAsin: "B09CBDCOSMO",
    mercadolibreId: "MLM-4455667788",
    featured: 0,
  },
];

for (const p of products) {
  await conn.execute(
    `INSERT IGNORE INTO products (slug,name,category,description,priceMxn,imageUrl,badge,inStock,sizes,amazonAsin,mercadolibreId,featured)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      p.slug, p.name, p.category, p.description, p.priceMxn, p.imageUrl, p.badge,
      p.inStock, p.sizes, p.amazonAsin, p.mercadolibreId, p.featured,
    ],
  );
}
console.log(`Seeded ${products.length} products`);

const news = [
  {
    slug: "esfera-de-buga-reporte-critico",
    title: "Esfera de Buga: Reporte Critico",
    excerpt:
      "Analisis metalurgico de la esfera hallada en Colombia revela una aleacion no catalogada.",
    body:
      "El objeto conocido como la Esfera de Buga continua generando controversia. Reportes preliminares describen una estructura interna de capas concentricas imposible de replicar con tecnologia conocida.\n\nNuestro equipo de investigacion documenta cada actualizacion del caso desde el underground.",
    category: "declassified",
    imageUrl:
      "https://images.unsplash.com/photo-1614314107768-6018061b5b72?q=80&w=1200&auto=format&fit=crop",
    authorName: "Redaccion ALIEN.MX",
    published: 1,
  },
  {
    slug: "uap-zona-del-silencio",
    title: "UAP detectado sobre la Zona del Silencio",
    excerpt: "Multiples testigos reportan luces en formacion sobre Durango. Nivel de senal 4.",
    body:
      "La Zona del Silencio vuelve a ser epicentro de actividad anomala. Coordenadas confirmadas por la comunidad.\n\nVota y valida el reporte en el Mapa de Avistamientos.",
    category: "uap_alert",
    imageUrl:
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop",
    authorName: "Red de Testigos",
    published: 1,
  },
  {
    slug: "frecuencia-festival-cosmico",
    title: "La Frecuencia: cronica del festival cosmico",
    excerpt: "Resumen de la ultima reunion del underground nocturno. Luces, bajo y contacto.",
    body:
      "Una noche de pura frecuencia. El underground mexicano se reunio bajo laseres neon para celebrar la contracultura cosmica.",
    category: "festival",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    authorName: "Editorial",
    published: 1,
  },
  {
    slug: "desclasificacion-pentagono-2026",
    title: "Pentagono libera nuevos archivos UAP",
    excerpt: "La nueva tanda de documentos desclasificados alimenta el debate sobre contacto.",
    body:
      "El newsjacking gubernamental continua. Cada desclasificacion es una oportunidad para mapear la verdad.",
    category: "editorial",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    authorName: "Redaccion ALIEN.MX",
    published: 1,
  },
];

for (const n of news) {
  await conn.execute(
    `INSERT IGNORE INTO newsPosts (slug,title,excerpt,body,category,imageUrl,authorName,published)
     VALUES (?,?,?,?,?,?,?,?)`,
    [n.slug, n.title, n.excerpt, n.body, n.category, n.imageUrl, n.authorName, n.published],
  );
}
console.log(`Seeded ${news.length} news posts`);

const sightings = [
  ["Zona del Silencio", "Luces en formacion triangular descendiendo lento.", "26.690000", "-103.740000", "Durango", 4, 128, "verified"],
  ["Volcan Popocatepetl", "Objeto entrando al crater captado por webcam.", "19.023000", "-98.622000", "Puebla", 5, 342, "verified"],
  ["Cerro de la Silla", "Esfera luminosa estatica por 12 minutos.", "25.633000", "-100.236000", "Monterrey", 3, 56, "pending"],
  ["Parque Metropolitano", "Luces verdes pulsantes cerca del lago.", "20.659000", "-103.420000", "Zapopan", 2, 41, "pending"],
  ["Teotihuacan", "Formacion de 5 puntos sobre la Piramide del Sol.", "19.692000", "-98.844000", "Estado de Mexico", 4, 87, "verified"],
];

for (const s of sightings) {
  await conn.execute(
    `INSERT IGNORE INTO sightings (title,description,lat,lng,locationName,level,votes,status)
     VALUES (?,?,?,?,?,?,?,?)`,
    s,
  );
}
console.log(`Seeded ${sightings.length} sightings`);

const activity = [
  [null, "Operador-X9", "system", "intercepto una transmision cifrada // Sector 420"],
  [null, "VibraMaster", "score", "aterrizo 8,420 pts en el Arcade 420"],
  [null, "TestigoMX", "sighting", "reporto un avistamiento en Monterrey"],
  [null, "Abducido_77", "order", "reclamo el Hoodie Believe con $ALIENX // -15%"],
];

for (const a of activity) {
  await conn.execute(
    `INSERT INTO activityFeed (userId,actorName,type,message) VALUES (?,?,?,?)`,
    a,
  );
}
console.log(`Seeded ${activity.length} activity entries`);

await conn.end();
console.log("Seed complete.");
