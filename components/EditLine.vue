<template>
<div class='relative'>
    <tooltip :isShown=isTooltip></tooltip>
    <div id='editline'>
        <div    id='accord-field' 
                @drop='drop' 
                @dragover='allowDrop'>
            <div id ='accord-line' 
                class ='droppable'
                @click = 'showTooltip'>
                <drag-item v-for='acc in accords' :key='acc.accord' 
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
        <textarea rows=''
            cols=''  
            name='text-line'
            placeholder="Add line of song..."
            id='text-line'
            @keyup="handleTextUpdate"
            :value='lineOfSong'
        ></textarea>
        <button @click='deleteLine'> Delete line </button>
    </div>
</div>
</template>
<script>
import Tooltip from './Tooltip'
import DragItem from './DragItem'
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
        this.$on('close', val => {
            this.isTooltip = false
            this.chosenAccord = ''
        })

        this.$on('add', val => {
            this.isTooltip = false
            this.chosenAccord = val.tone+val.type

            this.addAccord()
        })

        this.$on('item-added', val => {
            let newlyAdded = this.searchAccord(val.id)
            newlyAdded.coords = val.coords
        })
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
            this.lineOfSong = ev.target.value
        },

        showTooltip(ev){
            if(ev.target.classList.contains('draggable')) return
            this.isTooltip = true

            this.coords.pageX = ev.pageX 
            this.coords.pageY = ev.pageY
        },

        handleDblclick(e){
            // this.accords = this.accords.filter(acc => acc.id !== e.target.id)
            this.$parent.$emit('deleteAccord', {lineId: this.id, accordId: e.target.id})
        },

        deleteLine(){
            this.$parent.$emit('deleteLine', {id: this.id})
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
        width: 100%
    }
    #accord-line{
        height: 2vw;
        border: 1px solid blue;
        min-height: 40px;
    }
    #new-accord{
        width: 5vw;
    }

    #text-line{
        resize: none;
        min-height: 40px;
    }
    .draggable{
        position: absolute;
    }

    textarea {
        width: 99.1%;
        margin-top: 0.5vw;
        height: 2vw;

    }

    #accord-line:hover .prompt{
        visibility: visible;
        opacity: 1;
    }

</style>

