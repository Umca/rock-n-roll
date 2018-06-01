<template>
    <div style="position: relative">
        <filter-component :isShown = 'filtersOpened'></filter-component>
        <google-map :markers='filtered' :canAddNewMarkers="canAddNewMarkers"></google-map>
        <modal-window :isShown = 'modalOpened' :info="infoToEdit"></modal-window>
    </div>
</template>

<script>

import Map from './components/Map'
import Modal from './components/Modal'
import Filters from './components/Filters'
import { Filter } from './utils/filter'

export default {
    data(){
        return {
            indexCounter: 5,
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

            infoToEdit: undefined
        }
    },

    components: {
        'google-map': Map,
        'modal-window': Modal,
        'filter-component': Filters
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

        this.$on('modal_closed', () => this.closeModal())

        this.$on('new_marker', (ev) => {

            this.closeModal()
            this.addNewMarker(ev.result)

            this.putToLocalStorage()
        })

        this.$on('new_markers_mode', () => this.toggleAddMarkersMode())

        this.$on('filters_toggle', () => this.toggleFilters())

        this.$on('filter_apply', (ev) => {
            this.userCoords.lat = 50.4514007
            this.userCoords.lng = 30.352864900000004

            this.filtered = this.filterFn(this.markers, ev)
        })

        this.$on('marker_edit', (ev) => {
            this.infoToEdit =  ev
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

        addNewMarker(o){
            this.newMarker.info = {
                photo: o.photo,
                animal: o.animal,
                breed: o.breed,
                age: o.age,
                color: o.color,
                name: o.name,
                tel: o.tel,
                email: o.email,
                found: o.found,
            }
            this.newMarker.icon = this.icons[`${this.newMarker.info.found ? 'found' : 'lost'}`]

            this.markers.push(this.newMarker)

            this.indexCounter++
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
        }
    }
}
</script>
<style >

</style>


