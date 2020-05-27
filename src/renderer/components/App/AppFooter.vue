<template>
	<footer class="flex justify-center mt-1 AppFooter">
		<PortalTarget name="plugin-footer">
			<a :title="text" class="cursor-pointer text-theme-footer-text" @click="electron_openExternal(url)">
				{{ text }}
			</a>
		</PortalTarget>
	</footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
	name: "AppFooter",
})
export default class AppFooter extends Vue {
	text = "";
	url = "https://ark.io";

	created() {
		// @ts-ignore
		this.text = this.$t("APP_FOOTER.TEXT");
	}
}
</script>
