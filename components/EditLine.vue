<template>
<div class='relative'>
    <tooltip :isShown=isTooltip></tooltip>
    <div id='editline'>
        <div class='wrapper'>
            <div    id='accord-field' 
                    @drop='drop' 
                    @dragover='allowDrop'>
                <div id ='accord-line' 
                    class ='droppable editable'
                    @click = 'showTooltip'>
                    <p v-bind:class="placeholderClass" >Click to add accords...</p>
                    <drag-item v-for='acc in accords' :key='acc.id' 
                        :id = 'acc.id'
                        :text=acc.accord
                        :handleDrag='dragstart'
                        :clickCoords= 'Object.keys(coords).length > 0 ?
                        coords : acc.coords'
                        :mode = 'mode'
                        :handleDblclick='handleDblclick'>
                    </drag-item>
                </div>
            </div>
            <input 
                type='text' 
                name='text-line'
                placeholder="Add line of song..."
                id='text-line'
                @keyup="handleTextUpdate"
                :value='lineOfSong'
            />
            </div>
        <div class='btn-wrapper'>
            <button @click='deleteLine' class='orange' type='button'> X </button>
        </div>
    </div>
</div>
</template>
<script>
import Tooltip from './Tooltip'
import DragItem from './DragItem'
import { EventBus } from '../utils/eventBus'
import _ from 'lodash'
export default {
    data(){
        return {
            chosenAccord: '',
            dragObject: {},
            toDrag: undefined,
            isTooltip: false,
            coords: {},
        }
    },
    props: ['id', 'accords', 'lineOfSong','mode'],
    components: {
        'tooltip': Tooltip,
        'drag-item': DragItem
    },
    mounted(){
        EventBus.$on('close', val => {
            this.isTooltip = false
            // this.chosenAccord = ''
        })

        this.$on('add', val => {

            this.isTooltip = false
            EventBus.$emit('accord-added', { lineId: this.id, accord: val.tone+val.type })
        })

        this.$on('item-added', val => {
            let newlyAdded = this.searchAccord(val.id)
            newlyAdded.coords = val.coords
        })

        console.log(document.getElementById('accord-line').style.backgroundImage)
    },
    methods: {

        searchAccord(id){
            return this.accords.filter(acc => acc.id == id)[0]
        },
        
        addAccord(){
            this.accords.push( {
                accord: this.chosenAccord,
                id: this.chosenAccord + "_" + Date.now()
                
            })
            this.chosenAccord = ''
        },

        getCoords(el){
            return el.getBoundingClientRect()
        },

        dragstart(ev) {
            ev.dataTransfer.setData('Text', ev.target.id);
            this.toDrag = ev.target.id
            this.dragObject.downX = ev.pageX
            this.dragObject.downY = ev.pageY
            let coords = this.getCoords(ev.target)
            this.dragObject.shiftX = this.dragObject.downX //- coords.left
            this.dragObject.shiftY = this.dragObject.downY //- coords.top
        },

        drop(ev){
            ev.preventDefault();
            let draggable = document.getElementById(this.toDrag)     
            draggable.style.left = ((parseFloat(draggable.style.left) || 0) +  ev.pageX - this.dragObject.shiftX) + 'px'
            draggable.style.top = ((parseFloat(draggable.style.top) || 0) + ev.pageY - this.dragObject.shiftY) + 'px'

            let dropped = this.searchAccord(draggable.id)
            dropped.coords = {
                left: draggable.style.left,
                top: draggable.style.top
            }

            console.log(dropped, this.accords)

            this.dragObject = {}

        },

        allowDrop(ev){
            ev.preventDefault();
        },

        handleTextUpdate(ev){
            EventBus.$emit('new_line', {text: ev.target.value, lineId: this.id})
        },

        showTooltip(ev){
            if(ev.target.classList.contains('draggable')) return
            this.isTooltip = true

            this.coords.pageX = ev.pageX 
            this.coords.pageY = ev.pageY
        },

        handleDblclick(e){
            EventBus.$emit('deleteAccord', {lineId: this.id, accordId: e.target.id})
        },

        deleteLine(){
            EventBus.$emit('deleteLine', {id: this.id})
        }
    },
}
</script>

<style>
    .relative{
        position: relative;
        margin-bottom: 20px;
    }
    #editline{
        width: 100%;
    }
    #accord-line{
        height: 3vw;
        border: 1px solid #f1c40f;
        min-height: 40px;
        border-radius: 5px;
        margin-bottom: 1vw;
    }
    #new-accord{
        width: 5vw;
    }

    #text-line{
        resize: none;
        min-height: 40px;
        border-color: #f1c40f;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0.5vw;
        margin-bottom: 1vw; 
    }
    .draggable{
        position: absolute;
    }

    .orange {
        background-color: #e67e22;
        box-shadow: 0px 5px 0px 0px #CD6509;
        }

        .orange:hover {
        background-color: #FF983C;
        }

    textarea {
        width: 99.1%;
        height: 2vw;
        line-height: 2vw;
        font-family: 'Kalam', cursive;

    }

    #accord-line:hover .prompt{
        visibility: visible;
        opacity: 1;
    }

</style>

