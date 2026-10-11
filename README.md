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
- Después de editar, subir en 1 el número de `"version"` (arriba de todo) para que los celulares avisen que hay una versión nueva.

## Cómo se calcula

- **Recorridos:** rutas reales de OpenStreetMap, con un factor de tráfico de LA según la hora y el día (hora pico de semana ×1,6–1,7).
- **Horarios:** *Llegan* es 20 minutos antes de la actividad (5 si van a pie). *Salen* resta el viaje. *Pedir Uber* resta 7 minutos más de espera del auto. Todo se puede cambiar en **Ajustes**.
- **Precio UberXL:** US$ 9 + US$ 2,10 por milla + US$ 0,90 por minuto (mínimo US$ 24), más US$ 5 en LAX y US$ 3 al salir de Universal. Está calibrado con los precios promedio que publica Uber para rutas de LA (octubre 2026). Encima se suma un 20 % de colchón por tarifa dinámica, ajustable. No incluye propina.
- Los tramos a un lugar **a confirmar** se calculan como un viaje típico de 13 km hasta que se cargue la dirección.
- **Días libres:** sin actividades cargadas, cada día libre se estima con el promedio de un día de agenda en LA (sin los de Disney). En **Presupuesto → Promedios para los días libres** se puede poner otro monto por día.

`viajes-uber-la.xlsx` tiene los mismos viajes en Excel: se puede cambiar el colchón y cargar precios reales, y los totales se recalculan.
