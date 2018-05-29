<template>
    <div id="popupBox" class= "popup" v-show="isShown">
    <div class="popup-content">
        <div class="popup-head">
            <span class="close" @click='close'>×</span>
            <h2>Who did you lost ?</h2>
        </div>
        <div class="popup-main">
            <div class="popup-form">
                    <form action="" method="" @submit.prevent="save" lang="en">
                        <fieldset>
                            <legend>Pet</legend>
                            <label for="animal">
                                <span class="label">Choose animal</span>
                                <select 
                                    name="animal" 
                                    class="select-field"
                                    @change="handleAnimal"
                                    required
                                    @invalid="invalideMsg"
                                >
                                    <option disabled selected value> -- select -- </option>
                                    <option value="cat">Cat</option>
                                    <option value="dog">Dog</option>
                                    <option value="bird">Bird</option>
                                </select>
                            </label>
                                <breed-select 
                                v-show = "breed.length > 0"
                                :handleInput="filterBreeds"
                                :chosenBreed="chosenBreed"
                                :handleOption="handleOption"
                                :breeds = "breed"></breed-select>
                            <label for="age">
                                <span>Choose age</span>
                                <input type="number" 
                                name="age" 
                                step="0.1" 
                                class="input-field"
                                v-model="age"
                                >
                            </label>
                            <label for="color">
                                <span>Color</span>
                                <input type="text" 
                                name="color"  
                                class="input-field"
                                v-model='color'
                                >
                            </label>
                            <label for="photo">
                                <span class="label">Photo URL</span>
                                <input type="text" 
                                name="photo"  
                                class="input-field"
                                required
                                @invalid="invalideMsg"
                                :v-model="photo"
                                >
                            </label>
                            <label>
                            <span>&nbsp;</span>
                            <input 
                            type="submit" 
                            value="Save" 
                            /></label>
                        </fieldset>
                        <fieldset>
                            <legend>Your contacts</legend>
                            <label for="name">
                                    <span class="label">Name </span>
                                    <input 
                                    @invalid="invalideMsg"
                                    type="text" 
                                    class="input-field" 
                                    name="name" 
                                    v-model="name"
                                    required
                                    />
                            </label>
                            <label for="email">
                                <span class="label" >Email</span>
                                <input type="email" 
                                class="input-field" 
                                name="email" 
                                v-model="email"
                                />
                            </label>
                            <label>
                                <span class="label">Telephone</span>
                                <input type="tel" 
                                class="tel-number-field" 
                                @invalid="invalideMsg"
                                required
                                name="tel" 
                                v-model="tel"
                                maxlength="15"
                                />
                            </label>
                        </fieldset>
                    </form>

                    <label for="toDelete" class="popup-delete">Delete ?</label>
                        <input type="checkbox" name="toDelete"/>
                        <span class="checkmark"></span>
                    
                    
            </div>
        </div>
        <div class='popup-foot'>
            <p>Contact us if you want to help.</p>
            <p><b>Email: </b>@gmail.com</p>
            <p><b>Tel.:</b> 044 765 999 17</p>
        </div>
    </div>
</div>
</template>
<script>
import { EventBus } from '../utils/eventBus'
import BreedSelect from './BreedSelect'
import { cats, dogs, birds } from '../utils/data'

