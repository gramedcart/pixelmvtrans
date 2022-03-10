<script>
	import MainPage from './page/main/main.svelte'
	import LoadingPage from './page/loading/main.svelte'
	import ProjectPage from './page/project/main.svelte'
	import { proj } from './store'
	import Swal from "sweetalert2";
	let page = 0

	const ipc = require('electron').ipcRenderer
	function electronInit(){
		ipc.on('alert', (ev, arg) => {
			Swal.fire({
				icon: 'success',
				title: arg,
			})
		})
		ipc.on('warn', (ev, arg) => {
			Swal.fire({
				text: arg,
				icon: 'warning'
			})
		})
		ipc.on('cProject', () => {
			page = 1
		})
		ipc.on('open', (ev, arg) => {
			proj.update(n => arg)
			page = 2
		})
	}


	electronInit()
</script>

<main>
	{#if page === 0}
		<MainPage/>
	{/if}
	{#if page === 1}
		<LoadingPage></LoadingPage>
	{/if}
	{#if page === 2}
		<ProjectPage></ProjectPage>
	{/if}
</main>

<svelte:head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=VT323&display=swap%27");
    </style>
</svelte:head>