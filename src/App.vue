<template>
    <div>
        <google-map :markers='filtered' :canAddNewMarkers="canAddNewMarkers"></google-map>
        <modal-window :isShown = 'modalOpened'></modal-window>
    </div>
</template>

<script>

import { EventBus }  from './utils/eventBus'
import Map from './components/Map'
import Modal from './components/Modal'
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
            markers: [
                {
                    index: 1,
                    position: {
                        lat: 50,
                        lng: 30
                    },
                    icon: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                    info: {
                        found: false,
                        photo: "https://i.imgur.com/Qha68YE.jpg",
                        animal: 'cat',
                        color: 'grey',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 2,
                    position: {
                        lat: 50.5,
                        lng: 30.123
                    },
                    icon: 'https://imageshack.com/a/img924/2561/hD8g3T.png',
                    info: {
                        found: true,
                        photo: "https://i.imgur.com/oaHmbG7.jpg",
                        animal: 'dog',
                        color: 'black',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 3,
                    position: {
                        lat: 50.43,
                        lng: 30.48
                    },
                    icon: 'https://imageshack.com/a/img924/2561/hD8g3T.png',
                    info: {
                        found: true,
                        photo: "https://i.imgur.com/oaHmbG7.jpg",
                        animal: 'dog',
                        color: 'black',
                        age: 1,
                        breed: "home",
                        name: "olya",
                        email: "fhkfjhf@jfjk"
                    }
                },
                {
                    index: 4,
                    position: {
                        lat: 50.4833,
                        lng: 30.567
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
                        breed: "home",
                        name: "olya",
                        email: "fhkfjhf@jfjk"
                    }
                }
            ],

            filters: [
                // {
                //     param: 'animal',
                //     value: 'cat'
                // },
                // {
                //     param: 'found',
                //     value: false
                // }
                
                {
                    param: 'radius',
                    value: 10
                }
            ],

            canAddNewMarkers: false,

            newMarker: {
                position: {}
            },

            filtered: [],

            userCoords: {}
        }
    },

    components: {
        'google-map': Map,
        'modal-window': Modal
    },

    mounted(){

        console.log(this.filters)

        this.filtered = JSON.parse(JSON.stringify(this.markers))

        this.filterObj = new Filter()

        EventBus.$on('modal_opened', (ev) => {
            this.newMarker.position = ev.position
            this.openModal()
        })

        EventBus.$on('modal_closed', () => this.closeModal())

        EventBus.$on('new_marker', (ev) => {

            this.closeModal()
            this.addNewMarker(ev.result)
            
        })

        EventBus.$on('new_markers_mode', () => this.toggleAddMarkersMode())

        EventBus.$on('user_position', (pos) => {
            debugger
            this.userCoords.lat = pos.lat
            this.userCoords.lng = pos.lng
            this.filtered = this.filterFn(this.markers)
        } )

    },

    methods: {
        openModal(){
            this.modalOpened = true
        },

        closeModal(){
            this.modalOpened = false
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

        filterFn(arr){
            if(!this.filters.length) return arr

            let res = []
            let copy = JSON.parse(JSON.stringify(arr))
            if(this.filters.length > 0){
                
            }
            this.filters.forEach(fl =>{

                if(fl.param === 'radius'){
                    let temp = this.filterObj.filter(copy, fl, this.userCoords)
                }
                let temp = this.filterObj.filter(copy, fl)

                res = [...temp]
                copy = temp
            })
            return res
        }
    }
}
</script>
<style >

</style>