export default {
    
    data(){
        return {
            types: {
                cats,
                dogs,
                birds
            },
            options: ['cat', 'dog', 'bird'],
            breed: [],
            chosenBreed:'',
            animal: 'Cat',
            color: '',
            age: '',
            name: '',
            email: '',
            tel: '',
            photo: ''
        }
    },

    watch: {
        animal(){
            if(this.animal){
                this.breed = this.types[`${this.animal.toLowerCase()}s`]
            } else {
                // debugger
                this.breed.length = 0
            }
        }
    },

    props: ['isShown', 'info'],

    components: {
        'breed-select': BreedSelect
    },

    methods: {
        close(){
            EventBus.$emit('modal_closed')
        },

        handleAnimal(e){
            this.animal = e.target.value
            // this.breed = this.types[`${e.target.value.toLowerCase()}s`]
            this.chosenBreed =""
        },

        filterBreeds(ev){
            this.chosenBreed = ev.target.value
            this.breed = this.types[`${this.animal.toLowerCase()}s`].filter(e => e.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)
        },

        handleOption(val){
            this.chosenBreed = val
        },

        invalideMsg(ev){
            ev.target.setCustomValidity('');
            if (!ev.target.validity.valid){
                ev.target.setCustomValidity('This field is required.')
            }
        },

        save(e){
            let result = {}
            for(let i = 0 ; i < e.target.elements.length ; i++){
                this[e.target.elements[i].name] = e.target.elements[i].value
                result[e.target.elements[i].name] = e.target.elements[i].value
            }
            result.breed = this.chosenBreed
            EventBus.$emit('new_marker', result)

            this.cleanState1()
        },

        cleanState1(){
            this.breed = []
            this.chosenBreed = ''
            this.animal = 'Cat'
            this.color = ''
            this.age = ''
            this.name = ''
            this.email = ''
            this.tel = ''
            this.photo = ''
        }
    }
    
}
</script>
>
<style scoped>
.popup {
    display: block;
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
    font-family: 'Lato', sans-serif;
}
.popup-content {
    position: relative;
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    width: 38%;
    min-width: 630px;
    height: 500px;
    /* overflow: auto; */
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: animatetop;
    animation-duration: 0.4s;
}

.popup-head {
    padding: 2px 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    color: black;
    position: sticky;
    top: -1px;
}
.popup-main {
    padding: 2px 16px;
    height: 68%;
    overflow: auto;
}
.popup-form{
    padding: 20px 12px 10px 20px;
    font: 13px Arial, Helvetica, sans-serif;
}
.popup-form form{
    display: flex;
}
.popup-form label{
    display: block;
    margin: 0px 0px 15px 0px;
}
.popup-form label > span{
    width: 105px;
    font-weight: bold;
    float: left;
    padding-top: 8px;
    padding-right: 20px;
}
.popup-form span.required{
    color:red;
}
.popup-form .tel-number-field{
    width: 48%;
}
.popup-form input.input-field, .popup-form .select-field{
    width: 48%; 
}
.popup-form input.input-field, 
.popup-form .tel-number-field, 
 .popup-form .select-field{
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 1px solid #C2C2C2;
    box-shadow: 1px 1px 4px #EBEBEB;
    -moz-box-shadow: 1px 1px 4px #EBEBEB;
    -webkit-box-shadow: 1px 1px 4px #EBEBEB;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    padding: 7px;
    outline: none;
}
.popup-form .input-field:focus, 
.popup-form .tel-number-field:focus,  
.popup-form .select-field:focus{
    border: 1px solid #0C0;
}
.popup-form input[type=submit],
.popup-form input[type=button]{
    border: none;
    padding: 8px 15px 8px 15px;
    background: #FF8500;
    color: #fff;
    box-shadow: 1px 1px 4px #DADADA;
    -moz-box-shadow: 1px 1px 4px #DADADA;
    -webkit-box-shadow: 1px 1px 4px #DADADA;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
}
.popup-form input[type=submit]:hover,
.popup-form input[type=button]:hover{
    background: #EA7B00;
    color: #fff;
}
.popup-form .label:after{
    content: ' *';
    color: #FF8500;
}
.popup-form .popup-delete {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 19px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.popup-delete input {
  position: absolute;
  opacity: 1;
  cursor: pointer;
}

 /* .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
} */

/*.popup-delete:hover input ~ .checkmark {
  background-color: #ccc;
}

.popup-delete input:checked ~ .checkmark {
  background-color: #FF8500;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.popup-delete input:checked ~ .checkmark:after {
  display: block;
}

.popup-delete .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
} */
.popup-foot {
    padding: 15px 16px;
    font-size: 14px;
    line-height: 21px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    
}

.popup-foot p {
    margin: 0;
}

/* add animation effects */
@-webkit-keyframes animatetop {
    from {top:-300px; opacity:0}
    to {top:0; opacity:1}
}

@keyframes animatetop {
    from {top:-300px; opacity:0}
    to {top:0; opacity:1}
}

/* close button style */
.close {
    color: #FF8500;
    float: right;
    font-size: 28px;
    font-weight: bold;
}
.close:hover, .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}

fieldset{
    border: 1px solid #ccc;
    border-radius: 5px;
}

legend{
    text-transform: uppercase;
}

</style>

