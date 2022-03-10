<script>
    import { proj } from "../../store"
    import { fade } from 'svelte/transition';
    const ipc = require('electron').ipcRenderer
    let projValue = {};
    let qvale = []
    let show = false
    let locale = ''
    proj.subscribe(value => {
		init(value)
	});

    function init(value){
		projValue = value;
        locale = value.project.initialLocale
        qvale = formatText(value.project.textList)
    }
    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}
    async function first(){
		await sleep(400)
		show = true
	}
    function formatText(textList, key='project.textList.'){
        let listof = []
        for(let i in textList){
            const c = textList[i]
            if(c.folder){
                listof = listof.concat(formatText(c.children, `${key}${i}.children.`))
            }
            else{
                listof.push([c.text[locale], `${key}${i}.text.${locale}`])
            }
        }
        return listof
    }

    function reactiveResize(el){
        const ele = this ?? el
        ele.style.height = (ele.scrollHeight) + "px";
    }

    function applyChange(){
        const q = this.dataset.val
        projValue = addto(q, this.value, projValue)
    }

    function saver(){
        console.log('saver')
        ipc.send('saver', projValue)
    }
    function translator(){
        console.log('translator')
        ipc.send('translator', formatText(projValue.project.textList))
    }

    ipc.on("transData", (ev, arg) => {
        console.log("trans")
        let pv = projValue
        for(const i in arg){
            pv = addto(arg[i][1], arg[i][0], pv)
        }
        console.log('pv')
        console.log(pv)
        init(pv)
    })

    const addto = (key, val,temppp) => { 
        let Keys = key.split('.');
        const fkey = Keys[0]
        if(temppp === undefined){
            temppp = {}
        }
        if(Keys.length==1){
            temppp[fkey] = val;
        }
        else{
            Keys.shift()
            if(temppp[fkey] === undefined){
                temppp[fkey] = {}
            }
            temppp[fkey] = addto(Keys.join('.'), val, temppp[fkey])
        }
        return temppp
    }
	first()
</script>
{#if show}
<main transition:fade>
    <header></header>
    <div id="top-placeholder"></div>
    <div id="container">
        {#each qvale as value, i}
            {#if value == '%placeholder%'}
                <div class="placeholder"></div>
            {:else}
                <textarea class="texts" data-val={`${value[1]}`} on:change={applyChange} on:input={reactiveResize} use:reactiveResize>{value[0]}</textarea>
            {/if}
        {/each}
    </div>
    <div class="btn" style="left: 15px;" on:click={saver}><i class="fas fa-save"></i></div>
    <div class="btn" style="left: 45px;" on:click={translator}><i class="fas fa-language"></i></div>
</main>
{/if}
<style>
    .btn{
        position: fixed;
        z-index: 2;
        height: 50px;
        top: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 5vw;
    }
    header{
        z-index: 1;
        width: 100vw;
        height: 50px;
        border-bottom: solid 1px #212121;
        position: fixed;
        top: 0px;
        background-color: white;
    }
    .texts{
        height: 10vh;
        width: 90vw;
        overflow-y: hidden;
        resize: none;
    }
    .placeholder{
        width: 90vw;
        height: 1px;
        background-color: #212121;
        margin-top: 3vh;
        margin-bottom: 3vh;
    }
    #top-placeholder{
        margin-top: 60px;
    }
    :global(body) {
        margin:0px;
        padding:0px;
    }
</style>