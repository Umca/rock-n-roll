<template>
    <gmap-map
        :center="center"
        :options="options"
        style="width: 800px;
            height: 600px;
            margin: 0 auto;
            background: gray;"  
        @click='emitAddEvent'    
    >
        <gmap-marker
            v-for="m in markers"
            :key="m.index"
            :position="m.position"
            @click="toggleInfoWindow(m)"
        >
    </gmap-marker>
        <gmap-info-window 
            maxWidth = "300"
            :options="infoOptions" 
            :position="infoWindowPos" 
            :opened="infoWinOpen" 
            @closeclick="infoWinOpen=false"
        >
        <div v-html="infoWindowTemplate"></div>
        </gmap-info-window>
    </gmap-map>
</template>
<script>
import { EventBus }  from '../utils/eventBus.js'

export default {
    data() {
        return {
            center: { lat: 50, lng: 30 },
            options: {
                zoom: 10,
            },
            markers: [],

            icons: {
                lost: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                found: 'https://imageshack.com/a/img924/2561/hD8g3T.png'
            },

            infoWindowTemplate : '',
            infoWindowPos: null,
            infoWinOpen: false,
            currentMidx: null,
            infoOptions: {
                pixelOffset: {
                    width: 0,
                    height: -35
                }
            },

            clickedCoord: {
                lat: null,
                lng: null
            },

            information: [
                {
                    index: 0,
                    info : {
                        image: 'https://imageshack.com/a/img921/3331/2pRmDG.jpg',
                        animal: 'cat',
                        breed:'Siamese',
                        age: 1.5,
                        color: 'tabby point',
                        parents: {
                            name: 'Lise',
                            tel: '+38077234431'
                        }
                    }
                }
            ]
        }
    },

    components: {
        
    },

    mounted(){
        this.geolocate()
    },

    methods: {
        async geolocate(){
            if(navigator.geolocation ){
                try {
                    let position = await this.getUserCurrentPosition()
                    this.center.lat = position.coords.latitude
                    this.center.lng = position.coords.longitude

                } catch(e) {
                    alert('We can not get your coords!')
                }
                this.markers.push({index: 0 , position: this.center, clickable: true})
                
            } else {
                alert('Geolocation is not supported in your browser!')
            }
        },

        getUserCurrentPosition(){
            return new Promise((resolve, reject ) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
        },

        emitAddEvent(e){
            EventBus.$emit('map_clicked', {
                ev: 'MAP_CLICKED',
            })
        },

        addMarker(e){
            let position = {}
            position.lat = e.latLng.lat()
            position.lng = e.latLng.lng()
            this.markers.push({
                position, 
                index: 2, 
            })
        },

        toggleInfoWindow (marker) {
            this.infoWindowPos = marker.position;
            
            let m = this.information.filter(o => o.index == marker.index
            )[0]
            

            this.infoWindowTemplate = `
            <div class="info-content">
                <div class="info-head">
                    <h2>This cute is founded</h2>
                </div>
                <div class="info-main">
                    <div class="info-main__photo">
                        <img alt="cuttie" src=${m.info.image} />
                    </div>
                    <div class="info-main__info">
                        <ul>
                            <li>It is the loveliest ${m.info.animal}you have ever seen.</li>
                            <li>${m.info.breed}</li>
                            <li>${m.info.age} year</li>
                            <li>${m.info.color}</li>
                        </ul>
                        <p>Its parents are waiting for it. If you have some information, please, contact <span>${m.info.parents.name}</span>: <span>${m.info.parents.tel}</span></p>
                    </div>
                </div>
                <div class='info-foot'>
                    <p>Contact us if you want to help.</p>
                    <p>E-mail: qwerty@gmail.com</p>
                    <p>Tel.: 044 765 999 17</p>щ
                </div>
            </div>
            `;

            if (this.currentMidx == marker.index) {
              this.infoWinOpen = !this.infoWinOpen;
            } else {
              this.infoWinOpen = true;
              this.currentMidx = marker.index;
            }
          },
    }
}
</script>
<style>
    .info-content {
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    width: 100%;
    font-family: 'Lato', sans-serif;
}

.info-head {
    padding: 2px 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    color: black;
}
.info-main {
    padding: 2px 16px;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 40% 60%;
}
.info-main__photo{
    display: flex;
    justify-items: center;
    align-items: center;
}
.info-main__photo img{
    width: 50%;
    height: auto;
}
.info-main__info{
    padding: 7px 12px;
}
.info-foot {
    padding: 2px 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    color: blck;
}

.info-foot p {
    margin: 0;
}
</style>


