<script>
	import { fade } from 'svelte/transition';
	import Menu from './menu.svelte'
	
	let CompAble = false;

	function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}
	async function first(){
		await sleep(400)
		CompAble = true
	}
	first()
</script>

<main>
	<p id="title" transition:fade>PixelMV Trans</p>
	<Menu></Menu>
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	#title {
		margin-top: 50px;
		font-size: 4em;
		margin-bottom: -60px;
		font-family: Roboto;
		font-weight: lighter;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>