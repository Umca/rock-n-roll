<template>
    <div id='app-wrapper'>
        <div id='app-control'>
            <button v-bind:class='{active: mode === "new"}'>Start from scratch</button>
            <button v-bind:class='{active: mode === "edit"}'>Open to edit</button>
            <button v-bind:class='{active: mode === "save"}'>Save</button>
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
            mode: 'new'
        }
    },

    mounted(){
        this.$on('delete', val => {
            this.deleteLine(val)
        })
    },

    methods: {
        addLine(){
            this.lines.push({ id: Date.now()+Math.random() * 1000 })
        },
        deleteLine(val){
            this.lines = this.lines.filter(line => line.id !== val.id)
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

    #app-line-control{
        display: flex;
        justify-content: flex-end;
    }

    #app-line-control button{
        margin-right: 10px;
    }

    .active{
        background:indianred
    }

</style>


