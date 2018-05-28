<template>
    <div>
        <google-map></google-map>
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
            modalOpened: false
        }
    },

    components: {
        'google-map': Map,
        'modal-window': Modal
    },

    mounted(){
        EventBus.$on('map_clicked', (ev) => {
            this.openModal()
        })

        EventBus.$on('modal_closed', () => this.closeModal())
    },

    methods: {
        openModal(){
            this.modalOpened = true
        },

        closeModal(){
            this.modalOpened = false
        }
    }
}
</script>
<style >

</style>


