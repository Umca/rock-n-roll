<template>
<div class = 'relative'>
    <tooltip :isShown = isTooltip></tooltip>
    <div id = 'editline'>
        <div class = 'line-wrapper'>
            <div    id = 'accord-field' 
                    @drop = 'drop' 
                    @dragover = 'allowDrop'>
                <div id ='accord-line' 
                    class ='droppable editable'
                    @click = 'showTooltip'>
                    <p :class = 'placeholderClass'>Click to add accords...</p>
                    <drag-item v-for = 'acc in accords' 
                        :key = 'acc.id' 
                        :id = 'acc.id'
                        :text = acc.accord
                        :handleDrag = 'dragstart'
                        :clickCoords = 'Object.keys(coords).length > 0 ?
                        coords : acc.coords'
                        :mode = 'mode'
                        :handleDblclick = 'handleDblclick'>
                    </drag-item>
                </div>
            </div>
            <input 
                type = 'text' 
                name = 'text-line'
                placeholder = 'Add line of song...'
                id = 'text-line'
                :value = 'lineOfSong'
                @keyup = 'handleTextUpdate'
            />
            </div>
        <div class = 'btn-wrapper'>
            <button @click = 'deleteLine' 
                class = 'orange' 
                type = 'button'> 
            X </button>
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
            dragObject: {},
            coords: {},
            isTooltip: false,
        }
    },
    computed: {
        placeholderClass(){
            return {
                hidden: this.accords.length > 0,
                'placeholder': true
            }
        }
    },
    props: ['id', 'accords', 'lineOfSong','mode'],
    components: {
        'tooltip': Tooltip,
        'drag-item': DragItem
    },
    mounted(){
        this.$on('close-tooltip', val => {
            this.isTooltip = false

            if(this.accords.length > 0) return
            this.togglePlaceholder('show')
        })

        this.$on('add-from-tooltip', val => {
            this.isTooltip = false

            EventBus.$emit('accord-added', { lineId: this.id, accord: val.tone + val.type })
        })

        this.$on('item-added', val => {
            // To save coordinates of drag item for future positioning

            let newlyAdded = this.searchAccord(val.id)
            newlyAdded.coords = val.coords
        })
    },
    methods: {
        searchAccord(id){
            return this.accords.filter(acc => acc.id == id)[0]
        },

        dragstart(ev) {
            ev.dataTransfer.setData('Text', ev.target.id);
            this.dragObject.toDrag = ev.target.id
            this.dragObject.downX = ev.pageX
            this.dragObject.downY = ev.pageY
            // let coords = ev.target.getBoundingClientRect()
            this.dragObject.shiftX = this.dragObject.downX
            this.dragObject.shiftY = this.dragObject.downY
        },

        allowDrop(ev){
            ev.preventDefault()
        },

        drop(ev){
            ev.preventDefault()

            if(this.dragObject.toDrag){
                let draggable = document.getElementById(this.dragObject.toDrag)     
                draggable.style.left = ((parseFloat(draggable.style.left) || 0) +  ev.pageX - this.dragObject.shiftX) + 'px'
                draggable.style.top = ((parseFloat(draggable.style.top) || 0) + ev.pageY - this.dragObject.shiftY) + 'px'

                let dropped = this.searchAccord(draggable.id)
                dropped.coords = {
                    left: draggable.style.left,
                    top: draggable.style.top
                }

                this.dragObject = {}
            }
        },

        handleTextUpdate(ev){
            EventBus.$emit('new-textline', { text: ev.target.value, lineId: this.id })
        },

        handleDblclick(e){
            EventBus.$emit('delete-accord', {lineId: this.id, accordId: e.target.id})
        },

        showTooltip(ev){
            if(ev.target.classList.contains('draggable')) return

            this.isTooltip = true
            this.$parent.$emit('tooltip-opened', { lineId: this.id })

            this.togglePlaceholder('hide')

            this.coords.pageX = ev.pageX 
            this.coords.pageY = ev.pageY
        },

        togglePlaceholder(mode){
            if (mode == 'hide'){
                this.$el.querySelector('.placeholder').classList.add('hidden')
            } else {
                this.$el.querySelector('.placeholder').classList.remove('hidden')
            }
        },

        deleteLine(){
            EventBus.$emit('delete-line', { id: this.id })
        }
    },
}
</script>
<style>

    .relative{
        position: relative;
        margin-bottom: 20px;
    }
    .hidden{
        display: none;
    }
    #editline{
        width: 100%;
        display: flex;
    }
    #accord-line{
        border: 1px solid #f1c40f;
        border-bottom: transparent;
        height: 20px;
        border-radius: 5px 5px  0 0;
        width: 100%;
        background-color: rgba(254, 239, 176, 0.5);
        padding:  3px 7px;
        font-family: 'Kalam', cursive, 'Arial', sans-serif;
        font-size: 12px;
    }
    #accord-line p{
        margin: 0;
        line-height: 20px;
        position: absolute;
        color: #afb3b6;
        user-select: none;
    }
    #accord-field{
        display: flex;
    }
    #new-accord{
        width: 5vw;
    }
    #text-line{
        resize: none;
        border: 1px solid #f1c40f;
        border-radius: 0 0 5px 5px;
        box-sizing: border-box;
        padding: 2px 9px;
        width: 100%;
        font-family: 'Kalam', cursive, 'Arial', sans-serif;
        font-size: 13px;
        letter-spacing: 0.1vw;
        height: 28px;
    }
    .orange {
        color: #e67e22;
        background: transparent;
        border: transparent;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
    .orange:hover {
        color: #FF983C;
    }
    .line-wrapper{
        display: flex;
        width: 95%;
        margin-right: 2%;
        flex-direction: column;
    }
    .btn-wrapper{
        position: relative;
    }
     ::-webkit-input-placeholder {
        color: #afb3b6;
        font-size: 14px;
    }
    ::-moz-placeholder {
        color: #afb3b6;
        font-size: 14px;
    }
    :-ms-input-placeholder { 
        color: #afb3b6;
        font-size: 14px;
    }
    :-moz-placeholder { 
        color: #afb3b6;
        font-size: 14px;
    }
</style>

