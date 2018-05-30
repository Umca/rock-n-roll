<template>
    <label :for="name">
        <span :class="{label: isRequired}">{{label}}</span>
        <input :type="type" 
            :name="name"
            :value="value"
            @input="$emit('input', $event.target.value)"
            :step="step" 
            :maxlength="maxlength"
            class="input-field"
            :required="isRequired"
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
    ]
}
</script>
<style>
label{
    display: block;
    margin: 0px 0px 15px 0px;
}
label > span{
    width: 105px;
    font-weight: bold;
    float: left;
    padding-top: 8px;
    padding-right: 20px;
}
span.required{
    color:red;
}
input.input-field{
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
    width: 48%
}
.input-field:focus{
    border: 1px solid #8fbefa;
}

.label:after{
    content: ' *';
    color: #FF8500;
}

</style>


