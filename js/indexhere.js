import { initialIcon, currentLocationIcon, ICON_BIKE, ICON_CAR, ICON_FEET, ICON_LOCATION, 
         ICON_COMEBACK, ICON_LOCHISTO, ICON_USERPROFILE } from "./resourceshere.js"

// Manejo del DOM
const btnSetLocation = document.querySelector('button#btnSetLocation')
const btnComeBack = document.querySelector('button#btnComeBack')
const btnLocHisto = document.querySelector('button#btnLocationHistory')
const btnUserProfile = document.querySelector('button#btnUserProfile')
const userProfileDialog = document.querySelector('dialog#userProfileDialog')

// HERE WE GO Map
const appId = 'Zl124spEu1q86x896rk8'
const apiKey = 'tUvsAI7TyZ14Mp4ThrBkmkS1azo0EwOgW6vXwKYEZDc'
const platform = new H.service.Platform({ apikey: apiKey, })
const defaultLayers = platform.createDefaultLayers()

// Setear ícono de botones
btnSetLocation.innerHTML = `<img src="${ICON_LOCATION}">`
btnComeBack.innerHTML = `<img src="${ICON_COMEBACK}">`
btnLocHisto.innerHTML = `<img src="${ICON_LOCHISTO}">`
btnUserProfile.innerHTML = `<img src="${ICON_USERPROFILE}">`

// Lógica

const sourceLat = -34.634932 // (Directorio)
const sourceLng = -58.463960 // (Pje. Italia)

const map = new H.Map(
    document.querySelector("#map"), // Contenedor del mapa
    defaultLayers.vector.normal.map, // Tipo de mapa
    { center: { lat: sourceLat, lng: sourceLng }, zoom: 16, pixelRatio: window.devicePixelRatio || 1, }
)

function showMapArea() {
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
    const ui = H.ui.UI.createDefault(map, defaultLayers)
}

function calculateRoute(slat, slng, clat, clng) {
    const routingService = platform.getRoutingService(null, 8)

    const routingParameters = {
        // mode: 'car', // a pie
        waypoint0: `geo!${slat},${slng}`, // Coordenadas de origen
        waypoint1: `geo!${clat},${clng}`, // Coordenadas de destino
        representation: 'display', // Representación gráfica
    }
    console.table(routingParameters)

    routingService.calculateRoute( // Llamada al servicio de enrutamiento
        routingParameters,
        (result) => {
            if (result.routes.length) {
                const route = result.routes[0]
                const routeShape = route.sections.reduce((shapes, section) => {
                    return shapes.concat(
                        section.shape.map((coord) => {
                            const [slat, slng] = coord.split(',')
                            return { lat: parseFloat(slat), lng: parseFloat(slng) }
                        })
                    );
                }, [])

                // Crear la línea de la ruta
                const routeLine = new H.map.Polyline(
                    new H.geo.LineString(routeShape.map((point) => [clat, clng])),
                    { style: { strokeColor: 'blue', lineWidth: 4 } }
                )

                // Añadir la línea al mapa
                map.addObject(routeLine)

                // Ajustar la vista del mapa
                map.getViewModel().setLookAtData({
                    bounds: routeLine.getBoundingBox(),
                })
            } else {
                console.warn("No se encontraron rutas.")
            }
        },
        (error) => {
            console.error("Error al calcular la ruta:", error)
        }
    )
}


showMapArea() // Función principal

// EVENTS

window.addEventListener('resize', () => map.getViewPort().resize())

btnSetLocation.addEventListener('click', ()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
        const sourceLat = -34.634932
        const sourceLng = -58.463960
        const initialLat = sourceLat
        const initialLng = sourceLng

        const marker = new H.map.Marker({ lat: initialLat, lng: initialLng }, 
                                        { icon: initialIcon })
        map.addObject(marker)

    }, (error)=>  console.log('Error al obtener la ubicación: ', error) )
})

btnComeBack.addEventListener('click', ()=> {
    navigator.geolocation.getCurrentPosition((position)=> {
        const currentLat = position.coords.latitude
        const currentLng = position.coords.longitude

        const marker = new H.map.Marker({ lat: currentLat, lng: currentLng }, 
                                        { icon: currentLocationIcon })
        map.addObject(marker)

        calculateRoute(sourceLat, sourceLng, currentLat, currentLng)

    }, (error)=>  console.log('Error al obtener la ubicación: ', error) )
})
