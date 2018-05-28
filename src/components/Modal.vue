<template>
    <div id="popupBox" class= "popup" v-show="isShown">
    <div class="popup-content">
        <div class="popup-head">
            <span class="close" @click='close'>×</span>
            <h2>Who did you lost ?</h2>
        </div>
        <div class="popup-main">
            <div class="popup-form">
                <div class="popup-form-heading"></div>
                    <form action="" method="">
                        <label for="name">
                                <span>Name <span class="required">*</span></span>
                                <input type="text" class="input-field" name="name" value="" />
                        </label>
                        <label for="email">
                            <span>Email <span class="required">*</span></span>
                            <input type="text" class="input-field" name="email" value="" />
                        </label>
                        <label>
                            <span>Telephone</span>
                            <input type="text" class="tel-number-field" name="tel_no_1" value="" maxlength="10" />
                        </label>
                        <label for="animal">
                            <span>Choose animal:</span>
                            <select name="animal" 
                                class="select-field"
                                @change="handleAnimal"
                                v-model="animal"
                            >
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
                            <span>Choose age:</span>
                            <input type="number" name="age" step="0.1" class="input-field">
                        </label>
                        <label for="color">
                            <span>Color:</span>
                            <input type="text" name="color"  class="input-field">
                        </label>
                        
                        <label>
                            <span>&nbsp;</span>
                            <input type="submit" value="Save" /></label>
                    </form>
            </div>
        </div>
        <div class='popup-foot'>
            <p>Contact us if you want to help.</p>
            <p><span class='popup-foot_email'></span> qwerty@gmail.com</p>
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
            breeds: {
                cats,
                dogs,
                birds
            },
            breed: [],
            chosenBreed:'',
            animal: 'Cat',
            color: '',
            age: '',

            contacts: {
                name: '',
                email: '',
                phone: ''
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
            this.breed = this.breeds[`${this.animal.toLowerCase()}s`]
        },

        filterBreeds(ev){
            this.breed = this.breeds[`${this.animal.toLowerCase()}s`].filter(e => e.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)
        },

        handleOption(val){
            this.chosenBreed = val
        },

        handleInput(type, ev){
            
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
    width: 33%;
    min-width: 200px;
    max-height: 530px;
    overflow: auto;
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
}
.popup-main {
    padding: 2px 16px;
}
.popup-form{
    max-width: 90%;
    padding: 20px 12px 10px 20px;
    font: 13px Arial, Helvetica, sans-serif;
}
.popup-form label{
    display: block;
    margin: 0px 0px 15px 0px;
}
.popup-form label > span{
    width: 100px;
    font-weight: bold;
    float: left;
    padding-top: 8px;
    padding-right: 5px;
}
.popup-form span.required{
    color:red;
}
.popup-form .tel-number-field{
    width: 48%;
    text-align: center;
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
.popup-foot {
    padding: 15px 16px;
    font-size: 14px;
    line-height: 21px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
    
}

.popup-foot p {
    margin: 0;
}

.popup-foot_email{
    display: block;
    content:'1';
    background: url('data:image/png;base64,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');
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
</style>

