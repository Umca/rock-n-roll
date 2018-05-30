<template>
    <div id="popupBox" class= "popup" v-show="isShown">
    <div class="popup-content">
        <div class="popup-head">
            <span class="close" @click='close'>×</span>
            <h2>Who did you lost/found ?</h2>
        </div>
        <div class="popup-main">
            <div class="popup-form">
                    <form action="" method="" @submit.prevent="save">
                        <div class="fieldsets-container">
                            <fieldset>
                                <legend>Pet</legend>
                                <label for="animal">
                                    <select 
                                        required
                                        name="animal" 
                                        class="select-field"
                                        @change="handleAnimal"
                                        
                                    >
                                        <option disabled selected class="disabled"> Choose animal</option>
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
                                    :breeds = "breed"
                                ></breed-select>

                                <input-field
                                    v-model="age"
                                    type="number"
                                    label="Animal age"
                                    name="age"
                                    step="0.1"

                                ></input-field>

                                <input-field
                                    v-model='photo'
                                    type="url"
                                    label="Photo URL"
                                    name="photo"
                                    isRequired="true"
                                ></input-field>

                                <label for="color">
                                    <span>Color</span>
                                    <input type="color" 
                                    name="color"  
                                    class="input-field"
                                    v-model='color'
                                    >
                                </label>
                                <div class="status-container">
                                    <input type="checkbox" name="status" id="status" v-model='found'>
                                    <label for="status">
                                        <span >{{statusText}}</span>
                                        <span class="status"></span>
                                    </label>
                                </div>
                            </fieldset>

                            <fieldset>
                                <legend>Your contacts</legend>
    
                                <input-field
                                    v-model="name"
                                    type="text"
                                    name="name"
                                    label="Name"
                                    isRequired="true"
                                ></input-field>
      
                                <input-field
                                    v-model="email"
                                    type="text"
                                    name="email"
                                    label="Email"
                                ></input-field>

                                <input-field
                                    v-model="tel"
                                    type="tel"
                                    name="tel"
                                    label="Telephone"
                                    isRequired=true
                                    maxlength="15"
                                ></input-field>
                                
                            </fieldset>
                        </div>

                        <div class='control-buttons'>
                            <label>
                                <input 
                                type="submit" 
                                value="Save" 
                                />
                            </label>
                            <label class="popup-delete">Delete ?
                                <input type="checkbox" name="toDelete" v-model='toDelete'/>
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </form>                    
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
import InputField from './InputField'
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
            color: "#f210f8",
            age: '',
            name: '',
            email: '',
            tel: '',
            photo: '',
            found: false,

            toDelete: false
        }
    },

    computed:{
        statusText(){
            if(this.found){
                return 'Found'
            } else {
                return 'Lost'
            }
        }
    },

    props: ['isShown', 'info'],

    components: {
        'breed-select': BreedSelect,
        'input-field':InputField
    },

    mounted(){
        let select = document.querySelector('select')
        for(let i = 0 ; i < select.children.length; i++){
            if(!select.children[i].dataset.hasOwnProperty('default')){
                select.children[i].style.color= 'black'
            }
        }
    },

    methods: {
        close(){
            EventBus.$emit('modal_closed')
        },

        handleAnimal(e){
            this.animal = e.target.value
            this.breed = this.types[`${e.target.value.toLowerCase()}s`]
            this.chosenBreed =""
        },

        filterBreeds(ev){
            this.chosenBreed = ev.target.value
            this.breed = this.types[`${this.animal.toLowerCase()}s`].filter(e => e.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)
        },

        handleOption(val){
            this.chosenBreed = val
        },

        save(e){
            let result = {}
            result.name = this.name
            result.email = this.email
            result.tel = this.tel
            result.found = this.found

            result.breed = this.chosenBreed
            result.animal = this.animal
            result.color = this.color === "#f210f8" ? false : this.color
            result.age = this.age
            result.photo = this.photo

            EventBus.$emit('new_marker', {
                    result
                })
            this.cleanState()
        },

        cleanState(){
            this.breed = []
            this.chosenBreed = ''
            this.animal = 'Cat'
            this.color = "#f210f8"
            this.age = ''
            this.name = ''
            this.email = ''
            this.tel = ''
            this.photo = ''
            this.status = false
        },

                invalideMsg(ev){
            ev.target.setCustomValidity('');
            if (!ev.target.validity.valid){
                ev.target.setCustomValidity('This field is required.')
            }
        },
    }
    
}
</script>

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
}
.popup-form{
    padding: 20px 12px 10px 20px;
    font: 13px Arial, Helvetica, sans-serif;
}
.popup-form .fieldsets-container{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.popup-form form label{
    display: flex;
    justify-content: space-between;
    margin: 0px 0px 15px 0px;
}

.popup-form select{
    width: 100%; 
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: none;
    box-shadow: none;
    padding: 7px 0;
}
.popup-form select:focus{
    outline: none;
    border-bottom-color: rgb(113, 166, 252);
}
.popup-form select option::selected{
    color: black;
    text-transform: capitalize;
}

label > span{
    padding-top: 8px;
}
.popup-form .input-field:focus, 
.popup-form .tel-number-field:focus,  
.popup-form .select-field:focus{
    border: 1px solid #8fbefa;
}
.popup-form input[type=submit],
.popup-form input[type=button]{
    border: none;
    padding: 8px 15px 8px 15px;
    background: #FF8500;
    color: #fff;
    font-size: 16px;
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
    cursor: pointer;
}
.popup-form .label:after{
    content: ' *';
    color: #FF8500;
}
.popup-form input[type=color]{
    padding: 0;
    height: 30px;
    width: 30px;
    border: none;
    background-color: white;
}
.popup-form .status-container{
    position: relative;
}

.popup-form .status-container .status{
    padding-top: 6px;
}

.popup-form .status-container input{
    display: none;
}
.popup-form .status-container .status{
    position: relative;
    width: 45px;
    padding: 0;
    margin-bottom: 0;
}
.popup-form .status-container .status::before,
.popup-form .status-container .status::after{
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
}
.popup-form .status-container span.status:hover {
    cursor: pointer;
}
.popup-form .status-container span.status:before{
    width: 45px;
    left: 0;
    height: 25px;
    background-color: #ccc;
    border-radius: 50px;
}
.popup-form .status-container span.status:after{
    /* left: 201px; */
    left: 5px;
    width: 17px;
    height: 17px;
    border-radius: 10px;
    background-color: #fff;
    transition: left .25s, background-color .25s;
}
.popup-form .status-container  input[type="checkbox"]:checked + label span.status::after{
    left: 23px;
    background-color: #FF8500;
}

.popup-form .status-container .status + label{
    margin-bottom: 10px;
}

.popup-form .control-buttons{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.popup-form .popup-delete {
  display: block;
  position: relative;
  padding-left: 35px;
  padding-top: 4px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.popup-delete input {
  position: absolute;
  display: none;
  cursor: pointer;
}

 .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  background-color: #eee;
  padding-right: 0;
  padding-top: 0;
  width: 25px;
}

.popup-delete:hover input ~ .checkmark {
    background-color: #ccc;
    width: 25px;
}

.popup-delete input:checked ~ .checkmark {
    width: 25px;
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
}
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

.close {
    color: #FF8500;
    float: right;
    font-size: 28px;
    font-weight: bold;
    padding-top: 2px;
}
.close:hover, .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}

fieldset{
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 44%;
    padding: 10px 1em;
}

legend{
    text-transform: uppercase;
}

</style>

