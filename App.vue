<template>
    <div id='app-wrapper'>
        <div id='controls'>
            <button>Edit</button>
            <button>New</button>
            <button>Save</button>
        </div>
        <edit-line></edit-line>
        <button @click='addLine'> Add new line </button>
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
            lines: [],
            mode: 'new'
        }
    },

    methods: {
        addLine(){

        }
    }
}
</script>
<style scoped>
    #app-wrapper{
        width: 40vw;
        margin: 10vw auto; 
        min-width: 400px;
    }

    #controls{
        margin-bottom: 0.5vw;
    }

    .active{
        background:indianred
    }

</style>


