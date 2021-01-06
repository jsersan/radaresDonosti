let mapa;
let markers = [];
var markerInfo;
let fichero = 'https://www.donostia.eus/datosabiertos/recursos/camaras-trafico/camarastraficocas.json';
let data;

window.onload = function() {
    initMap();
    cargarFichero(fichero);
}

function cargarFichero(fichero) {
    let xhr = new XMLHttpRequest();
    let datos;
    xhr.open("GET", fichero, true);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            datos = JSON.parse(this.responseText);
            initMap();
            colocarPines(datos);
            console.log(datos);
        }
    };
    xhr.send();
}

function initMap() {
    const LatLong = {
        lat: 43.3072913,
        lng: -1.9914354
    };
    //console.log(latLng);
    this.mapa = new google.maps.Map(document.getElementById("mapa"), {
        center: LatLong,
        zoom: 14
    });

    return;
}

function colocarPines(data) {
    let lat;
    let lng;
    let nombre;
    let infoWindowActivo;

    /********************** */

    var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    var icons = {
        radar: {
            name: "radar",
            icon: iconBase + "capital_big_highlight.png"
        }
    };

    data.forEach(element => {
        lat = element.Latitud;
        lng = element.Longitud;
        nombre = element.Nombre;
        foto = element.Imagen;

        if (lat != null || lng != null) {
            lat = lat.replace(",", ".");
            lng = lng.replace(",", ".");
        }

        const coordenadas = {
            lat: Number(lat),
            lng: Number(lng),
        };

        let icono = icons[coordenadas.tipo];
        if (icono !== undefined) {
            icono = icono.icon;
        }
        let marker = new google.maps.Marker({
            position: coordenadas,
            map: this.mapa,
            icon: icono,
        });
        markers.push(marker);

        let infoWindow = crearInfoWindow(
            nombre, foto
        );

        marker.addListener("click", () => {
            if (infoWindowActivo) {
                infoWindowActivo.close();
            }

            infoWindow.open(this.mapa, marker);
            infoWindowActivo = infoWindow;
        });
    });

    return;
}

function crearInfoWindow(nombre, foto) {
    console.log(foto);
    console.log(foto.substring(0, 4));

    console.log(`${nombre}`);

    if (foto.substring(0, 4) == 'http') {
        console.log(`${nombre}`);


        //<img src="" alt="">
        markerInfo = `<h1>${nombre}</h1> 
                      <img src="${foto}" 
                       height="200" width="300"/>`;
    } else {
        markerInfo = `<h1>${nombre}</h1> 
        <img src="img/nodisponible.jpg" 
         height="200" width="300"/>`;
    }

    console.log(markerInfo);

    infoWindow = new google.maps.InfoWindow({
        content: markerInfo
    });

    return infoWindow;
}