export const currentIcon = L.icon({ // User location Icon
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/709/709699.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
})

export const initialIcon = L.icon({ // Destination custom Icon
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png',
    // iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -40]
})

export function addUserProfileDialog() {
    return `<dialog>
                <div class="header">
                    <h1>Perfil de usuario</h1>
                    <button id="btnClose">X</button>
                </div>
            </dialog>`
}

export function saveInitialLocation(lat, lng) {
    if (lat && lng) {
        localStorage.setItem('initialLocation', `{ "lat": "${lat}", "lng": "${lng}" }`)
    }
}

export function returnInitialLocation() {
    if (localStorage.initialLocation) {
        return JSON.parse(localStorage.getItem('initialLocation'))
    } else {
        return undefined
    }
}

export const ICON_FEET = 'https://cdn-icons-png.flaticon.com/512/9069/9069966.png'
export const ICON_BIKE = 'https://cdn-icons-png.flaticon.com/512/732/732944.png'
export const ICON_CAR = 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png'

export const ICON_LOCATION = './images/vehicle-location.png'
export const ICON_COMEBACK = './images/come-back.png'
export const ICON_LOCHISTO = './images/locations-history.png'
export const ICON_USERPROFILE = './images/user-profile.png'