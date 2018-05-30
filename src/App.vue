<template>
    <div>
        <google-map :markers='markers' :canAddNewMarkers="canAddNewMarkers"></google-map>
        <modal-window :isShown = 'modalOpened'></modal-window>
    </div>
</template>

<script>

import { EventBus }  from './utils/eventBus'
import Map from './components/Map'
import Modal from './components/Modal'

export default {
    data(){
        return {
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
                        status: "lost",
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
                        lat: 51,
                        lng: 29
                    },
                    icon: 'https://imageshack.com/a/img924/2561/hD8g3T.png',
                    info: {
                        status: "found",
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
            indexCounter: 3,

            icons: {
                lost: 'https://imageshack.com/a/img924/7901/R6u2Bq.png',
                found: 'https://imageshack.com/a/img924/2561/hD8g3T.png'
            },

            canAddNewMarkers: false,

            newMarker: {
                position: {}
            }
        }
    },

    components: {
        'google-map': Map,
        'modal-window': Modal
    },

    mounted(){

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
                status: o.found,
            }
            this.newMarker.icon = this.icons[`${this.newMarker.info.status ? 'found' : 'lost'}`]

            this.markers.push(this.newMarker)

            this.indexCounter++
        }
    }
}
</script>
<style >

</style>


