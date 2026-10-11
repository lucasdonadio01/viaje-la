window.VIAJE = {
  "version": 2,
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
    "casa": { "nombre": "Casa · Airbnb", "direccion": "5925 Barton Ave, Los Angeles, CA 90038", "lat": 34.088293, "lng": -118.323275, "sigla": "casa", "color": "#ffffff" },
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
    "sony": { "nombre": "Sony Pictures Studios", "direccion": "10202 W Washington Blvd, Culver City, CA 90232", "lat": 34.0198913, "lng": -118.400659, "sigla": "S", "color": "#ffffff" }
  },
  "dias": [
    {
      "fecha": "2026-10-23", "titulo": "Llegada", "inicio": "lax", "fin": "casa", "regresoVehiculo": "UberXXL",
      "actividades": [
        { "id": "d0a1", "nombre": "Salida del aeropuerto", "hora": "15:00", "finHora": "15:00", "lugar": "lax", "aConfirmar": true, "nota": "Poné la hora en que salen de migraciones con las valijas." }
      ]
    },
    { "fecha": "2026-10-24", "titulo": "Libre", "actividades": [] },
    { "fecha": "2026-10-25", "titulo": "Libre", "actividades": [] },
    {
      "fecha": "2026-10-26", "agenda": 1, "titulo": "Warner · Grammy · AMDA",
      "actividades": [
        { "id": "d1a1", "nombre": "Warner Bros Studio Tour VIP", "hora": "09:30", "finHora": "12:30", "lugar": "warner" },
        { "id": "d1a2", "nombre": "Grammy Museum", "hora": "15:00", "finHora": "16:15", "lugar": "grammy" },
        { "id": "d1a3", "nombre": "Recorrido Chinatown", "hora": "16:30", "finHora": "17:00", "lugar": "chinatown", "llegada": "grupo", "nota": "Termina en Chinatown; de ahí sale el Uber a AMDA." },
        { "id": "d1a4", "nombre": "Visit to AMDA University + Workshop", "hora": "18:00", "finHora": "20:30", "lugar": "amda" }
      ]
    },
    {
      "fecha": "2026-10-27", "agenda": 2, "titulo": "Walk of Fame · Workshop · Tommy",
      "actividades": [
        { "id": "d2a1", "nombre": "Walk of Fame + Dolby Theatre Studio Tour", "hora": "09:00", "finHora": "11:30", "lugar": "dolby" },
        { "id": "d2a2", "nombre": "Workshop con especialista de la industria", "hora": "14:00", "finHora": "17:00", "lugar": null, "aConfirmar": true, "nota": "A confirmar con Campanella." },
        { "id": "d2a3", "nombre": "Broadway on tour · The Who's Tommy", "hora": "19:30", "finHora": "22:15", "lugar": "pantages", "nota": "Función 19:30 en el Hollywood Pantages." }
      ]
    },
    {
      "fecha": "2026-10-28", "agenda": 3, "titulo": "Universal · NBA",
      "actividades": [
        { "id": "d3a1", "nombre": "Universal Studios + Studio Tour + CityWalk", "hora": "07:00", "finHora": "16:30", "lugar": "universal" },
        { "id": "d3a2", "nombre": "NBA · Clippers vs. Lakers", "hora": "18:30", "finHora": "22:00", "lugar": "intuit", "nota": "El partido empieza 19:30. A la salida suele haber tarifa dinámica: esperar 20–30 min o caminar un par de cuadras ayuda." }
      ]
    },
    {
      "fecha": "2026-10-29", "agenda": 4, "titulo": "Disney Tech · Amazon · Masterclass",
      "actividades": [
        { "id": "d4a1", "nombre": "Technology of Disney Parks Workshop", "hora": "07:30", "finHora": "14:00", "lugar": "disney" },
        { "id": "d4a2", "nombre": "Workshop con especialistas de Amazon Prime y otras plataformas", "hora": "16:00", "finHora": "18:00", "lugar": null, "aConfirmar": true },
        { "id": "d4a3", "nombre": "Masterclass y posible noche libre", "hora": "20:00", "finHora": "22:00", "lugar": null, "aConfirmar": true, "nota": "La agenda dice \"noche\": la hora es aproximada." }
      ]
    },
    {
      "fecha": "2026-10-30", "agenda": 5, "titulo": "Paramount · Sony · Cena",
      "actividades": [
        { "id": "d5a1", "nombre": "Paramount Studios VIP Tour", "hora": "08:30", "finHora": "13:00", "lugar": "paramount", "llegada": "pie", "nota": "Queda a 8 min caminando de la casa." },
        { "id": "d5a2", "nombre": "Sony Studio Tour", "hora": "15:00", "finHora": "17:30", "lugar": "sony" },
        { "id": "d5a3", "nombre": "Cena grupal", "hora": "20:30", "finHora": "22:30", "lugar": null, "aConfirmar": true }
      ]
    },
    {
      "fecha": "2026-10-31", "agenda": 6, "titulo": "Disney · Halloween",
      "actividades": [
        { "id": "d6a1", "nombre": "Immersive Storytelling Disney Workshop", "hora": "07:30", "finHora": "11:30", "lugar": "disney", "nota": "En Disney California Adventure Park." },
        { "id": "d6a2", "nombre": "Disney Theme Parks", "hora": "12:00", "finHora": "21:00", "lugar": "disney" },
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
