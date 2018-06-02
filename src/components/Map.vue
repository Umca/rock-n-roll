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
                @domready="restyle"
                ref="infoWindowRef" 
                :maxWidth = "300"
                :options="infoOptions" 
                :position="infoWindowPos" 
                :opened="infoWinOpen" 
                @closeclick="infoWinOpen = false"
            >
            <div v-html="infoWindowTemplate"></div>
            </gmap-info-window>
        </gmap-map>
    </div>
</template>
<script>
import { gmapApi  } from 'vue2-google-maps'

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
            clickedMarker: undefined,
            infoToEdit: undefined
        }
    },

    computed: {
        google: gmapApi
    },

    mounted(){
        const self = this
        this.$refs.mapRef.$mapPromise.then((map) => {
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.createCustomControl(
                'Click to enable map editing',
                'Add marker',
                function() {
                    this.children[0].innerHTML = "Cancel this mode"
                    self.$parent.$emit('new_markers_mode')
                    document.querySelector(".gm-style:first-of-type > div:nth-child(1)").style.cursor = "crosshair"
                }
            ));

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.createCustomControl(
                'Click to open filters',
                'Filters',
                function() {
                    self.$parent.$emit('filters_toggle')
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

                    this.$parent.$emit('user_position', this.center)

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
                this.$parent.$emit('modal_opened', {
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
            this.$parent.$emit('new_markers_mode')
        },

        toggleInfoWindow (m) {
            this.infoWindowPos = m.position

            this.clickedMarker = m

            this.infoWindowTemplate = `
            <div class="info-content">
                <div class="info-animal-card">
                    <div class="info-animal-card__photo">
                        <img alt='cute' src=${m.info.photo}/>
                    </div>
                    <div class="info-animal-card__info">
                        <div class="string">
                            <div>Nickname: </div>
                            <div>${m.info.nickname ? m.info.nickname : ""}</div>
                        </div>
                        <div class="string">
                            <div>Breed: </div>
                            <div>${m.info.breed}</div>
                        </div>
                        <div class="string">
                            <div>Age: </div>
                            <div>${m.info.age} year</div>
                        </div>
                        <div class="string">
                            <div>Color: </div>
                            <div style="background: ${m.info.color}; content:''; width: 13px; height:13px"></div>
                        </div>
                    </div>
                </div>
                <div class="info-other">
                    <div class='info-head'>
                        <h2>This cute is ${m.info.found ? 'FOUND' : 'LOST'}</h2>
                    </div>
                    <div class="info-main">
                        <p>${!m.info.found ? 'Its parents are waiting for it. If you have some information, please, contact:' : 'Contact me , if you are looking for this cute.' } <br><br><span><b>Name:</b> ${m.info.name}</span><br> <span><b>Tel.:</b> ${m.info.tel}</span> <br>
                         <span>${m.info.email ?  '<b>Email:</b> ' + m.info.email : ""}</span>
                        </p>
                        <button class="info-edit" onclick=${this.editInfo}>Edit</button>
                    </div>
                    <div class='info-foot'>
                        <p>Contact us if you want to help.</p>
                        <p>E-mail: qwerty@gmail.com</p>
                        <p>Tel.: 044 765 999 17</p>
                    </div>
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
        restyle(){
            let iwOuter = document.querySelector('.gm-style-iw')
            var iwBackground = iwOuter.previousSibling
            iwBackground.querySelector(':nth-child(2)').style.display = 'none'
            iwBackground.querySelector(':nth-child(4)').style.display = 'none'

            let iwCloseBtn = iwOuter.nextSibling;
            iwCloseBtn.style.right = '60px'

            let btn = document.querySelector('.info-edit')
            if(!btn.hasListener){
                    btn.addEventListener('click', (e) => {
                    e.target.hasListener = true
                    this.edit()
                })
            }
            

        },

        edit(m){
            this.infoWinOpen = false
            this.$parent.$emit('start_edition', this.clickedMarker)
            this.clickedMarker = undefined
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
    display: grid;
    grid-template-columns: 40% 60%;
    grid-template-rows: 100%;
}
.info-animal-card{
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;
    grid-row-end: 2;
}

.info-animal-card__info{
    padding: 10px;
}

.info-animal-card .string{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 3px 0;
    align-items: center;
}

.info-animal-card__color{
     width: 12px; 
     height:12px; 
     content:"";
     position: absolute;
}

.info-animal-card__photo img{
    width: 100%;
    height: auto;
    
}

.info-other{
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 65px auto 80px;
}

.info-head {
    grid-row-start: 1;
    grid-row-end: 2;
    grid-column-start: 1;
    grid-column-start: 1;
    padding: 2px 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    color: black;
}
.info-main {
    grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 1;
    grid-column-start: 1;
    padding: 5px 16px 20px 16px;
}

.info-main p{
    line-height: 20px;
}

.info-main .info-edit{
    border: none;
    padding: 8px 15px 8px 15px;
    background: #FF8500;
    color: #fff;
    font-size: 16px;
    box-shadow: 1px 1px 4px #DADADA;
    -moz-box-shadow: 1px 1px 4px #DADADA;
    -webkit-box-shadow: 1px 1px 4px #DADADA;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    float: right;
    cursor: pointer;
}

.info-foot {
    grid-row-start: 3;
    grid-row-end: 4;
    grid-column-start: 1;
    grid-column-start: 1;
    padding: 15px 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    color: black;
}

.info-foot p {
    margin: 0;
    line-height: 16px;
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

/* infoWindow styles */
.gm-style-iw {
   width: 450px !important;
   top: 0 !important;
   left: 0 !important;
   border-radius: 2px 2px 0 0;
}
.infoClose{
    opacity: 1;
    right: 38px;
    top: 3px;
}
</style>


