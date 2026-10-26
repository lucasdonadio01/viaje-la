window.VIAJE = {
  "version": 4,
  "titulo": "LA 26",
  "subtitulo": "Agenda LBT FACO · Grupo 1",
  "personas": 5,
  "vehiculo": "UberXL",
  "zona": "America/Los_Angeles",
  "ajustes": {
    "colchonMin": 20,
    "esperaUber": 7,
    "margenDinamica": 20,
    "propina": 0,
    "tipoCambio": 0,
    "gastoDiaLibre": null,
    "ubersDiaLibre": 3,
    "viajeLibreMillas": 6,
    "viajeLibreMinutos": 22
  },
  "tarifa": {
    "base": 9,
    "porMilla": 2.1,
    "porMinuto": 0.9,
    "minima": 24,
    "factorXXL": 1.15
  },
  "lugares": {
    "casa": { "nombre": "Casa · Airbnb", "direccion": "517 N Saint Andrews Pl, Los Angeles, CA 90004", "lat": 34.080561, "lng": -118.311263, "sigla": "casa", "color": "#ffffff" },
    "lax": { "nombre": "LAX · Aeropuerto", "direccion": "1 World Way, Los Angeles, CA 90045", "lat": 33.9421675, "lng": -118.4085, "sigla": "LAX", "color": "#f5c96a", "recargo": 5, "nota": "Al llegar, el Uber se toma en LAX-it: salir de la terminal y seguir los carteles verdes al shuttle gratuito." },
    "warner": { "nombre": "Warner Bros. Studio Tour", "direccion": "3400 W Riverside Dr, Burbank, CA 91505", "lat": 34.1510304, "lng": -118.3359075, "sigla": "WB", "color": "#9ec5ff" },
    "grammy": { "nombre": "Grammy Museum", "direccion": "800 W Olympic Blvd, Los Angeles, CA 90015", "lat": 34.0450386, "lng": -118.2652342, "sigla": "GM", "color": "#f5c96a" },
    "chinatown": { "nombre": "Chinatown · Central Plaza", "direccion": "943 N Broadway, Los Angeles, CA 90012", "lat": 34.06565, "lng": -118.23815, "sigla": "CT", "color": "#ff9b8f" },
    "amda": { "nombre": "AMDA College", "direccion": "6305 Yucca St, Los Angeles, CA 90028", "lat": 34.1040952, "lng": -118.3271775, "sigla": "AM", "color": "#c9b6ff" },
    "dolby": { "nombre": "Dolby Theatre · Walk of Fame", "direccion": "6801 Hollywood Blvd, Los Angeles, CA 90028", "lat": 34.1026902, "lng": -118.3404676, "sigla": "DT", "color": "#fbfd78" },
    "pantages": { "nombre": "Hollywood Pantages", "direccion": "6233 Hollywood Blvd, Los Angeles, CA 90028", "lat": 34.1022056, "lng": -118.3257679, "sigla": "PT", "color": "#f7c1dc" },
    "universal": { "nombre": "Universal Studios Hollywood", "direccion": "100 Universal City Plaza, Universal City, CA 91608", "lat": 34.1392322, "lng": -118.3543834, "sigla": "U", "color": "#9ec5ff", "recargoSalida": 3, "nota": "Al salir, el Uber se toma en la zona Uber del estacionamiento Frankenstein (Uber cobra US$ 3 extra)." },
    "intuit": { "nombre": "Intuit Dome · Clippers", "direccion": "3930 W Century Blvd, Inglewood, CA 90303", "lat": 33.9442586, "lng": -118.3421719, "sigla": "ID", "color": "#ff9b8f" },
    "disney": { "nombre": "Disneyland Resort", "direccion": "Harbor Blvd (bajada de Uber), 1313 Disneyland Dr, Anaheim, CA 92802", "lat": 33.8091, "lng": -117.9153, "sigla": "D", "color": "#f7c1dc", "nota": "La bajada de Uber está sobre Harbor Blvd, a 4 min a pie de la entrada." },
    "downtowndisney": { "nombre": "Downtown Disney", "direccion": "1580 S Disneyland Dr, Anaheim, CA 92802", "lat": 33.8090914, "lng": -117.921443, "sigla": "DD", "color": "#c9b6ff" },
    "paramount": { "nombre": "Paramount Pictures", "direccion": "5515 Melrose Ave, Los Angeles, CA 90038", "lat": 34.0836549, "lng": -118.3208, "sigla": "P", "color": "#9ec5ff" },
    "sony": { "nombre": "Sony Pictures Studios", "direccion": "10202 W Washington Blvd, Culver City, CA 90232", "lat": 34.0198913, "lng": -118.400659, "sigla": "S", "color": "#ffffff" },
    "burbank": { "nombre": "Burbank Empire Center · Walmart y Best Buy", "direccion": "1501 N Victory Pl, Burbank, CA 91502", "lat": 34.18851, "lng": -118.32774, "sigla": "BB", "color": "#f5d76e" },
    "griffith": { "nombre": "Observatorio Griffith", "direccion": "2800 E Observatory Rd, Los Angeles, CA 90027", "lat": 34.11838, "lng": -118.30028, "sigla": "GO", "color": "#c9b6ff" },
    "hardrock": { "nombre": "Hard Rock Cafe Hollywood", "direccion": "6801 Hollywood Blvd Suite 105, Los Angeles, CA 90028", "lat": 34.1026902, "lng": -118.3404676, "sigla": "HR", "color": "#ff9b8f" }
  },
  "dias": [
    {
      "fecha": "2026-10-23", "titulo": "Llegada", "inicio": "lax", "fin": "casa", "regresoVehiculo": "UberXXL",
      "actividades": [
        { "id": "d0a1", "nombre": "Salida del aeropuerto", "hora": "15:00", "finHora": "15:00", "lugar": "lax", "aConfirmar": true, "nota": "Poné la hora en que salen de migraciones con las valijas." }
      ]
    },
    { "fecha": "2026-10-24", "titulo": "Libre", "actividades": [] },
    { "fecha": "2026-10-25", "titulo": "Compras", "actividades": [
        { "id": "d25a1", "nombre": "Walmart y Best Buy en Burbank", "hora": "12:00", "finHora": "15:00", "lugar": "burbank", "nota": "Best Buy de 10 a 20 y Walmart de 6 a 23. Pegados al Best Buy: TJ Maxx, Marshalls y Nordstrom Rack." },
        { "id": "d25a2", "nombre": "Observatorio Griffith", "duracion": 180, "lugar": "griffith", "nota": "Entrada gratis, abre de 10 a 22. Atardecer ≈ 18:10. El Uber deja y levanta pasando la entrada en herradura, frente al césped." }
      ] },
    {
      "fecha": "2026-10-26", "agenda": 1, "titulo": "Warner · Grammy · Masterclass",
      "actividades": [
        { "id": "d1a1", "nombre": "Warner Bros Studio Tour VIP", "hora": "09:30", "finHora": "13:30", "antes": 30, "lugar": "warner", "nota": "Studio Tour Plus: llegar 09:00, el tour sale 09:30 en punto. Llevar pasaporte. Incluye snacks en el Deluxe Lounge y el almuerzo en Central Perk. Se pueden sacar fotos, pero no filmar." },
        { "id": "d1a2", "nombre": "Grammy Museum", "hora": "15:00", "finHora": "16:30", "lugar": "grammy", "nota": "Tour guiado de 60 min y después recorrido libre (60 a 90 min en total). Se entra por Figueroa St, al lado de Fleming's Steakhouse." },
        { "id": "d1a3", "nombre": "Recorrido Chinatown", "duracion": 30, "lugar": "chinatown", "llegada": "grupo", "nota": "Después del Grammy, con el grupo. De ahí sale el Uber a la masterclass." },
        { "id": "d1a4", "nombre": "Masterclass · Worldbuilding con Nacho Trossero", "hora": "18:00", "finHora": "20:00", "lugar": null, "aConfirmar": true, "nota": "La agenda nueva no dice dónde es (antes figuraba la visita a AMDA). La hora de fin es aproximada." }
      ]
    },
    {
      "fecha": "2026-10-27", "agenda": 2, "titulo": "Walk of Fame · Workshop · Tommy",
      "actividades": [
        { "id": "d2a1", "nombre": "Walk of Fame + Dolby Theatre Studio Tour", "hora": "09:00", "finHora": "11:00", "lugar": "dolby", "nota": "Dolby: ir directo al Nivel 2 de la entrada principal; los guías tienen las entradas. El grupo se divide en dos: el 1.º entra a las 10:00 y el 2.º a las 10:15. Tour de 30 min, en inglés." },
        { "id": "d2a2", "nombre": "Workshop con especialista de la industria", "hora": "14:00", "finHora": "17:00", "lugar": null, "aConfirmar": true, "nota": "A confirmar con Campanella." },
        { "id": "d2a3", "nombre": "Broadway on tour · The Who's Tommy", "hora": "19:30", "finHora": "22:15", "antes": 30, "lugar": "pantages", "nota": "La función empieza 19:30 en punto en el Hollywood Pantages: estar a las 19:00. Cada uno lleva su entrada, donde figura el asiento." }
      ]
    },
    {
      "fecha": "2026-10-28", "agenda": 3, "titulo": "Universal · NBA",
      "actividades": [
        { "id": "d3a1", "nombre": "Universal Studios + Studio Tour + CityWalk", "hora": "10:00", "finHora": "15:30", "antes": 40, "lugar": "universal", "nota": "Entrada programada a las 10:00: llegar 30 a 45 min antes por los controles. Incluye el Studio Tour en tranvía (≈ 60 min). A las 17:00 hay que estar en el Intuit Dome." },
        { "id": "d3a2", "nombre": "NBA · Clippers vs. Lakers", "hora": "17:00", "finHora": "22:00", "antes": 10, "lugar": "intuit", "nota": "Check-in 17:00 cerca del Modelo Bar (a la izquierda de la plaza). La experiencia Watch the Stars arranca 17:30 y no dejan entrar después de las 17:45. Partido 19:30. Cada adulto con la app Intuit Dome + Clippers y su entrada. No se puede ir con ropa de los Lakers. A la salida suele haber tarifa dinámica: esperar 20–30 min o caminar un par de cuadras ayuda." }
      ]
    },
    {
      "fecha": "2026-10-29", "agenda": 4, "titulo": "Disney Tech · Workshop · Noche libre",
      "actividades": [
        { "id": "d4a1", "nombre": "Technology of Disney Parks Workshop", "hora": "10:00", "finHora": "13:30", "antes": 30, "lugar": "disney", "nota": "El workshop es de 10:30 a 13:30 en Matterhorn & South (a la derecha del castillo, entre el Matterhorn y el castillo). Contacto del día: +1 (714) 781-4132 (decir con qué grupo están)." },
        { "id": "d4a2", "nombre": "Workshop · Trabajo de filmación", "hora": "16:00", "finHora": "18:00", "lugar": null, "aConfirmar": true, "nota": "La agenda no dice dónde es. La hora de fin es aproximada. A la noche, libre." }
      ]
    },
    {
      "fecha": "2026-10-30", "agenda": 5, "titulo": "Paramount · Sony · Hard Rock",
      "actividades": [
        { "id": "d5a1", "nombre": "Paramount Studios VIP Tour", "hora": "09:00", "finHora": "13:30", "lugar": "paramount", "llegada": "pie", "nota": "Queda a 16 min caminando de la casa. Tour VIP de 4,5 h con almuerzo buffet, foto grupal, pósters y 15 % de descuento en la tienda." },
        { "id": "d5a2", "nombre": "Sony Studio Tour", "hora": "15:00", "finHora": "17:00", "antes": 30, "lugar": "sony", "nota": "Llegar 14:30. Tour a pie de 2 h por el estudio, con el Sony Museum y la tienda. Calzado cómodo." },
        { "id": "d5a3", "nombre": "Cena grupal · Hard Rock Cafe", "hora": "20:00", "finHora": "22:00", "lugar": "hardrock", "nota": "Reserva confirmada a las 20:00. Menú Silver: entrada, plato principal, postre y bebida." }
      ]
    },
    {
      "fecha": "2026-10-31", "agenda": 6, "titulo": "Disney · Halloween",
      "actividades": [
        { "id": "d6a1", "nombre": "Immersive Storytelling Disney Workshop", "hora": "09:30", "finHora": "12:30", "lugar": "disney", "nota": "El workshop es de 10:00 a 12:30, a la derecha de la entrada principal de Disney California Adventure." },
        { "id": "d6a2", "nombre": "Disney Theme Parks", "hora": "12:30", "finHora": "21:00", "lugar": "disney", "nota": "La agenda dice 12:00, pero el workshop termina 12:30." },
        { "id": "d6a3", "nombre": "Downtown Disney", "duracion": 90, "lugar": "downtowndisney", "llegada": "pie", "nota": "Sábado de Halloween a la noche: esperen tarifa dinámica alta para la vuelta." }
      ]
    },
    { "fecha": "2026-11-01", "titulo": "Libre", "actividades": [] },
    { "fecha": "2026-11-02", "titulo": "Libre", "actividades": [] },
    { "fecha": "2026-11-03", "titulo": "Libre", "actividades": [] },
    { "fecha": "2026-11-04", "titulo": "Libre", "actividades": [] },
    {
      "fecha": "2026-11-05", "titulo": "Vuelta", "fin": "lax",
      "actividades": [
        { "id": "d9a1", "nombre": "Llegar a LAX (3 h antes del vuelo)", "vehiculo": "UberXXL", "hora": "12:00", "finHora": "12:00", "lugar": "lax", "aConfirmar": true, "nota": "Poné la hora del vuelo menos 3 horas." }
      ]
    }
  ]
};
