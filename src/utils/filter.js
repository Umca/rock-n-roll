class Filter{
    constructor() {
        this.earthR = 6371
    }

    filter(arr, filterObj, userCoords) {
        let { param } = filterObj

        if(!filterObj.value) return arr

        let result = this[`${param}Filter`](arr, filterObj.value, userCoords)

        return result
    }

    animalFilter(arr, val) {
        if(val === 'all'){
            return arr
        }
        return arr.filter(i => i.info.animal === val)
    }

    chosenBreedFilter(arr, val) {
        return arr.filter(i => i.info.breed.indexOf(val) > -1)
    }

    colorFilter(arr, val) {
        let mainRgb = this.hexToRgb(val)

        return arr.filter(item => {
            let fi = this.calcFi(mainRgb, item.info.color)

            return fi < 400000
        })
    }

    ageFilter(arr, val) {
        return arr.filter(i => i.info.age === val)
    }

    statusFilter(arr, val) {
        if(val === 'all') return arr
    
        return arr.filter(i => {
            if(val === 'found') return i.info.found
            if(val === 'lost') return !i.info.found
            
        })
    }

    nicknameFilter(arr, val){
        return arr.filter(item => item.info.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1)
    }

    radiusFilter(arr, val, userCoords) {

        let userRad = {}
        userRad.lat = this.degToRadians(userCoords.lat)
        userRad.lng = this.degToRadians(userCoords.lng)


        return arr.filter(item => { 
            let d = this.calcDistance(userRad, item.position)
    
            return parseFloat(val) >= d
        })
    }

    calcDistance(userRad, val) {

        let valRad = {}
        valRad.lat = this.degToRadians(val.lat)
        valRad.lng = this.degToRadians(val.lng)

        let latDelta = Math.abs(userRad.lat - valRad.lat)
        let lngDelta = Math.abs(userRad.lng - valRad.lng)

        let deltaQ = Math.acos(Math.sin(userRad.lat) * Math.sin(valRad.lat) + Math.cos(userRad.lat) * Math.cos(valRad.lat) * Math.cos(lngDelta))

        return deltaQ * this.earthR
    
    }

    degToRadians(deg) {
        return deg * Math.PI / 180
    }

    hexToRgb(hex){
        let color = {}
        hex = hex.replace('#','');
        color.r = parseInt(hex.substring(0,2), 16);
        color.g = parseInt(hex.substring(2,4), 16);
        color.b = parseInt(hex.substring(4,6), 16);

        return color
    }

    calcFi(mainColorRgb, otherColor){
        let otherRgb = this.hexToRgb(otherColor)

        return 30*Math.pow((otherRgb.r-mainColorRgb.r),2)+59*Math.pow((otherRgb.g-mainColorRgb.g),2)+11*Math.pow((otherRgb.b-mainColorRgb.b),2)
    }

}

export { Filter }