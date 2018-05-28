<template>
    <div>
        <gmap-map
            ref="mapRef"
            :center="center"
            :options="options"
            style="width: 800px;
                height: 600px;
                margin: 0 auto;
                background: gray;"  
            @click='emitToOpenModal'
            @dragstart="cancelMarkersAdding"    
        >
            <gmap-marker
                v-for="m in markers"
                :key="m.index"
                :position="m.position"
                :icon="m.icon"
                @click="toggleInfoWindow(m)"
            >
            </gmap-marker>
            <gmap-marker
                :position="center"
                title="You are here"

            ></gmap-marker>
            <gmap-info-window 
                :maxWidth = "300"
                :options="infoOptions" 
                :position="infoWindowPos" 
                :opened="infoWinOpen" 
                @closeclick="infoWinOpen=false"
            >
            <div v-html="infoWindowTemplate"></div>
            </gmap-info-window>
        </gmap-map>
    </div>
</template>
<script>
import { EventBus }  from '../utils/eventBus.js'

export default {
    props: ['markers', 'canAddNewMarkers'],
    data() {
        return {
            center: { lat: 50, lng: 30 },
            options: {
                zoom: 10,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
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
        }
    },

    mounted(){
        this.$refs.mapRef.$mapPromise.then((map) => {
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.createCustomControl());
        })
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
                
            } else {
                alert('Geolocation is not supported in your browser!')
            }
        },

        getUserCurrentPosition(){
            return new Promise((resolve, reject ) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
        },

        createCustomControl(){
            let controlDiv = document.createElement('div')

            let controlUI = document.createElement('div');
            controlUI.classList.add('control-ui')
            controlUI.title = 'Click to add marker';
            controlDiv.appendChild(controlUI);

            let controlText = document.createElement('div');
            controlText.id = "controlText"
            controlText.innerHTML = 'Enable marker adding';
            controlUI.appendChild(controlText);

            controlUI.addEventListener('click', function() {
                this.children[0].innerHTML = "Cancel this mode"
                EventBus.$emit('new_markers_mode')
                document.querySelector(".gm-style:first-of-type > div:nth-child(1)").style.cursor = "crosshair"
            });

            return controlDiv

        },

        emitToOpenModal(e){
            if(this.canAddNewMarkers){
                EventBus.$emit('modal_opened', {
                    position: {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    }
                })
                this.cancelMarkersAdding()
            }
            
        },

        cancelMarkersAdding(e){
            document.getElementById('controlText').innerHTML = "Enable marker adding"
            document.querySelector(".gm-style:first-of-type > div:nth-child(1)").style.cursor = 'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default'
            EventBus.$emit('new_markers_mode')
        },

        toggleInfoWindow (m) {
            this.infoWindowPos = m.position;


            this.infoWindowTemplate = `
            <div class="info-content">
                <div class="info-head">
                    <h2>This cute is ${m.info.status}</h2>
                </div>
                <div class="info-main">
                    <div class="info-main__photo">
                        <img alt="cute" src=${m.info.photo} />
                    </div>
                    <div class="info-main__info">
                        <ul>
                            <li>It is the loveliest ${m.info.animal} you have ever seen.</li>
                            <li>${m.info.breed}</li>
                            <li>${m.info.age} year</li>
                            <li>${m.info.color}</li>
                        </ul>
                        <p>Its parents are waiting for it. If you have some information, please, contact <span>${m.info.name}</span>: <span>${m.info.tel}</span></p>
                    </div>
                </div>
                <div class='info-foot'>
                    <p>Contact us if you want to help.</p>
                    <p>E-mail: qwerty@gmail.com</p>
                    <p>Tel.: 044 765 999 17</p>
                </div>
            </div>
            `;

            if (this.currentMidx == m.index) {
              this.infoWinOpen = !this.infoWinOpen;
            } else {
              this.infoWinOpen = true;
              this.currentMidx = m.index;
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

#controlText{
    color: rgb(25,25,25);
    font-family: 'Lato, Arial, sans-serif';
    font-size: 16px;
    line-height: 38px;
    padding-left: 5px;
    padding-right: 5px;
}

.control-ui{
    background:#fff;
    border: 2px solid #fff;
    cursor: pointer;
    margin-bottom: 22px;
    text-align: center;
}
</style>


