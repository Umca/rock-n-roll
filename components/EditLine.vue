<template>
<div class='relative'>
    <tooltip :isShown=isTooltip></tooltip>
    <div id='editline'>
        <div    id='accord-field' 
                @drop='drop' 
                @dragover='allowDrop'>
            <div id ='accord-line' 
                class ='droppable'
                @click = 'showTooltip'
               
            >
            <drag-item v-for='acc in accords' :key='acc' 
                :id = 'acc+ "_" +Date.now()'
                :text=acc
                :handleDrag='dragstart'
                :coords=coords
                :handleDblclick='handleDblclick'
            >

            </drag-item>
                

            </div>
        </div>
        <textarea rows=''
            cols=''  
            name='text-line'
            placeholder="Add line of song..."
            id='text-line'
            @keyup="handleTextUpdate"
        ></textarea>
    </div>
</div>
</template>
<script>
import Tooltip from './Tooltip'
import DragItem from './DragItem'
export default {
    data(){
        return {
            chosenAccord: '',
            dragObject: {},
            lineOfSong: '',
            isTooltip: false,
            coords: {},
            accords: ['Dm'],
            toDrag: undefined

        }
    },
    components: {
        'tooltip': Tooltip,
        'drag-item': DragItem
    },
    mounted(){
        // this.addDraggableAngle()
        // this.resizeAccordLine()

        this.$on('close', val => {
            this.isTooltip = false
            this.chosenAccord = val.tone+val.type
        })

        this.$on('add', val => {
            this.isTooltip = false
            this.chosenAccord = val.tone+val.type

            this.addAccord()
        })
    },
    methods: {
        handleChange(e){
            this.chosenAccord = e.target.value
        },
        
        addAccord(){
            this.accords.push(this.chosenAccord)
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
            draggable.style.left = (parseFloat(draggable.style.left) +  ev.pageX - this.dragObject.shiftX) + 'px'
            draggable.style.top = (parseFloat(draggable.style.top) + ev.pageY - this.dragObject.shiftY) + 'px'
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
            let toDelete = e.target.id.match(/.+_/)[0]
            this.accords = this.accords.filter(acc => acc!==toDelete.slice(0, toDelete.length -1))

        }

                // addDraggableAngle(){
        //     const el = document.getElementById('accord-line')
        //     const angle = document.createElement('div')
        //     angle.classList.add('angle')
        //     el.appendChild(angle)

        //     let elData = el.getBoundingClientRect()
        //     let angleData = angle.getBoundingClientRect()

        //     angle.style.left = `${Math.round(elData.width + elData.left) - angleData.width}px`
        //     angle.style.top = `${Math.round(elData.height + elData.top) - angleData.height}px`
        // },

        // resizeAccordLine(){  
        //     document.addEventListener('mousedown', (ev)=>{
        //         if(ev.which == 1 && ev.target.classList.contains('angle')){

        //             document.addEventListener('mousemove', this.handleMouseMove)
        //         }  
        //     })

        //     document.addEventListener('mouseup', (ev) => document.removeEventListener('mousemove', this.handleMouseMove))
        // },

        // handleMouseMove(ev){
        //     let el = document.querySelector('.angle')
        //     let div = el.parentElement
           
        //     div.style.width = `${(ev.pageX - div.getBoundingClientRect().left)}px`
        //     el.style.left = `${(ev.pageX - div.getBoundingClientRect().left) + el.getBoundingClientRect().width}px`
        // },
    },


}
</script>

<style>
    .relative{
        position: relative;
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
        font-size: 1.2vw;
    }

    /* .angle{
        width: 5px;
        height: 5px;
        background: black;
        position: sticky;
    } */

    textarea {
        width: 99.1%;
        margin-top: 0.5vw;
        height: 2vw;

    }

    #accord-line:hover .prompt{
        visibility: visible;
        opacity: 1;
    }

    /* .prompt{
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s;
    } */

</style>

