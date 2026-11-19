INSERT INTO productos (nombre, descripcion, categoria, precio)
SELECT 'Creatina Monohidrato Pure 300 g', 'Creatina monohidrato micronizada, 60 porciones sin sabor.', 'Hipertrofia', 29.90
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Creatina Monohidrato Pure 300 g');

INSERT INTO productos (nombre, descripcion, categoria, precio)
SELECT 'Proteína Whey Isolate Chocolate 900 g', 'Aislado de suero de leche, 24 g de proteína por porción, bajo en lactosa.', 'Hipertrofia', 59.90
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Proteína Whey Isolate Chocolate 900 g');

INSERT INTO productos (nombre, descripcion, categoria, precio)
SELECT 'BCAA 8:1:1 Recovery 250 g', 'Aminoácidos de cadena ramificada con glutamina, 30 porciones.', 'Recuperación', 34.50
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'BCAA 8:1:1 Recovery 250 g');

INSERT INTO productos (nombre, descripcion, categoria, precio)
SELECT 'Thermo Burn 60 cápsulas', 'Complejo con cafeína y extracto de té verde para apoyo al metabolismo.', 'Quemadores', 39.90
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Thermo Burn 60 cápsulas');

INSERT INTO productos (nombre, descripcion, categoria, precio)
SELECT 'Pre Workout Pump X 300 g', 'Fórmula con beta-alanina y citrulina para entrenamientos de alta intensidad.', 'Pre-entreno', 44.90
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Pre Workout Pump X 300 g');
