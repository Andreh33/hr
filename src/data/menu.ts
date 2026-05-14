export type MenuCategory =
  | "hamburguesas-clasicas"
  | "hamburguesas-gourmet"
  | "bocadillos"
  | "casa-papas"
  | "snacks"
  | "raciones"
  | "postres";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  vegetarian?: boolean;
  spicy?: boolean;
  featured?: boolean;
};

export type CategoryMeta = {
  id: MenuCategory | "todo";
  label: string;
  number: string;
  blurb?: string;
};

export const CATEGORIES: ReadonlyArray<CategoryMeta> = [
  { id: "hamburguesas-clasicas", label: "Hamburguesas Clásicas", number: "01", blurb: "Pan, fuego, queso y oficio." },
  { id: "hamburguesas-gourmet",  label: "Hamburguesas Gourmet",  number: "02", blurb: "Donde el patio se viste de etiqueta." },
  { id: "bocadillos",            label: "Bocadillos HR",         number: "03", blurb: "Pan crujiente y manos generosas." },
  { id: "casa-papas",            label: "La Casa de las Papas",  number: "04", blurb: "Patatas que viajan más que tú." },
  { id: "snacks",                label: "Snacks",                number: "05", blurb: "Para compartir o no compartir." },
  { id: "raciones",              label: "Raciones",              number: "06", blurb: "Plato grande, mesa contenta." },
  { id: "postres",               label: "Postres",               number: "07", blurb: "El final feliz." },
];

export const FILTER_PILLS: ReadonlyArray<{ id: MenuCategory | "todo"; label: string }> = [
  { id: "todo", label: "Todo" },
  { id: "hamburguesas-clasicas", label: "Clásicas" },
  { id: "hamburguesas-gourmet",  label: "Gourmet" },
  { id: "bocadillos",            label: "Bocadillos" },
  { id: "casa-papas",            label: "Casa de las Papas" },
  { id: "snacks",                label: "Snacks" },
  { id: "raciones",              label: "Raciones" },
  { id: "postres",               label: "Postres" },
];

