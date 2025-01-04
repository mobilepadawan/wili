import { currentIcon, initialIcon, ICON_BIKE, ICON_CAR, ICON_FEET, 
         ICON_LOCATION, ICON_COMEBACK, ICON_LOCHISTO, ICON_USERPROFILE,
        saveInitialLocation, returnInitialLocation } from "./resources.js"

// Manejo del DOM
const btnSetLocation = document.querySelector('button#btnSetLocation')
const btnComeBack = document.querySelector('button#btnComeBack')
const btnLocHisto = document.querySelector('button#btnLocationHistory')
const btnUserProfile = document.querySelector('button#btnUserProfile')

const userProfileDialog = document.querySelector('dialog#userProfileDialog')

// Setear ícono de botones
btnSetLocation.innerHTML = `<img src="${ICON_LOCATION}">`
btnComeBack.innerHTML = `<img src="${ICON_COMEBACK}">`
btnLocHisto.innerHTML = `<img src="${ICON_LOCHISTO}">`
btnUserProfile.innerHTML = `<img src="${ICON_USERPROFILE}">`

/*
    // User coords (hardcoded just for Developer purposes)
    const userLat = -34.636638
    const userLng = -58.467178
    // Destination point
    const destinationLat = -34.634932
    const destinationLng = -58.463960
*/

const sourceLat = -34.634932
const sourceLng = -58.463960

const map = L.map('map').setView([sourceLat, sourceLng], 16) // Mapa centrado

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap and https://ferpro.online/',
    minZoom: 5,
    maxZoom: 19,
    scrollWheelZoom: true,
    scale: 'metric',
    language: 'es',
    // enableHighAccuracy: true,
    animate: true,
    duration: 0.55,
    // attribution: false,
}).addTo(map)

// EVENTOS
// document.addEventListener('contextmenu', (e)=> e.preventDefault())

btnSetLocation.addEventListener('click', ()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
        // const initialLat = position.coords.latitude
        // const initialLng = position.coords.longitude
        const sourceLat = -34.634932 // (Directorio)
        const sourceLng = -58.463960 // (Pje. Italia)
        // const sourceLat = -34.632065
        // const sourceLng = -58.468770
        const initialLat = sourceLat
        const initialLng = sourceLng

        saveInitialLocation(initialLat, initialLng)
        const userMarker = L.marker([initialLat, initialLng],
            { icon: initialIcon })
            .addTo(map)
            .bindPopup('Tu vehículo')

    }, (error)=>  console.log('Error al obtener la ubicación: ', error) )
})

btnComeBack.addEventListener('click', ()=> {
    const initialLocation = returnInitialLocation()

    if (initialLocation !== undefined) {
        navigator.geolocation.getCurrentPosition((position)=> {
            const currentLat = position.coords.latitude
            const currentLng = position.coords.longitude

            L.marker([currentLat, currentLng], { icon: currentIcon }).addTo(map).bindPopup('Tú')

            map.fitBounds([[currentLat, currentLng], [initialLocation.lat, initialLocation.lng]])
            
            L.Routing.control({
                waypoints: [ L.latLng(initialLocation.lat, initialLocation.lng),
                             L.latLng(currentLat, currentLng) ],
                             router: L.Routing.osrmv1({
                                routeOptions: { profile: 'foot', 
                                                alternatives: false, 
                                                language: 'es' 
                                            },
                             }),
                createMarker: ()=> null,
                lineOptions: { styles: [{ weight: 5, opacity: 0.8 }] }
            }).addTo(map)
            .on('routesfound', (e)=> console.log(e.routes[0]) )

            // let distance = map.distance([initialLocation.lat, initialLocation.lng], [currentLat, currentLng] )
            // console.log(distance)


        }, (error)=>  console.log('Error al obtener la ubicación: ', error))
    }
})

btnUserProfile.addEventListener('click', ()=> {
    userProfileDialog.showModal()
    userProfileDialog.querySelector('button#btnClose')
                     .addEventListener('click', ()=> userProfileDialog.close() )
} )

document.querySelector('div.userVehiclePreference').addEventListener('click', (e)=> {
    const buttons = document.querySelectorAll('div.userVehiclePreference div button')
    console.log(buttons.length)
    buttons.length > 0 && buttons.forEach((btn)=> btn.style.backgroundColor = '' )
    e.target.style.backgroundColor = '#6bd553'
})