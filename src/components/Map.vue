<template>
    <div :id = "mapId"></div>
</template>
<script>
// import API_KEYS from '../utils/constants'
import InfoWindow from './InfoWindow'

export default {
    data() {
        return {
            mapId: 'google-map',
            map: null,
            userCoords: {
                lat: 50,
                lng: 30
            },
            icons: {
                lost: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                found: 'https://imageshack.com/a/img924/2561/hD8g3T.png'
            },
            markers: []
        }
    },

    components : {
        'info-window': InfoWindow
    },

    mounted() {
        // this.createAndAddScript()
        this.initMap()
        console.log(this)
    },

    methods: {

        createAndAddScript(){
            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}`
            script.async = true
            script.defer = true
            document.getElementsByTagName('head')[0].appendChild(script)
        },

        async initMap(){
            const element = document.getElementById(this.mapId)

            if(navigator.geolocation ){
                try {
                    let position = await this.getUserCurrentPosition()
                    this.userCoords.lat = position.coords.latitude
                    this.userCoords.lng = position.coords.longitude

                } catch(e) {
                    alert('We can not get your coords!')
                }
                
            } else {
                alert('Geolocation is not supported in your browser!')
            }

            const options = {
                zoom: 10,
                center: new google.maps.LatLng(this.userCoords.lat, this.userCoords.lng),
                fullscreenControl: false
            }
            this.map = new google.maps.Map(element, options);

            this.addMarkerItem()

        },

        getUserCurrentPosition(){
            return new Promise((resolve, reject ) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
        },

        addMarkerItem(){
            const item = {}

            item.marker = this.addMarker({
                icon: null,
                title: 'You`re here.',
                coords: this.userCoords
            })
            item.info = this.addInfoWindow()

            item.marker.addListener('click', () => {
                item.info.open(this.map, item.marker)
            })

            this.markers.push(item)
        },

        addMarker({icon, title, coords}){
            return new google.maps.Marker({
                position: coords,
                title: title,
                icon: icon,
                map: this.map
            })
        },

        addInfoWindow(content){
            return  new  google.maps.InfoWindow({
            content: '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>'
            });
        },

        addMarkerListener(){
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            })
        }

    }
}
</script>
<style>
    #google-map {
        width: 800px;
        height: 600px;
        margin: 0 auto;
        background: gray;
    }
</style>


