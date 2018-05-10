<template>
    <div id='app-wrapper'>
        <div id='app-control'>
            <button v-bind:class='{active: mode === "new"}'             v-bind:disabled='mode === "new"'
            @click='start'
            >Start from scratch</button>
            <button v-bind:class='{active: mode === "edit"}'
                v-bind:disabled='mode === "edit"'
                @click='edit'
            >Open to edit</button>
            <button v-bind:class='{active: mode === "save"}' @click='save'>
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
            <button @click='addLine'> Add line </button>
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
<style scoped>
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

</style>


