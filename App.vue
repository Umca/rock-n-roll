<template>
    <div id='app-wrapper'>
        <div id='app-control'>
            <button class='purple btn'             v-bind:disabled='mode === "new"'
            @click='start'
            >Start from scratch</button>
            <button class='purple btn'
                v-bind:disabled='mode === "edit"'
                @click='edit'
            >Open to edit</button>
            <button class='purple btn' @click='save'>
                Save
            </button>
            <a href="" id="app-download" 
                v-bind:class ='{hidden: !toSave}'
                @click='cleanToSave'
            >click to download your file</a>
        </div>
        <div id='app-download' v-bind:class='{hidden: mode !== "edit"}'>
            <button @click="download">File to download</button>
            <input type='file' 
                id="getFile" 
                class='hidden'
                @change='readFile'>
        </div>
        <div id='app-song'>
            <input type=text placeholder='Name of the song'
                :value='songName'
                @keyup='addSongName'/>
        </div>
        <div id='app-lines'>
            <edit-line v-for='line in lines' 
            :key='line.id' :id='line.id' 
            :accords = 'line.accords'
            :lineOfSong = 'line.lineOfSong'
            :mode = 'mode'
            
            ></edit-line>
        </div>
            <button @click='addLine' class='btn green'> Add line </button>
    </div>
</template>

<script>
import EditLine from './components/EditLine.vue'
import { MyFileReader } from './utils/FileReader'
import { EventBus } from './utils/eventBus'

export default {
    components: {
        'edit-line': EditLine
    },

    data(){
        return {
            lines: [],
            mode: 'new',
            songName: '',
            file: '',
            toSave: false
        }
    },

    mounted(){
        this.fileReader = new MyFileReader(this.failToReadFile)

        EventBus.$on('deleteLine', val => {
            this.deleteLine(val)
        })

        EventBus.$on('deleteAccord', val => {
            console.log(val)
            this.deleteAccord(val)
        })

        EventBus.$on('new_line', (val) => {
            this.updateLine(val)
        })

        EventBus.$on('accord-added', (val) => {
            console.log(val)
            this.addAccordToLine(val)
        })

        EventBus.$on('file', (val) => {
            console.log(val)
            let obj = JSON.parse(val)
            this.songName = obj.songName
            this.lines = obj.lines
        })
    },

    methods: {
        addSongName(e){
            this.songName = e.target.value
        },
        addLine(){
            this.lines.push({ 
                id: Date.now()+Math.random() * 1000,
                accords: [],
                lineOfSong: '' 
            })
        },
        deleteLine(val){
            this.lines = this.lines.filter(line => line.id !== val.id)
        },
        updateLine(val){
            let line = _.findIndex(this.lines, (l) => l.id === val.lineId)
            this.lines[line].lineOfSong= val.text
        },
        addAccordToLine(val){
            let line = _.findIndex(this.lines, (l) => l.id === val.lineId)
            this.lines[line].accords.push({accord: val.accord, coords: {}, id: Math.random() * 1000})
        },
        save(){
            let result = {}
            result.songName = this.songName
            result.lines = []
            this.$children.forEach(ch => {
                result.lines.push({
                    id: ch.id,
                    lineOfSong: ch.lineOfSong,
                    accords: ch.accords
                })
            })

            this.toSave = true
            

            let a = document.getElementById("app-download")
            let file = new Blob([JSON.stringify(result)], {type: 'application/json'})
            a.href = URL.createObjectURL(file)
            a.download = `${this.songName}.json`
        },

        cleanToSave(){
            this.toSave = false
        },
        edit(){
            this.mode = 'edit'
        },
        deleteAccord(val){
            let line = _.findIndex(this.lines, (l) => l.id === val.lineId)
            this.lines[line].accords = this.lines[line].accords.filter(acc => acc.id != val.accordId)
            console.log(this.lines[line].accords)
            this.$forceUpdate();
        },
        start(){
            this.lines = []
            this.songName = ''
            this.mode = 'new' 
        },
        download(){
            let input = document.getElementById('getFile')
            input.click()
        },
        failToReadFile(){
            console.log('This API is not available at your browser')
        },
        readFile(e){
             this.fileReader.handleFile(e)
        }
    }
}
</script>
<style >
    #app-wrapper{
        width: 40vw;
        margin: 50px auto; 
        min-width: 400px;
    }

    #app-control{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    #app-download{
         margin-bottom: 20px;
         width: 100%;
    }

    #app-song{
        margin-bottom: 20px;
        
    }

    #app-song input{
        width: 100%;
        border: 1px solid #55acee;
        border-radius: 5px;
        height: 34px;
        padding: 0.5vw;
        font-family: 'Kalam', cursive;
    }

    #app-line-control{
        display: flex;
        justify-content: flex-end;
    }

    #app-line-control button{
        margin-right: 10px;
    }

    .active{
        background:indianred;
    }

    .hidden{
        display: none;
    }

    /* button{
        background-image:  url("./images/button.png");
        background-repeat: no-repeat;
        background-position: top;
        width: 117px;
        height: 39px;
        border: 0;
        font-family: 'Gloria Hallelujah', cursive;
        border-radius: 5px;
    } */

    .btn {
        border-radius: 5px;
        padding: 10px 17px;
        font-size: 16px;
        text-decoration: none;
        color: #fff;
        position: relative;
        display: inline-block;
        border: transparent;
        font-family: 'Gloria Hallelujah', cursive;
    }

    .btn:active {
        transform: translate(0px, 5px);
        -webkit-transform: translate(0px, 5px);
        box-shadow: 0px 1px 0px 0px;
    }

    .green {
        background-color: #2ecc71;
        box-shadow: 0px 5px 0px 0px #15B358;
    }

    .green:hover {
        background-color: #48E68B   ;
    }

    .purple {
        background-color: #9b59b6;
        box-shadow: 0px 5px 0px 0px #82409D;
    }

    .purple:hover {
        background-color: #B573D0;
    }

</style>


