<template>
	<div id="app" class="theme-light">
		<router-view />
	</div>
</template>

<script lang="ts">
	import "@/app/styles/style.css";

	import { Component, Vue } from "vue-property-decorator";

	@Component
	export default class App extends Vue {}
</script>
