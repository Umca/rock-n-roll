<template>
    <div>
        <gmap-map
            ref="mapRef"
            :center="center"
            :options="options"
            style="width: 800px;
                height: 670px;
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
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.createCustomControl(
                'Click to enable map editing',
                'Add marker',
                function() {
                    this.children[0].innerHTML = "Cancel this mode"
                    EventBus.$emit('new_markers_mode')
                    document.querySelector(".gm-style:first-of-type > div:nth-child(1)").style.cursor = "crosshair"
                }
            ));

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.createCustomControl(
                'Click to open filters',
                'Filters',
                function() {
                    EventBus.$emit('filters_toggle')
                    document.querySelector('.controlUIImg').style.backgroundImage = "url(https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/cross-24-512.png)"
                },
                true
            ));
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

                    EventBus.$emit('user_position', this.center)

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

        createCustomControl(title, text, cb, noText = false){
            let controlDiv = document.createElement('div')

            let controlUI = document.createElement('div');
            controlUI.classList.add('controlUI')
            controlUI.title = title;
            controlDiv.appendChild(controlUI);

            if(noText){
                controlUI.classList.add('controlUIImg')
            } else {
                controlUI.classList.add('controlUIText')
                let controlText = document.createElement('div');
                controlText.innerHTML = text;
                controlUI.appendChild(controlText);
            }
            
            controlUI.addEventListener('click', cb);

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
            document.querySelector('.controlUIText').children[0].innerHTML = "Add marker"
            document.querySelector(".gm-style:first-of-type > div:nth-child(1)").style.cursor = 'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default'
            EventBus.$emit('new_markers_mode')
        },

        toggleInfoWindow (m) {
            this.infoWindowPos = m.position;


            this.infoWindowTemplate = `
            <div class="info-content">
                <div class="info-head">
                    <h2>This cute is ${m.info.found}</h2>
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

.controlUI{
    background:#fff;
    border: 2px solid #fff;
    cursor: pointer;
    text-align: center;
    border-radius: 3px;
    -webkit-box-shadow: 2px 0px 8px 0px rgba(167, 167, 167, 0.75);
    -moz-box-shadow:    2px 0px 8px 0px rgba(167, 167, 167, 0.75);
    box-shadow:         2px 0px 8px 0px rgba(167, 167, 167, 0.75);
}

.controlUIImg{
    background: white url(https://cdn.icon-icons.com/icons2/621/PNG/128/magnifier-tool_icon-icons.com_56918.png) no-repeat;
    background-size: 20px;
    background-position: 50% 50%;
    padding: 20px 45px;
}

.controlUIText{
    font-family: 'Lato', 'Arial', sans-serif;
    padding: 10px 7px;
    font-size: 20px;
}

.vue-map-container .vue-map{
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    z-index: 999;
}
</style>


