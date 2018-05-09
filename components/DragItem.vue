<template>

    <span 
        draggable='true' 
        class='draggable' 
        v-on:dragstart="handleDrag" 
        :id=id 
        v-on:dblclick='handleDblclick'>{{text}}
    </span>
</template>
<script>
import { EventBus } from '../utils/eventBus';
export default {
  props: ['text', 'handleDrag', 'id', 'clickCoords', 'handleDblclick', 'mode'],
  mounted(){
        if(this.mode === 'new'){
            let spanData = this.getCoords(this.$el)

            this.$el.style.left = `${this.clickCoords.pageX - spanData.width / 2 - spanData.left }px`
            this.$el.style.top = `${this.clickCoords.pageY - spanData.height / 2 - spanData.top }px`

            EventBus.$emit('item-added', {id: this.id, coords: { left: this.$el.style.left, top: this.$el.style.top}})
        } else {
            this.$el.style.left = this.clickCoords.left
            this.$el.style.top = this.clickCoords.top
        }
        
  },
  methods:{
        getCoords(el){
            return el.getBoundingClientRect()
        },
  }
}
</script>
<style>
    .draggable{
        position: absolute;
        font-size: 1.2vw;
    }
</style>

