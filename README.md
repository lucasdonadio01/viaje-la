# LA 26 · Ubers

Agenda del viaje a Los Ángeles (23/10 al 5/11/2026) con los traslados de cada día: a qué hora pedir el Uber, a qué hora llegan, cuánto sale (UberXL, 5 personas) y el presupuesto total y por persona.

## Publicarla en GitHub Pages

1. En GitHub (cuenta `lucasdonadio01`) crear un repositorio nuevo, por ejemplo `viaje-la`.
2. Subir todos los archivos de esta carpeta (**Add file → Upload files**).
3. Ir a **Settings → Pages**, elegir **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guardar.
4. En un par de minutos queda en `https://lucasdonadio01.github.io/viaje-la/`.

Para que las chicas puedan editar: **Settings → Collaborators → Add people**.

> Ojo: en un repositorio público cualquiera puede ver la dirección del Airbnb y las fechas. Si prefieren, borren el número de la calle en `datos.js` (el mapa usa las coordenadas igual).

## En el celular

- Abrir el link en Chrome (Android) o Safari (iPhone) y elegir **Agregar a pantalla de inicio**.
- Con wifi, entrar a **ⓘ → Descargar mapas** (unos 5 MB): después la agenda, los horarios, los precios y el mapa funcionan sin internet.
- **Abrir Uber** abre la app con el origen y el destino ya cargados. **Maps** abre la ruta en Google Maps.
- En **Mapa**, las tarjetas de abajo se deslizan: cada una muestra la actividad, a qué hora pedir el Uber y cuánto sale, y la marca en el mapa.

## Presupuestos: cada uno el suyo

En **Presupuestos** (la cuarta pestaña en el celular, o el botón de arriba a la derecha en la compu) cada uno arma su presupuesto del viaje: <https://lucasdonadio01.github.io/viaje-la/presupuesto/>

- **Agregar mi presupuesto:** nombre y cuánta plata llevás. Arranca con los gastos del grupo (tu parte del Uber según la agenda, Horror Nights, la eSIM, la comida, los snacks de *Morfando en LA* y el súper), y todo se puede apagar, cambiar o borrar.
- **Compras:** *Agregar algo para comprar* → elegís la tienda (Best Buy, Walmart, Target, Costco, Apple, Amazon, Nike, Ross, TJ Maxx, Sephora, outlets…) y anotás el precio. Si pegás el link del producto se completan solos la tienda y el nombre (y la foto, en Best Buy). Los botones de búsqueda abren la tienda o Google Shopping para ver el precio.
- Los precios de las etiquetas no incluyen el impuesto de venta: se suma aparte (10,25 % en casi todo LA desde el 1/10/2026). Si las compras pasan la franquicia de US$ 500, avisa cuánto se paga en Ezeiza.
- Cada presupuesto queda guardado **en el celular de cada uno**. **Compartir resumen** manda el total y la lista de compras al grupo; **Guardar copia / Cargar copia** lo pasa a otro dispositivo.
- Los valores iniciales están en `presupuesto/datos.js`: la plantilla, el presupuesto de Lucas, el súper y la lista de tiendas con sus links de búsqueda. Lo que se cambie ahí lo ven quienes entran por primera vez o tocan *Volver a los valores iniciales*. Para sumarle algo nuevo a una lista que ya está guardada en un celular, agregalo con `"desde": N`, subí `"version"` a N y cambiá el `?v=` de los archivos en `presupuesto/index.html`: aparece en esa lista sin borrar nada de lo que la persona cambió. Para sacar algo, borralo de la lista y anotá su `id` en `"quitados"` con el número de versión (por ejemplo `"samba": 3`).

## Cambiar algo del itinerario

**Desde la web:** con **+ Parada**, el lápiz de cada actividad o el buscador de arriba. Esos cambios quedan guardados sólo en ese dispositivo. Para compartirlos: **Ajustes → Descargar datos.js** y subir ese archivo al repositorio, reemplazando el anterior.

**Desde GitHub:** editar `datos.js` (lápiz ✏️ en GitHub). Cada actividad se ve así:

```js
{ "id": "d2a2", "nombre": "Workshop con especialista", "hora": "14:00", "finHora": "17:00", "lugar": "warner" }
```

- `lugar` es una clave de la lista `lugares` (arriba en el mismo archivo) o un lugar nuevo: `{ "nombre": "...", "direccion": "...", "lat": 34.1, "lng": -118.3 }`.
- Sin `hora` y con `"duracion": 45` es una parada **de corrido** (van directo desde lo anterior).
- `"llegada": "pie"` o `"llegada": "grupo"` si no van en Uber.
- `"precioReal": 48` reemplaza la estimación con el precio que mostró la app.
- `"vehiculo": "UberXXL"` en una actividad (o `"regresoVehiculo"` en el día) cambia el tipo de Uber de ese viaje.
- Después de editar, subir en 1 el número de `"version"` (arriba de todo) para que los celulares avisen que hay una versión nueva.

## Cómo se calcula

- **Recorridos:** rutas reales de OpenStreetMap, con un factor de tráfico de LA según la hora y el día (hora pico de semana ×1,6–1,7).
- **Horarios:** *Llegan* es 20 minutos antes de la actividad (5 si van a pie). *Salen* resta el viaje. *Pedir Uber* resta 7 minutos más de espera del auto. Todo se puede cambiar en **Ajustes**.
- **Precio UberXL:** US$ 9 + US$ 2,10 por milla + US$ 0,90 por minuto (mínimo US$ 24), más US$ 5 en LAX y US$ 3 al salir de Universal. Está calibrado con los precios promedio que publica Uber para rutas de LA (octubre 2026). Encima se suma un 20 % de colchón por tarifa dinámica, ajustable. No incluye propina.
- **Aeropuerto:** la llegada (23/10) y la ida a LAX (5/11) van en **UberXXL**, que asegura lugar para las valijas: se calcula 15 % más caro que el XL, según los precios que publica Uber para rutas desde LAX.
- Los tramos a un lugar **a confirmar** se calculan como un viaje típico de 13 km hasta que se cargue la dirección.
- **Días libres:** sin actividades cargadas, cada día libre se estima como un día típico de 2 lugares: 3 Ubers de unos 10 km (≈ US$ 50 cada uno con el colchón). En **Presupuesto → Días libres** se cambia la cantidad de Ubers o se pone un monto fijo.

`viajes-uber-la.xlsx` tiene los mismos viajes en Excel: se puede cambiar el colchón y cargar precios reales, y los totales se recalculan.
