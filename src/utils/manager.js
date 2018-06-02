import API_KEYS from './constants'

let setUp = false

const load = new Promise((resolve, reject) => {
        if (typeof document === 'undefined') {
        	return
        }
        if (!setUp) {
        	const googleMapScript = document.createElement('SCRIPT')

        	let url = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}&language=en&region=GB`

        	googleMapScript.setAttribute('src', url)
        	googleMapScript.setAttribute('async', true)
            googleMapScript.setAttribute('defer', '')
            
            googleMapScript.onload = () => {
                window.google = google
                resolve()
            }
            // googleMapScript.onerror = reject()

        	document.head.appendChild(googleMapScript)

        } else {
        	throw new Error('You already started the loading of google maps')
        }
})

export { load }


