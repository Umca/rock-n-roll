<template>
  <span draggable='true' class='draggable' v-on:dragstart="handleDrag" :id=id v-on:dblclick='handleDblclick'>{{text}}</span>
</template>
<script>
export default {
  props: ['text', 'handleDrag', 'id', 'coords', 'handle', 'handleDblclick'],
  mounted(){
        let spanData = this.getCoords(this.$el)

        this.$el.style.left = `${this.coords.pageX - spanData.width / 2 - spanData.left }px`
        this.$el.style.top = `${this.coords.pageY - spanData.height / 2 - spanData.top }px`
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