export const MENU: ReadonlyArray<MenuItem> = [
  // ── Hamburguesas Clásicas
  { id: "crispy-pollo",        name: "Crispy Pollo Crujiente",        description: "Pollo crujiente con queso, lechuga y salsa",                                              price: 7.00,  category: "hamburguesas-clasicas" },
  { id: "crocante-ternera",    name: "Crocante de Ternera",           description: "Ternera con queso, bacon, lechuga y salsa",                                               price: 8.50,  category: "hamburguesas-clasicas" },
  { id: "diabla",              name: "Diabla",                        description: "Ternera con doble queso, chunks de pollo y salsa picante",                                price: 8.50,  category: "hamburguesas-clasicas", spicy: true },
  { id: "la-bomba",            name: "La Bomba",                      description: "Pollo o ternera con cerdo glaseado, cebolla plancha y queso",                             price: 8.95,  category: "hamburguesas-clasicas" },
  { id: "ratona",              name: "Ratona",                        description: "Pollo o ternera con 4 quesos de diferentes texturas y sabores",                           price: 8.95,  category: "hamburguesas-clasicas" },
  { id: "cheese-burguer",      name: "Cheese Burguer",                description: "Ternera con doble salsa de queso, bacon, queso, lechuga y tomate",                         price: 8.95,  category: "hamburguesas-clasicas" },
  { id: "caribe",              name: "Caribe",                        description: "Cebolla caramelizada con bacon, cheddar y mozzarella",                                    price: 8.95,  category: "hamburguesas-clasicas" },
  { id: "hamburguesa-kebab",   name: "Hamburguesa Kebab",             description: "Carne de pollo sabor kebab, salsa yogur, cebolla, tomate y lechuga",                       price: 8.00,  category: "hamburguesas-clasicas" },
  { id: "texas",               name: "Texas Burguer",                 description: "Ternera con aros de cebolla, bacon y doble queso",                                        price: 8.95,  category: "hamburguesas-clasicas" },
  { id: "doble-ternera-pollo", name: "La Doble de Ternera ó Pollo",   description: "Doble carne, lechuga, tomate, pepinillos, salsa y queso",                                  price: 11.95, category: "hamburguesas-clasicas", featured: true },

  // ── Hamburguesas Gourmet
  { id: "gamberra",     name: "La Gamberra",     description: "Ternera o pollo crujiente, mozzarella y queso curado, salsa HR, mayonesa de trufa, mermelada de bacon ahumado y pan brioche BLACK", price: 10.50, category: "hamburguesas-gourmet", featured: true },
  { id: "cachorra",     name: "La Cachorra",     description: "Ternera o pollo crujiente, cheddar y havarti, crujiente de bacon, salteado de verduras al wok, salsa Bourbon y pan brioche",         price: 10.50, category: "hamburguesas-gourmet" },
  { id: "deluxe",       name: "Deluxe",          description: "Ternera, patatas paja, jamón, huevo y salsa deluxe",                                                                                  price: 9.95,  category: "hamburguesas-gourmet" },
  { id: "caprichosa",   name: "Caprichosa",      description: "Ternera o pollo con rulo de cabra, cebolla caramelizada y crujiente",                                                                 price: 9.50,  category: "hamburguesas-gourmet" },
  { id: "grunona",      name: "Gruñona",         description: "Ternera o pollo con donetes de queso, bacon y salsa de queso",                                                                       price: 9.50,  category: "hamburguesas-gourmet" },
  { id: "turbo-carnivora", name: "Turbo Carnívora", description: "Carne de ternera + pollo crujiente, huevo, bacon, jamón york y quesos",                                                            price: 10.50, category: "hamburguesas-gourmet" },
  { id: "la-jefa",      name: "La Jefa",         description: "Pulled pork, doble queso derretido, rulo de vaca, salsa baconesa y lechuga",                                                          price: 10.50, category: "hamburguesas-gourmet", featured: true },
  { id: "la-koqueta",   name: "La Koqueta",      description: "Ternera o pollo con bolitas de pollo y salsa sweet, polvo de queso grana padano, cheddar, bacon ahumado, lechuga, salsa Koqueta HR y pan brioche rojo", price: 10.50, category: "hamburguesas-gourmet" },
  { id: "golosa",       name: "La Golosa 2.0",   description: "Ternera o pollo, pan brioche, sin verduras, queso derretido, queso frito en dos versiones, salsa de queso con bacon crispy caramelizado, salsa golosa y polvo terrestre", price: 10.50, category: "hamburguesas-gourmet" },
  { id: "pantera",      name: "La Pantera",      description: "Ternera o pollo, bacon ahumado, salsa pantera, queso mozzarella y cheddar derretido, takis crujientes y algodón de azúcar en pan brioche super jugoso", price: 10.50, category: "hamburguesas-gourmet", featured: true },

  // ── Bocadillos
  { id: "boc-calamares",         name: "Calamares",          description: "Lechuga y mayonesa",                                              price: 7.50, category: "bocadillos" },
  { id: "boc-lomo-plancha",      name: "Lomo a la Plancha",  description: "Tomate, lechuga, queso y mayonesa",                               price: 6.95, category: "bocadillos" },
  { id: "boc-pechuga-crujiente", name: "Pechuga Crujiente",  description: "Lechuga, tomate, queso y mayonesa",                               price: 7.25, category: "bocadillos" },
  { id: "boc-pechuga-plancha",   name: "Pechuga a la Plancha", description: "Lechuga, tomate, queso y mayonesa",                             price: 6.95, category: "bocadillos" },
  { id: "boc-bacon-queso",       name: "Bacon y Queso",      price: 6.95, category: "bocadillos" },
  { id: "boc-tu-gusto",          name: "A Tu Gusto",         description: "Hasta 6 ingredientes a elegir",                                    price: 7.95, category: "bocadillos" },
  { id: "boc-pollo-kebab",       name: "Pollo Kebab",        description: "Lechuga, salsa yogur y queso",                                     price: 7.50, category: "bocadillos" },
  { id: "boc-secreto",           name: "Secreto",            description: "Dos salsas de queso, cebolla caramelizada y tomate",               price: 7.50, category: "bocadillos" },
  { id: "boc-serranito",         name: "Serranito de Pollo o Lomo", description: "Tomate, mayonesa, pimiento y jamón",                       price: 7.50, category: "bocadillos" },
  { id: "boc-panceta",           name: "Panceta",            description: "Con tomate natural",                                                price: 7.50, category: "bocadillos" },
  { id: "boc-hr",                name: "HR",                 description: "Carne BBQ, queso derretido, cebolla plancha, bacon y jamón york",  price: 7.50, category: "bocadillos", featured: true },
  { id: "boc-vegetal",           name: "Vegetal",            description: "Mayonesa, lechuga, tomate, atún, jamón york y cebolla crujiente", price: 7.50, category: "bocadillos" },
  { id: "boc-lomo-adobado",      name: "Lomo Adobado",       description: "Pimientos, cebolla caramelizada, lechuga, salsa HR y queso de cabra derretido", price: 7.50, category: "bocadillos" },

  // ── La Casa de las Papas
  { id: "papas-moscu",      name: "Moscú",      description: "Patatas fritas normales",                                                              price: 6.50, category: "casa-papas", vegetarian: true },
  // "Profesor" is a chef's-name dish (no real city) — not rendered on the
  // flavor map but still listed in the menu.
  { id: "papas-profesor",   name: "Profesor",   description: "Patatas con pechuga, lomo, salchicha, bacon, salsa de queso y salsa BBQ",                price: 9.95, category: "casa-papas" },
  { id: "papas-tokio",      name: "Tokio",      description: "Patatas con lomo, salchicha, bacon, pollo plancha y salsa BBQ",                          price: 9.50, category: "casa-papas" },
  { id: "papas-denver",     name: "Denver",     description: "Patatas con tiras de pechuga plancha, miel, mostaza y un toque picante",                 price: 9.50, category: "casa-papas", spicy: true },
  { id: "papas-eestocolmo", name: "Eestocolmo", description: "Patatas con sabor kebab",                                                                 price: 7.95, category: "casa-papas" },
  { id: "papas-rio",        name: "Río",        description: "Patatas con bacon crispy y salsa de queso",                                              price: 7.95, category: "casa-papas" },
  { id: "papas-helsinki",   name: "Helsinki",   description: "Salchichas, patatas, bacon crispy, salsa de queso y salsa kebab",                         price: 7.95, category: "casa-papas" },
  { id: "papas-berlin",     name: "Berlín",     description: "Patatas con carne BBQ y bacon",                                                           price: 9.50, category: "casa-papas" },
  { id: "papas-lisboa",     name: "Lisboa",     description: "Patatas con bacon crispy, salsa de queso y salsa carbonara",                              price: 9.50, category: "casa-papas" },
  { id: "papas-nairobi",    name: "Nairobi",    description: "Patatas fritas con salsa",                                                                price: 7.00, category: "casa-papas", vegetarian: true },

  // ── Snacks
  { id: "snack-donetes",        name: "Donetes de Queso",       description: "5 unidades",      price: 5.95, category: "snacks", vegetarian: true },
  { id: "snack-nuggets",        name: "Nuggets de Pollo",       description: "6 unidades",      price: 4.95, category: "snacks" },
  { id: "snack-aros-cebolla",   name: "Aros de Cebolla Crujientes", price: 4.95, category: "snacks", vegetarian: true },
  { id: "snack-croquetas-jamon",name: "Croquetas de Jamón",     description: "4 unidades",      price: 4.95, category: "snacks" },
  { id: "snack-alitas-bbq",     name: "Alitas de Pollo BBQ",    description: "5 unidades",      price: 4.95, category: "snacks" },

  // ── Raciones
  { id: "rac-tiras-pollo",        name: "Tiras de Pollo Crujiente",     description: "Bacon, queso y salsa de yogur",                                price: 9.95,  category: "raciones" },
  { id: "rac-pollo-kentucky",     name: "Pollo al Kentucky",            price: 9.50,  category: "raciones" },
  { id: "rac-ensalada-hr",        name: "Ensalada HR",                  description: "Lechuga, tomate, pollo, picatostes, lascas de queso y salsa",   price: 8.50,  category: "raciones" },
  { id: "rac-calamares-romana",   name: "Calamares a la Romana",        description: "Con ensalada",                                                  price: 12.00, category: "raciones" },
  { id: "rac-rejos-fritos",       name: "Rejos Fritos",                 description: "Con ensalada",                                                  price: 12.00, category: "raciones" },
  { id: "rac-cerdo-brasa",        name: "Carne de Cerdo a la Brasa",    description: "Con patatas",                                                    price: 12.00, category: "raciones" },
  { id: "rac-pollo-brasa",        name: "Carne de Pollo a la Brasa",    description: "Con patatas",                                                    price: 12.00, category: "raciones" },
  { id: "rac-bacalao-dorado",     name: "Bacalao Dorado",               price: 11.00, category: "raciones" },
  { id: "rac-croquetas-jamon-10", name: "Croquetas de Jamón",           description: "10 unidades",                                                    price: 9.50,  category: "raciones" },
  { id: "rac-cachopo",            name: "Cachopo de Ternera",           description: "Con patatas y ensalada",                                         price: 9.95,  category: "raciones" },
  { id: "rac-croquetas-secreto",  name: "Croquetas de Secreto",         description: "10 unidades",                                                    price: 10.50, category: "raciones" },
  { id: "rac-fritura-pescado",    name: "Fritura de Pescado",           price: 12.50, category: "raciones" },
  { id: "rac-secreto-brasa",      name: "Secreto a la Brasa",           price: 12.50, category: "raciones" },
  { id: "rac-solomillo",          name: "Solomillo",                    description: "Con salsa de queso o a la brasa",                                price: 13.50, category: "raciones", featured: true },
  { id: "rac-petorejo-panceta",   name: "Petorejo ó Panceta a la Brasa", price: 11.00, category: "raciones" },

  // ── Postres
  { id: "postre-tartas", name: "Tartas de la Casa", description: "Preguntar disponibles", price: 3.95, category: "postres", vegetarian: true },
  { id: "postre-helado", name: "Helado HR",         description: "Preguntar sabores",      price: 3.50, category: "postres", vegetarian: true },
];

