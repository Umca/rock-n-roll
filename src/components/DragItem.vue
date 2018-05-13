<template>
    <span 
        draggable = 'true' 
        class ='draggable' 
        :id = id 
        v-on:dragstart = 'handleDrag' 
        v-on:dblclick = 'handleDblclick'>{{text}}
    </span>
</template>
<script>
export default {
    props: [ 'mode', 'text', 'id', 'clickCoords', 'handleDrag', 'handleDblclick',],
    mounted(){
            if(this.mode === 'new'){
                let spanData = this.$el.getBoundingClientRect()

                this.$el.style.left = `${this.clickCoords.pageX - spanData.width / 2 - spanData.left }px`
                this.$el.style.top = `${this.clickCoords.pageY - spanData.height / 2  - spanData.top }px`

                this.$parent.$emit('item-added', {id: this.id, coords: { left: this.$el.style.left, top: this.$el.style.top}})
            } else {
                this.$el.style.left = this.clickCoords.left
                this.$el.style.top = this.clickCoords.top
            }
    },    
}
</script>
<style>
    [draggable=true] { 
        -khtml-user-drag: element; 
    }
    .draggable{
        position: absolute;
        font-size: 12px;
        font-weight: bold;
        font-family: 'Kalam', cursive, 'Arial', sans-serif;
        cursor: pointer;
    }
</style>

