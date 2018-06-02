<template>
    <div :class="classObj">
        <div class="filters-head">
            <h2>Who are you looking for?</h2>
        </div>
        <div class="filters">
            <label for="animal">
                <select 
                    required
                    name="animal" 
                    class="select-field"
                    @change="handleAnimal"
                    
                >
                    <option disabled selected class="disabled"> Choose animal</option>
                    <option value="all"> All</option>
                    <option value="cat">Cat</option>
                    <option value="dog">Dog</option>
                    <option value="bird">Bird</option>
                </select>
            </label>

            <breed-select 
                v-show = "breed.length > 0"
                :handleInput="filterBreeds"
                :chosenBreed="filters.chosenBreed"
                :handleOption="handleOption"
                :breeds = "breed"
            ></breed-select>

            <input-field
                v-model="filters.nickname"
                type="text"
                label="Animal name"
                name="nickname"

            ></input-field>

            <input-field
                v-model="filters.age"
                type="number"
                label="Animal age"
                name="age"
                step="0.1"

            ></input-field>

            <input-field
                v-show = "userCoords.lat"
                v-model="filters.radius"
                type="number"
                label="Within the radius, km"
                name="radius"
                step="0.1"

            ></input-field>

            <label for="color">
                <span>Color</span>
                <input type="color" 
                name="color"  
                class="input-field"
                v-model='filters.color'
                >
            </label>
            <hr color= "#ccc" size = "1">
            <div class="radio-container">
                <radio
                    label="Found"
                    v-model="filters.status"
                    value="found"
                    name="status"
                ></radio>
                <radio
                    label="Lost"
                    v-model="filters.status"
                    value="lost"
                    name="status"
                ></radio>
                <radio
                    label="All"
                    v-model="filters.status"
                    value="all"
                    name="status"
                ></radio>
            </div> 
        </div>
    </div>
</template>
<script>
import BreedSelect from './BreedSelect'
import InputField from './InputField'
import Radio from './Radio'
import { cats, dogs, birds } from '../utils/data'

const initialFiltersState = {
    chosenBreed:'',
    animal: '',
    color: "#f210f8",
    age: '',
    nickname: '',
    status: 'all',
    radius: undefined
}
export default {
    props: ['isShown', 'userCoords'],
    components: {
        'breed-select': BreedSelect,
        'input-field':InputField,
        'radio':Radio
    },
    beforeUpdate(){
        if(this.isShown){
            let appliedFilters = {}
        for(let key in this.filters){
            if(this.filters.hasOwnProperty(key)){
                if(this.filters[key] !== initialFiltersState[key]){
                    appliedFilters[key] = this.filters[key]
                }
            }
        }

            this.$parent.$emit('filter_apply', appliedFilters)
        }
        
    },
    data(){
        return {
            types: {
                cats,
                dogs,
                birds
            },
            options: ['cat', 'dog', 'bird'],
            breed: [],
            
            filters: {
                chosenBreed:'',
                animal: '',
                color: "#f210f8",
                age: '',
                nickname: '',
                status: 'all',
                radius: undefined
            }
        }
    },
    computed: {
        classObj() {
                return {
                    filters_wrapper: true,
                    active: this.isShown
                }
        },
    },
    methods: {
         handleAnimal(e){
            this.filters.animal = e.target.value
            if(this.filters.animal === 'all'){
                this.breed = []
                this.filters.chosenBreed =""
                return
            }
            this.breed = this.types[`${e.target.value.toLowerCase()}s`]
        },

        filterBreeds(ev){
            this.filters.chosenBreed = ev.target.value
            let temp = this.types[`${this.filters.animal.toLowerCase()}s`].filter(e => e.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)
            if(temp.length > 0){
                this.breed = temp
            } else {
                this.breed = this.types[`${this.filters.animal.toLowerCase()}s`]
            }
        },

        handleOption(val){
            this.filters.chosenBreed = val
        },

        cleanState(){
            this.filters =  initialFiltersState
        }
    }
}
</script>
<style>
    .filters_wrapper{
        height: 668px;
        width: 250px;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        border: 1px solid #ccc;
        opacity: 1;
        transition:  left 0.3s ;
        font-family: 'Lato', 'Arial', sans-serif;
    }
    .active{
        left: -256px;
    }
    .filters{
        padding: 10px 1em;
    }
    .filters-head{
        padding: 2px 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
        color: black;
        text-align: center;
    }
    .filters-head h2{
        font-size: 1.15em;
    }

</style>


