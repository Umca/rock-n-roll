class Filter{
    constructor() {
        this.earthR = 6371
    }

    filter(arr, filterObj, userCoords) {
        let { param } = filterObj

        let result = this[`${param}Filter`](arr, filterObj.value, userCoords)

        return result
    }

    animalFilter(arr, val) {
        return arr.filter(i => i.info.animal === val)
    }

    breedFilter(arr, val) {
    	return arr.filter(i => i.info.breed === val)
    }

    colorFilter() {
        
    }

    ageFilter(arr, val) {
        return arr.filter(i => i.info.age === val)
    }

    foundFilter(arr, val) {
        return arr.filter(i => i.info.found === val)
    }

    radiusFilter(arr, val, userCoords) {
        debugger
        let userRad = {}
        userRad.lat = this.degToRadians(userCoords.lat)
        userRad.lng = this.degToRadians(userCoords.lng)

        arr.filter(i => { 
            let d = this.calcDistance(userRad, i.position)
            return val < d
        })
    }

    calcDistance(userRad, val) {

        let valRad = {}
        valRad.lat = this.degToRadians(val.lat)
        valRad.lng = this.degToRadians(val.lng)

        let latDelta = Math.abs(userRad.lat - valRad.lat)
        let lngDelta = Math.abs(userRad.lng - valRad.lng)

        let deltaQ = Math.acos(Math.sin(userRad.lat) * Math.sin(valRad.lat) + Math.cos(userRad.lng) * Math.cos(valRad.lng) * Math.cos(lngDelta))

        return deltaQ * this.earthR
    
    }

    degToRadians(deg) {
        return deg * Math.PI / 180
    }

}

export { Filter }