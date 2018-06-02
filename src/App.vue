<template>
    <div style="position: relative; width: 800px; margin: auto; ">
        <filter-component :isShown = 'filtersOpened'></filter-component>
        <google-map :markers='filtered' :canAddNewMarkers="canAddNewMarkers" :statusText="statusText"></google-map>
        <modal-window 
            :isShown = 'modalOpened' 
            :info="infoToEdit" 
            :markerInfo='markerInfo' 
            :breeds="breeds"
            :filterBreeds="filterBreeds"
            :handleBreedOption="handleBreedOption"
            :mode="mode"
        ></modal-window>
    </div>
</template>

<script>

import Map from './components/Map'
import Modal from './components/Modal'
import Filters from './components/Filters'
import { Filter } from './utils/filter'
import { cats, dogs, birds } from './utils/data'

export default {
    data(){
        return {
            indexCounter: 6,
            icons: {
                lost: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                found: 'https://imageshack.com/a/img924/2561/hD8g3T.png'
            },
            modalOpened: false,
            filtersOpened: false,
            markers: [
                {
                    index: 1,
                    position: {
                        lat: 50.451904988707426,
                        lng: 30.365139904949842
                    },
                    icon: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                    info: {
                        found: false,
                        photo: "https://i.imgur.com/Qha68YE.jpg",
                        animal: 'cat',
                        color: '#2d292b',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        nickname: 'Black',
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 2,
                    position: {
                        lat: 50.46982699187444,
                        lng: 30.366856518719374
                    },
                    icon: 'https://imageshack.com/a/img924/2561/hD8g3T.png',
                    info: {
                        found: true,
                        photo: "https://i.imgur.com/oaHmbG7.jpg",
                        animal: 'dog',
                        color: '#191216',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        nickname: 'zaya',
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 3,
                    position: {
                        lat: 50.43259536449169,
                        lng: 30.35317987194628
                    },
                    icon: 'https://imageshack.com/a/img924/2561/hD8g3T.png',
                    info: {
                        found: true,
                        photo: "https://i.imgur.com/oaHmbG7.jpg",
                        animal: 'dog',
                        color: '#bf2f81',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        nickname: '',
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 4,
                    position: {
                        lat: 50.42160419408208,
                        lng: 30.274702976143203
                    },
                    icon: 'https://imageshack.com/a/img924/2561/hD8g3T.png',
                    info: {
                        found: true,
                        photo: "https://i.imgur.com/oaHmbG7.jpg",
                        animal: 'cat',
                        color: 'black',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        nickname: '',
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 5,
                    position: {
                        lat: 50.5418,
                        lng: 30.4121
                    },
                    icon: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                    info: {
                        found: false,
                        photo: "https://i.imgur.com/oaHmbG7.jpg",
                        animal: 'dog',
                        color: 'black',
                        age: 1,
                        breed: "barbet",
                        name: "olya",
                        nickname: 'smith',
                        email: "fhkfjhf@jfjk"
                    }
                }
            ],

            canAddNewMarkers: false,

            newMarker: {
                position: {}
            },

            filtered: [],

            userCoords: {},

            infoToEdit: undefined,

            types: {
                cats,
                dogs,
                birds
            },
            options: ['cat', 'dog', 'bird'],

            markerInfo: {
                nickname: '',
                color: "#f210f8",
                age: '',
                name: '',
                email: '',
                tel: '',
                photo: '',
                found: false,
                animal: '',
                breed:'',
                filteredBr: [],
                toDelete: false
            },

            mode: 'new',

            markerIndexToOp: undefined,
        }
    },

    components: {
        'google-map': Map,
        'modal-window': Modal,
        'filter-component': Filters
    },

    computed:{
        statusText(){
            if(this.found){
                return 'Found'
            } else {
                return 'Lost'
            }
        },
        breeds(){
            if(this.markerInfo.animal && (this.markerInfo.filteredBr.length  == 0)){
                return this.types[`${this.markerInfo.animal.toLowerCase()}s`]
            } else {
                if(this.markerInfo.filteredBr.length === 0) return []
                if(this.markerInfo.filteredBr.length > 0){
                    return this.markerInfo.filteredBr
                } else {
                    return this.types[`${this.markerInfo.animal.toLowerCase()}s`]
                }
            }

        }

    },

    watch: {
        markers(newValue, oldValue) {
            this.filtered = newValue
        }
    },

    created(){
        this.getFromLocalStorage()
    },

    mounted(){

        this.filtered = JSON.parse(JSON.stringify(this.markers))

        this.filterFab = new Filter()

        this.$on('modal_opened', (ev) => {
            this.newMarker.position = ev.position
            this.openModal()
        })

        this.$on('modal_closed', () => {
            this.mode = 'new'
            this.closeModal()
            this.cleanInfoMarkerState()
        })

        this.$on('new_marker', () => {
            this.closeModal()
            this.addNewMarker()
            this.cleanInfoMarkerState()

            this.putToLocalStorage()
        })

        this.$on('edit_marker', () => {
            this.closeModal()

            if(this.markerInfo.toDelete){
                this.deleteMarker()
                return
            }

            let toEdit = this.markers.filter( m => m.index === this.markerIndexToOp)[0]
            Object.keys(this.markerInfo).forEach(key => toEdit.info[key] = this.markerInfo[key])
            
            this.cleanInfoMarkerState()
        })

        this.$on('user_position', (ev) => {
            this.userCoords.lat = ev.lat
            this.userCoords.lng = ev.lng
        })

        this.$on('new_markers_mode', () => this.toggleAddMarkersMode())

        this.$on('filters_toggle', () => this.toggleFilters())

        this.$on('filter_apply', (ev) => {
            this.userCoords.lat = 50.4514007
            this.userCoords.lng = 30.352864900000004

            this.filtered = this.filterFn(this.markers, ev)
        })

        this.$on('start_edition', (ev) => {
            this.mode = 'edit'
            this.markerIndexToOp = ev.index


            Object.keys(ev.info).forEach(key => {
                this.markerInfo[key] = ev.info[key]
            })

            this.openModal()
        })
    },

    beforeUpdate(){
        if(document.querySelector('.controlUIImg')){
            if(!this.filtersOpened ) document.querySelector('.controlUIImg').style.backgroundImage = "url(https://cdn.icon-icons.com/icons2/621/PNG/128/magnifier-tool_icon-icons.com_56918.png)" 
            if(this.filtersOpened) document.querySelector('.controlUIImg').style.backgroundImage = "url(https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/cross-24-512.png)"
        }
    },

    methods: {
        openModal(){
            this.modalOpened = true
        },

        closeModal(){
            this.modalOpened = false
        },

        toggleFilters(){
            this.filtersOpened = !this.filtersOpened
        },

        toggleAddMarkersMode(){
            this.canAddNewMarkers = !this.canAddNewMarkers
        },

        addNewMarker(){
            this.newMarker.info ={}

            let fields = ['photo', 'animal', 'breed', 'age', 'color', 'name', 'tel', 'email', 'found','nickname']
            fields.forEach(fl => {
                this.newMarker.info[fl] = this.markerInfo[fl]
            })

            this.newMarker.icon = this.icons[`${this.newMarker.info.found ? 'found' : 'lost'}`]
            this.newMarker.index = this.indexCounter

            this.markers.push(this.newMarker)

            this.indexCounter++

            this.newMarker = {}
            this.newMarker.position = {}
        },

        deleteMarker(){
            for(let i = 0 ; i < this.markers.length ; i++){
                if(this.markers[i].index === this.markerIndexToOp){
                    let newOne = [...this.markers.slice(0 , i), ...this.markers.slice(i+1)]
                    this.markers = newOne
                    this.putToLocalStorage()
                    this.cleanInfoMarkerState()
                    return
                }
            }
        },

        filterFn(arr, filterObj){
            if(!Object.keys(filterObj).length) return arr

            let res = []

            for(let key in filterObj){
                if(filterObj.hasOwnProperty(key)){

                       res = [...this.filterFab.filter(res.length ? res : arr, {param: key, value: filterObj[key]}, this.userCoords)]
                }
            }

            return res
        },

        filterBreeds(ev){
            this.markerInfo.breed = ev.target.value
            this.markerInfo.filteredBr = this.types[`${this.markerInfo.animal.toLowerCase()}s`].filter(e => e.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)
        },

        handleBreedOption(val){
            this.markerInfo.breed = val
        },

        putToLocalStorage(){
            let t = localStorage.getItem('markers')
            if(t){
                localStorage.removeItem('markers')
            }
            localStorage.setItem('markers', JSON.stringify(this.markers))
        },

        getFromLocalStorage(){
            let t = localStorage.getItem('markers')
            if(t){
                this.markers = [...JSON.parse(t)]
            }
        },

        cleanInfoMarkerState(){
            this.markerInfo = {
                nickname: '',
                color: "#f210f8",
                age: '',
                name: '',
                email: '',
                tel: '',
                photo: '',
                found: false,
                animal: '',
                breed:'',
                filteredBr: [],
                toDelete: false
            }
        }
    }
}
</script>
<style >

</style>


