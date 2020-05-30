<template>
	<div id="app" class="theme-light">
		<router-view />
	</div>
</template>

<script lang="ts">
import "@/styles/style.css";

import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>