export const MENU_EXTRAS = {
  menuBocadillo:   { label: "Haz menú tu bocadillo",   description: "Bocadillo + bebida + patatas",            extraPrice: 3.50 },
  menuHamburguesa: { label: "Haz menú tu hamburguesa", description: "Hamburguesa + bebida + patatas + postre", extraPrice: 4.00 },
  patatasExtras: [
    { id: "patatas-bacon-cheddar", name: "Patatas bacon cheddar",          price: 3.50 },
    { id: "patatas-kebab-yogurt",  name: "Patatas con kebab y salsa de yogur", price: 3.50 },
    { id: "patatas-normales",      name: "Patatas normales",               price: 2.50 },
    { id: "patatas-deluxe",        name: "Patatas Deluxe",                 price: 2.95 },
  ],
  ingredientesExtras: [
    "bacon","queso","tomate","lechuga","salsa","cebolla crujiente","cebolla plancha","cebolla caramelizada","jamón york","patatas fritas","patatas pajas","jamón serrano","pimiento","huevo",
  ],
  ingredientesPrincipales: ["pollo crujiente","pollo a la plancha","lomo","lomo adobado"],
} as const;

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return MENU.filter((m) => m.category === category);
}

export function findItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}

export const MENU_STATS = {
  total: MENU.length,
  vegetarian: MENU.filter((m) => m.vegetarian).length,
  spicy: MENU.filter((m) => m.spicy).length,
  featured: MENU.filter((m) => m.featured).length,
  categories: CATEGORIES.length,
};
