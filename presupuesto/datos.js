window.PRESUPUESTO = {
  "version": 4,
  "fechas": "23/10 al 5/11",
  "impuesto": 10.25,
  "franquicia": 500,
  "plantilla": {
    "recibo": 0,
    "dias": 14,
    "almuerzo": 15,
    "cena": 15,
    "conImpuesto": true,
    "miParte": true,
    "reservas": [
      { "id": "uber", "nombre": "Uber", "nota": "Mi parte del presupuesto de Uber del grupo", "precio": 600, "on": true },
      { "id": "hhn", "nombre": "Halloween Horror Nights", "nota": "Entrada", "precio": 90, "on": true },
      { "id": "esim", "nombre": "eSIM Holafly", "nota": "Datos en EE. UU. para todo el viaje", "precio": 50, "on": true }
    ],
    "snacks": [
      { "id": "s1", "nombre": "Café en Central Perk", "nota": "Warner Bros", "precio": 7, "on": true },
      { "id": "s2", "nombre": "Chili dog de Pink's", "nota": "Hollywood", "precio": 10, "on": true },
      { "id": "s3", "nombre": "Butterbeer", "nota": "Universal", "precio": 11, "on": true },
      { "id": "s4", "nombre": "Dona de Lard Lad", "nota": "Universal", "precio": 10, "on": true },
      { "id": "s5", "nombre": "Voodoo Doughnut", "nota": "CityWalk", "precio": 6, "on": true },
      { "id": "s6", "nombre": "Birria", "nota": "Horror Nights", "precio": 17, "on": true },
      { "id": "s7", "nombre": "Sushi dog", "nota": "Intuit Dome", "precio": 18, "on": true },
      { "id": "s8", "nombre": "Blue Milk", "nota": "Disneyland", "precio": 10, "on": true },
      { "id": "s9", "nombre": "Beignets de Mickey", "nota": "Disneyland", "precio": 10, "on": true },
      { "id": "s10", "nombre": "Galletas de Jolly Holiday", "nota": "Disneyland (hasta 31/10)", "precio": 7, "on": true },
      { "id": "s11", "nombre": "Corn dog picante de Little Red Wagon", "nota": "Disneyland", "precio": 12, "on": true },
      { "id": "s12", "nombre": "Hot Dog on a Stick", "nota": "Santa Monica", "precio": 8, "on": true }
    ],
    "compras": []
  },
  "personas": [
    {
      "id": "lucas",
      "nombre": "Lucas",
      "color": "#9ec5ff",
      "recibo": 4400,
      "poner": { "4": { "recibo": 4400 } },
      "quitados": { "samba": 3, "running-h": 3, "running-m": 3 },
      "gastos": [
        { "id": "g-2410-1", "desde": 4, "monto": 37, "cat": "otros", "nota": "", "ts": "2026-10-24" }
      ],
      "compras": [
        { "id": "airpods", "tienda": "bestbuy", "nombre": "Apple AirPods 4 con cancelación de ruido", "nota": "Best Buy hoy US$ 119,99 (antes 179,99) · salieron los AirPods 5", "precio": 119.99, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/ed0cfc76-5b94-4e84-af82-a3cc7cff60e4.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "pocket", "tienda": "bestbuy", "grupo": "DJI Osmo Pocket 3", "sel": null, "opciones": [
          { "id": "p1", "nombre": "Pocket 3 sola + microSD 128 GB", "nota": "US$ 395 + SanDisk Extreme US$ 42,98", "precio": 437.98, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6560/6560933_rd.jpg;maxHeight=200;maxWidth=200?format=webp" },
          { "id": "p2", "nombre": "Pocket 3 Creator Combo", "nota": "US$ 495 (antes 549) · sin memoria", "precio": 495, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6560/6560934_rd.jpg;maxHeight=200;maxWidth=200?format=webp" },
          { "id": "p3", "nombre": "Pocket 3 Vlog Combo con todo", "nota": "US$ 549 (antes 649) · trae microSD 128 GB, micrófono y trípode", "precio": 549, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/bcc5b572-b2a1-4b9e-aa0d-75c8091ea272.jpg;maxHeight=200;maxWidth=200?format=webp" }
        ] },
        { "id": "webcam", "tienda": "bestbuy", "grupo": "Webcam Logitech", "sel": null, "opciones": [
          { "id": "w1", "nombre": "C920s Pro 1080p", "nota": "≈ US$ 70 · con tapa de privacidad", "precio": 69.99, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/52ec5ca1-61ef-43e6-921a-50424fc6b146.jpg;maxHeight=200;maxWidth=200?format=webp" },
          { "id": "w2", "nombre": "MX Brio 4K", "nota": "Best Buy US$ 199,99", "precio": 199.99, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6571/6571655_sd.jpg;maxHeight=200;maxWidth=200?format=webp" }
        ] },
        { "id": "mouse", "tienda": "bestbuy", "nombre": "Logitech Signature M650 L", "nota": "Best Buy US$ 39,99", "precio": 39.99, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/16068800-8393-467e-8f23-9297edde0c72.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "teclado", "tienda": "bestbuy", "nombre": "Teclado Logitech G915 X TKL", "nota": "Best Buy US$ 209,99 · el full-size está a US$ 199,99", "precio": 209.99, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/c0ffbad8-6d80-4353-8a22-e6dccd81165c.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "xbox", "tienda": "bestbuy", "nombre": "Joystick Xbox Wireless · Electric Volt", "nota": "Best Buy US$ 71,75", "precio": 71.75, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6456/6456332_sd.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "rtx", "tienda": "bestbuy", "nombre": "Placa de video RTX 5070 12 GB", "nota": "Tu tope. La más barata que vi hoy en Best Buy: MSI Gaming Trio OC US$ 879,99 · Founders Edition US$ 549 si hay stock", "precio": 800, "on": false, "alerta": true, "aviso": "La RTX 5070 a US$ 800 está en el rango del mercado (promedio ≈ US$ 890; hoy la más barata en Best Buy es la MSI a US$ 879,99). Con impuesto, US$ 800 son ≈ US$ 882. Si aparece la Founders Edition a US$ 549, te ahorrás unos US$ 275.", "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5a16cc23-ca60-45a9-a35a-50094ca7c1e0.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "vinilo", "tienda": "bestbuy", "nombre": "Vinilo Off the Wall · Michael Jackson", "nota": "Best Buy US$ 25,18", "precio": 25.18, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/ad26e63e-2a68-4980-9c9b-9f4f1c14559f.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "action", "tienda": "bestbuy", "nombre": "DJI Osmo Action 6 Adventure Combo + microSD 64 GB", "nota": "Bundle de Best Buy: mismo precio que el combo solo (US$ 479) y suma memoria y vincha", "precio": 479, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/27684063-0b8f-469c-8d6a-5d9dc3485a04.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "hub", "tienda": "bestbuy", "nombre": "Hub USB-C Anker 332 (5 en 1)", "nota": "Best Buy US$ 20,99 · HDMI 4K y carga 100 W", "precio": 20.99, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/90441287-b82d-48b7-baee-1eb2fdc9e151.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "power", "tienda": "bestbuy", "nombre": "Powerbank MagSafe 5000 mAh ultrafina", "nota": "UGREEN Magflow Air US$ 44,99 · Baseus Picogo US$ 29,99", "precio": 44.99, "on": false, "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/57dfef4c-75a8-4d8a-916b-72fe22315800.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "oneblade", "desde": 2, "tienda": "bestbuy", "nombre": "Afeitadora Philips OneBlade 360 Face + Body", "nota": "Best Buy hoy US$ 39,99 · recargable, para cara y cuerpo. La de sólo cara sale ≈ US$ 30 y la Pro 360 ≈ US$ 70", "precio": 39.99, "on": false, "link": "https://www.bestbuy.com/site/philips-norelco-oneblade-360-face-body-hybrid-electric-trimmer-and-shaver-black-and-green/6530114.p?skuId=6530114", "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6530/6530114_sd.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "airpods5", "desde": 3, "tienda": "bestbuy", "nombre": "Apple AirPods 5 con cancelación de ruido", "nota": "Best Buy US$ 149 · estuche con carga inalámbrica", "precio": 149, "on": false, "link": "https://www.bestbuy.com/product/apple-airpods-5-true-wireless-active-noise-cancelling-earbuds-with-wireless-charging-case-white/JJGCQP634G/sku/6376564", "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6376/6376564_sd.jpg;maxHeight=200;maxWidth=200?format=webp" },
        { "id": "watch12", "desde": 3, "tienda": "bestbuy", "grupo": "Apple Watch Series 12 (GPS)", "sel": null, "opciones": [
          { "id": "aw42", "nombre": "42 mm, aluminio", "nota": "Best Buy US$ 399 · con malla deportiva", "precio": 399, "link": "https://www.bestbuy.com/product/apple-watch-series-12-gps-42mm-aluminum-case-with-sand-sport-band-s-m-light-gold-2026/JJGCQP9FS8", "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6572/6572730_sd.jpg;maxHeight=200;maxWidth=200?format=webp" },
          { "id": "aw46", "nombre": "46 mm, aluminio", "nota": "Best Buy US$ 449 · con malla deportiva y pantalla más grande", "precio": 449, "link": "https://www.bestbuy.com/product/apple-watch-series-12-gps-46mm-aluminum-case-with-black-sport-band-m-l-black-2026/JJGCQP9FRY", "img": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6572/6572737_sd.jpg;maxHeight=200;maxWidth=200?format=webp" }
        ] },
        { "id": "running12", "desde": 3, "tienda": "adidas", "nombre": "Zapatillas de running adidas Supernova Ease 2 · talle 12", "nota": "US$ 100 · de hombre, talle 12 de EE. UU. Otras cerca de ese precio: Supernova Rise 3 hoy US$ 105 (lista US$ 140) y Zenboost hoy US$ 60 (lista US$ 100)", "precio": 100, "on": false, "link": "https://www.adidas.com/us/supernova-ease-2-m-running-shoes/JQ5859.html", "img": "https://assets.adidas.com/images/w_200,h_200,f_auto,q_auto,fl_lossy,c_fill,g_auto/06fd21a7347a4a648aa44c7d77f44d93_9366/SUPERNOVA_EASE_2_M_RUNNING_SHOES_Black_JQ5859_HM1.jpg" },
        { "id": "samba-negra", "desde": 3, "tienda": "adidas", "nombre": "Zapatillas adidas Samba OG de mujer, negras", "nota": "adidas.com US$ 100 · de las más regaladas", "precio": 100, "on": false, "link": "https://www.adidas.com/us/samba-og-shoes/IG9031.html", "img": "https://assets.adidas.com/images/w_200,h_200,f_auto,q_auto,fl_lossy,c_fill,g_auto/cebcf6052ff3443ca0f9812cdf6b993d_9366/Samba_OG_Shoes_Black_IG9031_00_plp_standard.jpg" },
        { "id": "spiritain", "desde": 3, "tienda": "adidas", "nombre": "Zapatillas adidas Spiritain 2000 de mujer", "nota": "Hoy US$ 72 en oferta (lista US$ 90) · crema con suela marrón, hay 4 colores", "precio": 72, "on": false, "link": "https://www.adidas.com/us/spiritain-2000-shoes/LA1818.html", "img": "https://assets.adidas.com/images/w_200,h_200,f_auto,q_auto,fl_lossy,c_fill,g_auto/4b42a546cae24f4c9fe8ff99e95af75a_9366/SPIRITAIN_2000_SHOES_White_LA1818_00_plp_standard.jpg" },
        { "id": "lipinjection", "desde": 3, "tienda": "sephora", "nombre": "Too Faced Mini Lip Injection Maximum Plump", "nota": "Sephora US$ 18 · brillo de labios que da volumen, tamaño mini", "precio": 18, "on": false, "link": "https://www.sephora.com/product/too-faced-mini-lip-injection-maximum-plump-extra-strength-lip-plumper-P471584?skuId=2449072", "img": "https://www.sephora.com/productimages/sku/s2449072-main-zoom.jpg?imwidth=200" },
        { "id": "rhode", "desde": 3, "tienda": "sephora", "grupo": "rhode Glazing Milk · esencia hidratante para la cara", "sel": null, "opciones": [
          { "id": "rhode-normal", "nombre": "Tamaño normal", "nota": "Sephora US$ 32", "precio": 32, "link": "https://www.sephora.com/product/glazing-milk-P519160?skuId=2898419", "img": "https://www.sephora.com/productimages/sku/s2898419-main-zoom.jpg?imwidth=200" },
          { "id": "rhode-mini", "nombre": "Mini", "nota": "Sephora US$ 20", "precio": 20, "link": "https://www.sephora.com/product/mini-glazing-milk-P517513?skuId=3009313", "img": "https://www.sephora.com/productimages/sku/s3009313-main-zoom.jpg?imwidth=200" }
        ] }
      ]
    }
  ],
  "super": {
    "pozo": 100,
    "personas": 5,
    "tienda": "sf",
    "tiendas": [
      { "id": "sf", "nombre": "Smart & Final Extra!", "dir": "Western Ave y Barton Ave", "camino": "≈ 14 min a pie · la más cerca y la más barata, tipo Walmart" },
      { "id": "pv", "nombre": "Pavilions", "dir": "727 N Vine St (Melrose y Vine)", "camino": "≈ 27 min a pie · la más cara" },
      { "id": "tg", "nombre": "Target", "dir": "5500 W Sunset Blvd (Sunset y Western)", "camino": "≈ 28 min a pie · súper y de todo" },
      { "id": "tj", "nombre": "Trader Joe's", "dir": "1600 N Vine St (Sunset y Vine)", "camino": "≈ 47 min a pie o 6 min en Uber · buenos precios, marca propia" }
    ],
    "cercanos": [
      { "nombre": "HK Market", "dir": "124 N Western Ave", "camino": "≈ 12 min a pie · súper asiático, el más cerca" },
      { "nombre": "California Marketplace", "dir": "450 S Western Ave", "camino": "≈ 26 min a pie · súper coreano grande" },
      { "nombre": "Jons Marketplace", "dir": "5315 Santa Monica Blvd", "camino": "≈ 27 min a pie · barato, con productos latinos" },
      { "nombre": "H Mart", "dir": "621 S Western Ave", "camino": "≈ 30 min a pie · súper coreano" },
      { "nombre": "Vons", "dir": "3461 W 3rd St", "camino": "≈ 40 min a pie" },
      { "nombre": "Ralphs", "dir": "3410 W 3rd St", "camino": "≈ 48 min a pie" }
    ],
    "items": [
      { "id": "pan", "nombre": "Pan lactal (20 oz)", "cant": 2, "p": { "pv": 3.99, "sf": 2.79, "tj": 2.99, "tg": 2.99 }, "on": true },
      { "id": "fiambre", "nombre": "Fiambre en fetas, pavo o jamón (16 oz)", "cant": 2, "p": { "pv": 6.99, "sf": 5.49, "tj": 5.49, "tg": 5.99 }, "on": true },
      { "id": "queso", "nombre": "Queso en fetas (12 fetas)", "cant": 2, "p": { "pv": 4.49, "sf": 3.29, "tj": 3.49, "tg": 3.49 }, "on": true },
      { "id": "crema", "nombre": "Queso crema (8 oz)", "cant": 2, "p": { "pv": 3.49, "sf": 2.29, "tj": 2.49, "tg": 2.49 }, "on": true },
      { "id": "pollo", "nombre": "Pollo asado entero (rotisserie)", "cant": 2, "p": { "pv": 9.99, "sf": 7.99, "tj": 8.99, "tg": 8.99 }, "on": true },
      { "id": "papel", "nombre": "Papel higiénico (12 rollos)", "cant": 1, "p": { "pv": 11.99, "sf": 8.99, "tj": 7.99, "tg": 9.99 }, "imp": true, "on": true },
      { "id": "banana", "nombre": "Bananas (por unidad)", "cant": 10, "p": { "pv": 0.35, "sf": 0.25, "tj": 0.25, "tg": 0.27 }, "on": true },
      { "id": "zanahoria", "nombre": "Zanahorias mini (1 lb)", "cant": 2, "p": { "pv": 1.99, "sf": 1.29, "tj": 1.29, "tg": 1.49 }, "on": true },
      { "id": "huevos", "nombre": "Huevos (18)", "cant": 1, "p": { "pv": 6.49, "sf": 4.99, "tj": 4.99, "tg": 5.29 }, "on": true },
      { "id": "mayo", "nombre": "Mayonesa (30 oz)", "cant": 1, "p": { "pv": 6.49, "sf": 4.49, "tj": 3.99, "tg": 4.79 }, "on": true },
      { "id": "leche", "nombre": "Leche (1 galón, 3,8 L)", "cant": 2, "p": { "pv": 4.49, "sf": 3.49, "tj": 3.99, "tg": 3.79 }, "on": true },
      { "id": "jugo", "nombre": "Jugo de naranja (52 oz)", "cant": 2, "p": { "pv": 4.99, "sf": 3.49, "tj": 3.99, "tg": 3.79 }, "on": true },
      { "id": "cereal", "nombre": "Cereal sin azúcar tipo Corn Flakes (18 oz)", "cant": 2, "p": { "pv": 5.49, "sf": 3.49, "tj": 3.49, "tg": 3.79 }, "on": true },
      { "id": "budin", "nombre": "Budín de limón glaseado (14 oz, 8 porciones)", "cant": 2, "p": { "pv": 6.99, "sf": 4.99, "tg": 5.49 }, "on": true }
    ]
  },
  "tiendas": [
    { "id": "bestbuy", "cat": "Tecnología", "nombre": "Best Buy", "sigla": "BB", "color": "#f5d76e", "web": "https://www.bestbuy.com/?intl=nosplash", "buscar": "https://www.bestbuy.com/site/searchpage.jsp?intl=nosplash&st=", "dominios": ["bestbuy.com"] },
    { "id": "apple", "cat": "Tecnología", "nombre": "Apple", "sigla": "AP", "color": "#e9e9e9", "web": "https://www.apple.com/us/", "buscar": "https://www.apple.com/us/search/{q}", "dominios": ["apple.com"], "mapa": "Apple Store near Hollywood, Los Angeles, CA" },
    { "id": "amazon", "cat": "Tecnología", "nombre": "Amazon", "sigla": "AZ", "color": "#ffc285", "web": "https://www.amazon.com/", "buscar": "https://www.amazon.com/s?k=", "dominios": ["amazon.com", "a.co", "amzn.to"], "nota": "Online, con envío a la casa", "online": true },
    { "id": "gamestop", "cat": "Tecnología", "nombre": "GameStop", "sigla": "GS", "color": "#ff9b94", "web": "https://www.gamestop.com/", "buscar": "https://www.gamestop.com/search/?q=", "dominios": ["gamestop.com"] },
    { "id": "guitarcenter", "cat": "Tecnología", "nombre": "Guitar Center", "sigla": "GC", "color": "#c9b6ff", "web": "https://www.guitarcenter.com/", "dominios": ["guitarcenter.com"], "mapa": "Guitar Center Hollywood" },
    { "id": "walmart", "cat": "Súper y de todo", "nombre": "Walmart", "sigla": "WM", "color": "#9ec5ff", "web": "https://www.walmart.com/", "buscar": "https://www.walmart.com/search?q=", "dominios": ["walmart.com", "walmrt.us"] },
    { "id": "target", "cat": "Súper y de todo", "nombre": "Target", "sigla": "TG", "color": "#ff8f87", "web": "https://www.target.com/", "buscar": "https://www.target.com/s?searchTerm=", "dominios": ["target.com"] },
    { "id": "costco", "cat": "Súper y de todo", "nombre": "Costco", "sigla": "CO", "color": "#8fb8f0", "web": "https://www.costco.com/", "buscar": "https://www.costco.com/s?keyword=", "dominios": ["costco.com"], "nota": "Para comprar en el local hay que ser socio" },
    { "id": "nike", "cat": "Ropa y zapatillas", "nombre": "Nike", "sigla": "NK", "color": "#f4f4f4", "web": "https://www.nike.com/", "buscar": "https://www.nike.com/w?q=", "dominios": ["nike.com"] },
    { "id": "adidas", "cat": "Ropa y zapatillas", "nombre": "adidas", "sigla": "AD", "color": "#d4d4d4", "web": "https://www.adidas.com/us", "buscar": "https://www.adidas.com/us/search?q=", "dominios": ["adidas.com"] },
    { "id": "footlocker", "cat": "Ropa y zapatillas", "nombre": "Foot Locker", "sigla": "FL", "color": "#f2b6b6", "web": "https://www.footlocker.com/", "buscar": "https://www.footlocker.com/search?query=", "dominios": ["footlocker.com"] },
    { "id": "ross", "cat": "Ropa y zapatillas", "nombre": "Ross", "sigla": "RS", "color": "#8fd3f5", "web": "https://www.rossstores.com/", "dominios": ["rossstores.com"], "nota": "Marcas a precio de liquidación, sólo en el local" },
    { "id": "tjmaxx", "cat": "Ropa y zapatillas", "nombre": "TJ Maxx", "sigla": "TM", "color": "#f7c1dc", "web": "https://tjmaxx.tjx.com/", "dominios": ["tjmaxx.tjx.com", "tjmaxx.com"], "nota": "Marcas a precio de liquidación" },
    { "id": "marshalls", "cat": "Ropa y zapatillas", "nombre": "Marshalls", "sigla": "MS", "color": "#b4a7f5", "web": "https://www.marshalls.com/", "dominios": ["marshalls.com"], "nota": "Marcas a precio de liquidación" },
    { "id": "nordstromrack", "cat": "Ropa y zapatillas", "nombre": "Nordstrom Rack", "sigla": "NR", "color": "#cfcfcf", "web": "https://www.nordstromrack.com/", "dominios": ["nordstromrack.com"] },
    { "id": "macys", "cat": "Ropa y zapatillas", "nombre": "Macy's", "sigla": "MY", "color": "#f5a0a0", "web": "https://www.macys.com/", "dominios": ["macys.com"] },
    { "id": "levis", "cat": "Ropa y zapatillas", "nombre": "Levi's", "sigla": "LV", "color": "#ffb3ae", "web": "https://www.levi.com/US/en_US/", "dominios": ["levi.com"] },
    { "id": "uniqlo", "cat": "Ropa y zapatillas", "nombre": "Uniqlo", "sigla": "UQ", "color": "#ffb38a", "web": "https://www.uniqlo.com/us/en/", "dominios": ["uniqlo.com"] },
    { "id": "hm", "cat": "Ropa y zapatillas", "nombre": "H&M", "sigla": "HM", "color": "#f28b8b", "web": "https://www2.hm.com/en_us/", "dominios": ["hm.com"] },
    { "id": "zara", "cat": "Ropa y zapatillas", "nombre": "Zara", "sigla": "ZA", "color": "#e0e0e0", "web": "https://www.zara.com/us/", "buscar": "https://www.zara.com/us/en/search?searchTerm=", "dominios": ["zara.com"] },
    { "id": "urban", "cat": "Ropa y zapatillas", "nombre": "Urban Outfitters", "sigla": "UO", "color": "#d9c7a5", "web": "https://www.urbanoutfitters.com/", "dominios": ["urbanoutfitters.com"] },
    { "id": "lululemon", "cat": "Ropa y zapatillas", "nombre": "lululemon", "sigla": "LL", "color": "#f7a8b8", "web": "https://shop.lululemon.com/", "dominios": ["lululemon.com"] },
    { "id": "sephora", "cat": "Belleza y farmacia", "nombre": "Sephora", "sigla": "SE", "color": "#e6e6e6", "web": "https://www.sephora.com/", "buscar": "https://www.sephora.com/search?keyword=", "dominios": ["sephora.com"] },
    { "id": "ulta", "cat": "Belleza y farmacia", "nombre": "Ulta Beauty", "sigla": "UL", "color": "#ffc2a3", "web": "https://www.ulta.com/", "buscar": "https://www.ulta.com/search?search=", "dominios": ["ulta.com"] },
    { "id": "victorias", "cat": "Belleza y farmacia", "nombre": "Victoria's Secret", "sigla": "VS", "color": "#f7c1dc", "web": "https://www.victoriassecret.com/us/", "buscar": "https://www.victoriassecret.com/us/search?q=", "dominios": ["victoriassecret.com"] },
    { "id": "bbw", "cat": "Belleza y farmacia", "nombre": "Bath & Body Works", "sigla": "BW", "color": "#a8d8f0", "web": "https://www.bathandbodyworks.com/", "dominios": ["bathandbodyworks.com"] },
    { "id": "cvs", "cat": "Belleza y farmacia", "nombre": "CVS", "sigla": "CV", "color": "#ff9b94", "web": "https://www.cvs.com/", "dominios": ["cvs.com"] },
    { "id": "walgreens", "cat": "Belleza y farmacia", "nombre": "Walgreens", "sigla": "WG", "color": "#f5a0a0", "web": "https://www.walgreens.com/", "buscar": "https://www.walgreens.com/search/results.jsp?Ntt=", "dominios": ["walgreens.com"] },
    { "id": "citadel", "cat": "Outlets y shoppings", "nombre": "Citadel Outlets", "sigla": "CI", "color": "#f5c96a", "web": "https://www.citadeloutlets.com/", "dominios": ["citadeloutlets.com"], "mapa": "Citadel Outlets, Commerce, CA", "nota": "Outlet al lado de Downtown (Commerce)" },
    { "id": "camarillo", "cat": "Outlets y shoppings", "nombre": "Camarillo Premium Outlets", "sigla": "CP", "color": "#7be0ad", "web": "https://www.premiumoutlets.com/outlet/camarillo", "dominios": ["premiumoutlets.com"], "mapa": "Camarillo Premium Outlets", "nota": "Outlet grande, a 1 h por la 101" },
    { "id": "grove", "cat": "Outlets y shoppings", "nombre": "The Grove", "sigla": "GR", "color": "#9ec5ff", "web": "https://thegrovela.com/", "dominios": ["thegrovela.com"], "mapa": "The Grove, Los Angeles, CA", "nota": "Shopping al aire libre en Fairfax" },
    { "id": "beverly", "cat": "Outlets y shoppings", "nombre": "Beverly Center", "sigla": "BC", "color": "#c9b6ff", "web": "https://www.beverlycenter.com/", "dominios": ["beverlycenter.com"], "mapa": "Beverly Center, Los Angeles, CA" },
    { "id": "disney", "cat": "Recuerdos y otros", "nombre": "Disney Store", "sigla": "DS", "color": "#9ec5ff", "web": "https://www.disneystore.com/", "buscar": "https://www.disneystore.com/search?q=", "dominios": ["disneystore.com", "shopdisney.com"] },
    { "id": "traderjoes", "cat": "Recuerdos y otros", "nombre": "Trader Joe's", "sigla": "TJ", "color": "#ff9b94", "web": "https://www.traderjoes.com/", "dominios": ["traderjoes.com"], "nota": "Las bolsas de tela son un clásico para regalar" },
    { "id": "amoeba", "cat": "Recuerdos y otros", "nombre": "Amoeba Music", "sigla": "AM", "color": "#f5c96a", "web": "https://www.amoeba.com/", "dominios": ["amoeba.com"], "mapa": "Amoeba Music Hollywood", "nota": "Discos y vinilos en Hollywood" },
    { "id": "barnes", "cat": "Recuerdos y otros", "nombre": "Barnes & Noble", "sigla": "BN", "color": "#7be0ad", "web": "https://www.barnesandnoble.com/", "dominios": ["barnesandnoble.com"] }
  ]
};
