<script>
    import { fade } from 'svelte/transition';
    import Swal from "sweetalert2";
    let r = false
    const ipc = require('electron').ipcRenderer
    let CompAble = false;
	function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}
	async function first(){
        await sleep(400)
        CompAble = true
	}
    async function newProj(){
        ipc.send('newProj')
    }
	first()
</script>

<div class="container" style="margin-top: 120px;">
    <div class="container" style="width: 80%;">
        {#if CompAble}
            <button transition:fade on:click={newProj}>게임 열기</button>
        {/if}
    </div>
</div>

<style>
	.container{
		justify-content: space-evenly;
		flex-direction: row;
		display: flex;
		align-items: center;
	}
    :global(body) {
        overflow-y: hidden;
    }
</style>