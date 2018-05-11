<template>
    <div id='app-wrapper'>
        <div id='app-control'>
            <button class='purple btn'
            v-bind:disabled='mode === "new"'
            @click='start'
            >Start from scratch</button>
            <div id='app-download'>
                <button 
                    type='button'
                    class='btn purple'
                    @click='edit'
                >Open o edit</button>
                <input type='file' 
                    id="getFile" 
                    class='hidden'
                    @change='readFile'>
            </div>
            <button class='purple btn' @click='save'>Save</button>
        </div>
        
        <div id='app-song'>
            <input type=text placeholder='Name of the song...'
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
            
            let file = new Blob([JSON.stringify(result)], {type: 'application/json'})
            if (window.navigator.msSaveOrOpenBlob) 
                window.navigator.msSaveOrOpenBlob(file, filename);
            else {
                var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = `${this.songName || 'mySuperSong'}.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);  
                }, 0); 
            }
        },

        cleanToSave(){
            this.toSave = false
        },
        edit(){
            this.mode = 'edit'
            this.download()
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

    #app-song{
        margin-bottom: 20px;
    }

    #app-song input{
        width: 100%;
        border: 1px solid #7dbcec;
        border-radius: 5px;
        height: 27px;
        padding:  3px 9px;
        font-family: 'Kalam', cursive;
        box-sizing: border-box;
        background-color: rgba(201, 232, 255, 0.7);
    }

    #app-line-control{
        display: flex;
        justify-content: flex-end;
    }

    #app-line-control button{
        margin-right: 10px;
    }

    .hidden{
        display: none;
    }

    .btn {
        border-radius: 5px;
        padding: 4px 12px;
        font-size: 14px;
        text-decoration: none;
        color: #fff;
        position: relative;
        display: block;
        border: transparent;
        font-family: 'Gloria Hallelujah', cursive;
        cursor: pointer;
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

    ::-webkit-input-placeholder {
    color: #d5dadd;
    }
    ::-moz-placeholder {
    color: #d5dadd;
    }
    :-ms-input-placeholder { 
    color: #d5dadd;
    }
    :-moz-placeholder { 
    color: #d5dadd;
    }

</style>


