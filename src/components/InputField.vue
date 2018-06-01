<template>
    <label :for="name">
        <input :type="type" 
            :name="name"
            :value="value"

            @input="$emit('input', $event.target.value)"
            @change="validationCheck"
            @invalid="validate"
            :step="step" 
            :maxlength="maxlength"
            :required="isRequired"
            :placeholder="name"
            min='0'
        />
    </label>
</template>
<script>
export default {
    props: [
        'type',
        'name',
        'label',
        'step',
        'value',
        'maxlength',
        'isRequired'
    ],

    data(){
        return {

        }
    },

    methods: {
        
        validationCheck(ev){
            if(!(this.type !== 'number' || !this.type !== 'text')){
                let answer = this[`validate${this.name.slice(0,1).toUpperCase() + this.name.slice(1)}`](ev.target.value)
                if(answer.isValid){
                    this.$el.children[0].classList.add('valid')
                } else {
                    ev.target.setCustomValidity('')
                    this.$el.children[0].classList.add('invalid')
                    ev.target.setCustomValidity(answer.message)
                }
            }
        },

        validateEmail(email) {
            let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return {
                isValid: reg.test(String(email).toLowerCase()),
                message: 'Please, enter valid email.' 
            };
        },

        validateTel(tel){
            let reg= /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/
            return {
                isValid: reg.test(String(tel).toLowerCase()),
                message: 'Please, enter valid telephone.'
            }
        },

        validatePhoto(photo){
            let reg = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/g
            return {
                isValid: reg.test(String(photo).toLowerCase()),
                message: 'Please, enter valid url.'
            }
        },

        validate(ev){
            ev.target.setCustomValidity('')
            if(!ev.target.validity.valid){
                ev.target.setCustomValidity('This field is required.')
            }
        }
    }
}
</script>
<style >
label{
    display: block;
    margin: 0px 0px 15px 0px;
    text-align: center;
}

input{
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 1px solid transparent;
    border-bottom: 1px solid #c2c2c2;
    padding: 7px 0;
    outline: none;
    transition: border-color 0.3s;
    width: 100%;
}
input:focus{
    outline: none;
    border-bottom-color: rgb(113, 166, 252);

}
input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; }

input::placeholder{
    color: #ccc;
    text-transform: capitalize;
}
input.input-field::-moz-placeholder{
    color: #ccc;
    text-transform: capitalize;
}
input.input-field::-webkit-input-placeholder{
    color: #ccc;
    text-transform: capitalize;
}
input.input-field::-ms-input-placeholder{
    color: #ccc;
    text-transform: capitalize;
}
.invalid{
    border-bottom-color:salmon;
}
.valid{
    border-bottom-color:#0C0;
}
</style>


