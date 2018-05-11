<template>
    <div  v-bind:class = '{ hidden: !isShown, tooltip: isShown }' >
        <div class = 'tooltip-screen-wrapper'>
            <div class = 'tooltip-screen'>
                <input  type = 'text'
                        class = 'chosenItem' 
                        :value = 'chosenTone' 
                        @keyup = 'chooseItem("Tone", $event)'
                />
                <input  type = 'text' 
                        class = 'chosenItem'
                        :value = 'chosenType'
                        @keyup = 'chooseItem("Type", $event)'
                />
            </div>
            <div class = 'btn green add' @click.self = 'add'>+</div>
        </div>
        <div class = 'options-wrapper'>
            <div id = 'tones' class = 'tooltip-box'>
                <div v-for = 'tone in tones' :key = 'tone' @click = 'chooseTone(tone)'>{{ tone }}</div>
            </div>
            <div id = 'types' class = 'tooltip-box'>
                <div v-for = 'type in types' :key = 'type' @click = 'chooseType(type)'>{{ type }}</div>
            </div>
        </div>
        <div class = 'close' @click.self = 'close'>x</div>
    </div>
</template>
<script>
import { types, tones } from '../utils/constants'
export default {
    props: ['isShown'],
    data(){
        return {
            types,
            tones,
            chosenTone: '',
            chosenType: '',
        }
    },

    methods:{
        chooseType(id){
            this.chosenType = id
        },
        chooseTone(id){
            this.chosenTone = id
        },
        chooseItem(mode, e){
            this[`chosen${mode}`] = e.target.value
        },
        add(){
            this.$parent.$emit('add-from-tooltip', {tone: this.chosenTone, type: this.chosenType})
            this.clean()
        },
        close(){
            this.$parent.$emit('close-tooltip', {tone: '', type: ''})
            this.clean()
        },
        clean(){
            this.chosenTone = ''
            this.chosenType = ''
        },
    },
}
</script>
<style>
    .tooltip {
        display: flex;
        position: absolute;
        width: 29vw;
        background-color: rgba(201, 232, 255, 0.9);
        color:black;
        text-align: center;
        border-radius: 0.5vw;
        padding: 0.7vw  0.5vw;
        z-index: 99999;
        opacity: 1;
        font-size: 1vw;
        top: -79px;
        left: 209px;
        min-height: 80px;
        min-width: 300px;
        box-sizing: border-box;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 15%;
        margin-left: -5px;
        border-width: 0.95vw;
        border-style: solid;
        border-color:rgba(201, 232, 255, 0.9) transparent transparent transparent;
    }

    .tooltip-box{
        overflow: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }

    .tooltip-box:first-child{
        margin-bottom: 0.7vw; 
    }

    .tooltip-box div {
        display: inline-block;
        border-radius: 50%;
        padding: 0.2vw 0.5vw;
        margin-left: 0.5vw;
        font-size: 10px;
        font-weight: 400;
        font-family: 'Kalam', cursive, 'Arial', sans-serif;
    }

    .tooltip-box div:hover{
        cursor: pointer;
        transform: scale(1.1)
    }

    .options-wrapper{
        width: 80%;
        height: 100%;
        margin: auto;
    }

    .tooltip-screen-wrapper{
        width: 17%;
        display: flex;
        justify-content:center;
        flex-direction: column;
    }
    .tooltip-screen{
        background: white;
        height: 40%;
        display: flex;
        border-radius: 5px;
    }

    .chosenItem{
        box-sizing: border-box;
        flex-grow: 1;
        font-family: 'Kalam', cursive, 'Arial', sans-serif;
        font-size: 10px;
        width: 100%;
        border: transparent;
    }

    .chosenItem:first-child{
        border-radius: 3px 0 0 3px;
    }

    .chosenItem:last-child{
        border-radius:  0 3px 3px 0 ;
    }

    .close{
        background: white;
        color: black;
        font-family: 'Kalam', cursive, 'Arial', sans-serif;
        border: 1px solid rgba(201, 232, 255, 0.9);
        line-height: 20px;
        position: absolute;
        right: -12px;
        text-align: center;
        top: -10px;
        width: 24px;
        font-weight: bold;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        transition: 0.3s;
    }

    .add{
        padding: 3px 7px;
        height: 10%;
        line-height: 7px;
        font-size: 20px;
        margin-top: 10%;
    }
    
    .close:hover {
        background-color: rgba(201, 232, 255, 0.9);
        color: white;
    }

    .hidden{
        display: none;
    }
    
</style>


