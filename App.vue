<template>
    <div id='app-wrapper'>
        <div id='app-control'>
            <button v-bind:class='{active: mode === "new"}' v-bind:disabled='mode === "new"'>Start from scratch</button>
            <button v-bind:class='{active: mode === "edit"}'>Open to edit</button>
            <button v-bind:class='{active: mode === "save"}' @click='save'>Save</button>
        </div>
        <div id='app-song'>
            <input type=text placeholder='Name of the song'
                :value='songName'
                @keyup='addSongName'/>
        </div>
        <div id='app-lines'>
            <edit-line v-for='line in lines' :key='line.id' :id='line.id'></edit-line>
        </div>
            <button @click='addLine'> Add line </button>
    </div>
</template>

<script>
import EditLine from './components/EditLine.vue'

export default {
    components: {
        'edit-line': EditLine
    },

    data(){
        return {
            lines: [{ id: Date.now()+Math.random() * 1000 }],
            mode: 'new',
            songName: ''
        }
    },

    mounted(){
        this.$on('delete', val => {
            this.deleteLine(val)
        })
    },

    methods: {
        addSongName(e){
            this.songName = e.target.value
        },
        addLine(){
            this.lines.push({ id: Date.now()+Math.random() * 1000 })
        },
        deleteLine(val){
            this.lines = this.lines.filter(line => line.id !== val.id)
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

            // to local storage
            localStorage.setItem(result.songName, JSON.stringify(result))

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

</style>


