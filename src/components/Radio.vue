<template>
    <div>
        <input  type="radio" 
                :value="value"
                :id="label.toLowerCase()" 
                :name="name"
                @input="$emit('input', label.toLowerCase())"
                class="radio-button"
                />
        <label :for="label.toLowerCase()" 
                class="radio-button-click-target">
            <span>{{label}}</span><span class="radio-button-circle"></span>
        </label>
    </div>
</template>
<script>
export default {
    props: [
        'label', 'value', 'name'
    ]
}
</script>
<style>
    .radio-button {
        display: none;
    }
    .radio-button-click-target {
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        line-height: 1.5;
        position: relative;
    }

    .radio-button-circle {
        border-radius: 50%;
        cursor: pointer;
        display: block;
        height: 12px;
        left: 197px;
        position: absolute;
        top: 7px;
        transition: background-color .1s ease-out;
        vertical-align: middle;
        width: 12px;
        padding: 0;
    }
    .radio-button-circle:before{
        border: 3px solid #ccc;
        border-radius: 50%;
        content: '';
        display: inline-block;
        height: 20px;
        position: absolute;
        top: -7px;
        transition: border-color .1s ease-out,
        transform .1s ease-out;
        left: -7px;
        width: 20px;
    }

    .radio-button:checked + .radio-button-click-target .radio-button-circle {
        background-color: #FF8500;
    }

    .radio-button-click-target span{
        padding: 0;
    }   

</style>


