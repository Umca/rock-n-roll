
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
                <span v-for='acc in accords' :key='acc' 
                draggable='true' 
                class='draggable' 
                v-on:dragstart="dragstart">{{acc}}</span>
            </div>
        </div>
        <textarea rows=''
            cols=''  
            name='text-line'
            placeholder="Add line of song..."
            id='text-line'
            @keyup="handleTextUpdate"
        ></textarea>
        <!-- <img src='../images/click.png'/> -->
    </div>
</div>
</template>
<script>
import Tooltip from './Tooltip'
export default {
    data(){
        return {
            chosenAccord: '',
            dragObject: {},
            lineOfSong: '',
            isTooltip: false,
            coords: {},
            accords: []

        }
    },
    components: {
        'tooltip': Tooltip
    },
    methods: {
        handleChange(e){
            this.chosenAccord = e.target.value
        },

        addDraggableAngle(){
            const el = document.getElementById('accord-line')
            const angle = document.createElement('div')
            angle.classList.add('angle')
            el.appendChild(angle)

            let elData = el.getBoundingClientRect()
            let angleData = angle.getBoundingClientRect()

            angle.style.left = `${Math.round(elData.width + elData.left) - angleData.width}px`
            angle.style.top = `${Math.round(elData.height + elData.top) - angleData.height}px`
        },

        resizeAccordLine(){  
            document.addEventListener('mousedown', (ev)=>{
                if(ev.which == 1 && ev.target.classList.contains('angle')){

                    document.addEventListener('mousemove', this.handleMouseMove)
                }  
            })

            document.addEventListener('mouseup', (ev) => document.removeEventListener('mousemove', this.handleMouseMove))
        },

        handleMouseMove(ev){
            let el = document.querySelector('.angle')
            let div = el.parentElement
           
            div.style.width = `${(ev.pageX - div.getBoundingClientRect().left)}px`
            el.style.left = `${(ev.pageX - div.getBoundingClientRect().left) + el.getBoundingClientRect().width}px`
        },

        createElWithNewAccord(text, parent){
            let span = document.createElement('span')
            span.textContent = text
            span.id = `text_${Date.now()}`
            span.style.border = '1px solid red'
            span.classList.add('draggable')
            span.draggable = true
            parent.appendChild(span)

            let spanData = this.getCoords(span)

            span.style.left = `${this.coords.pageX - spanData.width / 2 -spanData.left }px`
            span.style.top = `${this.coords.pageY - spanData.height / 2 - spanData.top }px`

            span.addEventListener('dragstart', this.drag)
            span.addEventListener('dblclick', (e) => {
                console.log(e)
            })
        },
        
        addAccord(){
            this.accords.push(this.chosenAccord)
            // this.createElWithNewAccord(this.chosenAccord, document.querySelector('#accord-line'))
            this.chosenAccord = ''
        },

        getCoords(el){
            return el.getBoundingClientRect()
        },

        dragstart(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
            console.log(ev.dataTransfer)
            this.dragObject.downX = ev.pageX
            this.dragObject.downY = ev.pageY
            let coords = this.getCoords(ev.target)
            this.dragObject.shiftX = this.dragObject.downX //- coords.left
            this.dragObject.shiftY = this.dragObject.downY //- coords.top
        },

        drop(ev){
            debugger
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            console.log(data)
            let draggable = document.getElementById(data)
            
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

        }
    },

    mounted(){
        this.addDraggableAngle()
        this.resizeAccordLine()

        this.$on('close', val => {
            this.isTooltip = false
            this.chosenAccord = val.tone+val.type
        })

        this.$on('add', val => {
            this.isTooltip = false
            this.chosenAccord = val.tone+val.type

            this.addAccord()
        })
    }
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

