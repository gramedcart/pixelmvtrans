<script>
    import { proj } from "../../store"
    import { fade } from 'svelte/transition';
    import Swal from "sweetalert2";

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
                if(c.text[locale] !== undefined){
                    listof.push([c.text[locale], `${key}${i}.text.${locale}`])
                }
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
    async function translator(){
        const d = await Swal.fire(
            {
                title: "Eztrans 번역을 하시겠습니까?",
                text: "dotnet 6.0 x86이 설치되어있지 않으면 오류가 발생할 수 있습니다.",
                icon: "question",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: '예',
                denyButtonText: '아니요',
                cancelButtonText: 'dotnet 설치'
            }
        )
        if(d.isConfirmed){
            await Swal.fire(
                "완료되었다는 창이 나올 때 까지 아무것도 하지 말아주세요."
            )
            console.log('translator')
            Swal.fire({
                icon: 'info',
                title: '번역 중 입니다..',
                html: '<div id="transi">0%</div>',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            })
            ipc.send('translator', formatText(projValue.project.textList))
        }
        else if(!d.isDenied){
            if(d.isDismissed){
                console.log('dotnet')
                ipc.send('dotnet')
            }
        }
        ipc.on("transper", (ev, arg) => {
            document.querySelector('#transi').innerText = arg
        })
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
        Swal.fire({
            title: "완료되었습니다",
            icon: 'success'
        })
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
    <div id="con">
        <div id="container">
            {#each qvale as value, i}
                {#if value == '%placeholder%'}
                    <div class="placeholder"></div>
                {:else}
                    <textarea class="texts" data-val={`${value[1]}`} on:change={applyChange} on:input={reactiveResize} use:reactiveResize>{value[0]}</textarea>
                {/if}
            {/each}
        </div>
    </div>
    <div class="btn" style="left: 15px;" on:click={saver}><i class="fas fa-save"></i></div>
    <div class="btn" style="left: 45px;" on:click={translator}><i class="fas fa-language"></i></div>
</main>
{/if}
<style>
    #top-placeholder{
        margin-top: 20px;
    }
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
    #con{
        overflow-y: scroll;
        margin-top: 50px;
        height: calc(100vh - 50px);
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
    :global(body) {
        margin:0px;
        padding:0px;
    }
</style>