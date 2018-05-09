<template>
    <div  v-bind:class="{hidden: !isShown, tooltip: isShown}" >
        <div class='options-wrapper'>
            <div id='tones' class='tooltip-box'>
                <div v-for='tone in tones' :key='tone' @click='chooseTone(tone)'>{{ tone }} </div>
            </div>
            <div id='types' class='tooltip-box'>
                <div v-for='type in types' :key='type' @click='chooseType(type)'>{{ type }} </div>
            </div>
        </div>
        <div class ='tooltip-screen-wrapper'>
            <div class = 'tooltip-screen'>
                <div class='chosenItem'>{{chosenTone}}</div>
                <div class='chosenItem'>{{chosenType}}</div>
            </div>
        </div>
        <div class='close' @click.self='close'>x</div>
        <div class='add' @click.self='add'>+</div>
    </div>
</template>
<script>
import { types, tones } from '../utils/constants'
import { EventBus } from '../utils/eventBus';
export default {
    props: ['isShown'],
    data(){
        return {
            types,
            tones,
            chosenTone:'',
            chosenType:'',
        }
    },

    methods:{
        chooseType(id){
            this.chosenType = id
        },

        chooseTone(id){
            this.chosenTone = id
        },
        close(){
            EventBus.$emit('close', {tone: '', type: ''})
            this.clean()
        },

        clean(){
            this.chosenTone = ''
            this.chosenType = ''
        },

        add(){
            EventBus.$emit('add', {tone: this.chosenTone, type: this.chosenType})
            this.clean()
        }
    },
}
</script>
<style>
    .tooltip {
        position: absolute;
        width: 29vw;
        height:14vh;
        background-color: lightblue;
        color:black;
        text-align: center;
        border-radius: 0.5vw;
        padding: 0.7vw  0.5vw;
        z-index: 99999;
        opacity: 1;
        font-size: 1vw;
        display: flex;
        top: -86px;
        min-height: 80px;
        min-width: 300px;;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 15%;
        margin-left: -5px;
        border-width: 0.95vw;
        border-style: solid;
        border-color:lightblue transparent transparent transparent;
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
        border: 1px solid purple;
        padding: 0.2vw 0.5vw;
        margin-left: 0.5vw;
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
        background: rgb(171, 233, 113);
        height: 40%;
        display: flex;
    }

    .chosenItem{
        border: 1px solid rebeccapurple;
        box-sizing: border-box;
        flex-grow: 1;
        padding-top: 0.65vw;
    }

    .close{
        color:red;
        position: absolute;
        left: 96%;
        top: -6%;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 900;
        cursor: pointer;
        font-size: 1.5vw;
    }

    .add{
        color:green;
        position: absolute;
        left: 96%;
        top: 70%;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        cursor: pointer;
        font-size: 2vw;
    }

    .hidden{
        display: none;
    }
</style>


