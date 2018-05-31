<template>
    <div class="breed_finder"> 
        <div class="breed_finder_header"> 
            <label> 
                <input type="search" id="breed_search"
                    name="breed_search"
                    @input="handleInput"
                    :value="chosenBreed" 
                    placeholder="Choose breed"
                >
            </label> 
        </div> 
        <ul class="breed_finder_results" style="display: block;">
            <li v-for="br in breeds" :key="br" @click="handleOption(br)">{{br}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['breeds', 'handleInput','chosenBreed', 'handleOption'],
}
</script>
<style>
    .breed_finder {
        border: 1px solid #8f8f8f;
        box-sizing: border-box;
        margin-bottom: 20px;
        font-family: 'Lato', sans-serif;
    }
    .breed_finder .breed_finder_header {
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid #8f8f8f;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQIW2M8cnjffxtbJ0YGKAAzkAXhMjBBuABMJQAWEA9J3TkpgAAAAABJRU5ErkJggg==);
        padding: 0.625rem;
    }
    .breed_finder .breed_finder_header p{
        margin-top: 0;
        font-weight: bold;
    }
    .breed_finder .breed_finder_results {
        box-sizing: border-box;
        height: 10.625rem;
        max-height: 100px;
        list-style-type: none;
        margin-bottom: 0.625rem;
        margin-top: 0.625rem;
        overflow: auto;
        list-style: none;
        padding-left: 15px;
    }
    #breed_search{
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        border: none;
        border-radius: none;
        border-bottom: 1px solid #C2C2C2;
        box-shadow: 1px 1px 4px #EBEBEB;
        -moz-box-shadow: 1px 1px 4px #EBEBEB;
        -webkit-box-shadow: 1px 1px 4px #EBEBEB;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        padding: 7px 0;
        outline: none;
    }
    #breed_search:focus{
        border-bottom: 1px solid #8fbefa;
    }
    .breed_finder .breed_finder_results li {
        font-size: 12px;
        padding: 2px 0;
        list-style-type: none;
        cursor: pointer;
    }

    .breed_finder_header label{
        margin: 0;
    }
</style>


