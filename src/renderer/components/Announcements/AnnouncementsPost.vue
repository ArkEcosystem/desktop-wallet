<template>
	<div class="relative flex flex-col AnnouncementsPost md:flex-row items-top">
		<button
			v-show="!isRead"
			class="absolute top-0 right-0 transition AnnouncementsPost__close"
			:disabled="isRead"
			@click="emitRead"
		>
			<SvgIcon class="fill-current" name="cross" view-box="0 0 15 15" />
		</button>

		<div class="flex flex-col justify-start flex-none w-48">
			<span class="font-semibold AnnouncementsPost__date">
				{{ formattedDate }}
				<span class="text-theme-page-text-light">
					{{ weekday }}
				</span>
			</span>

			<a :title="title" class="items-center hidden mt-2 cursor-pointer md:flex" @click="openInBrowser(url)">
				<SvgIcon class="mr-2" name="open-external" view-box="0 0 12 12" />

				{{ $t("ANNOUNCEMENTS.READ_MORE") }}
			</a>
		</div>

		<div class="pr-12">
			<h2
				:class="isRead ? 'text-theme-page-text-light' : 'text-theme-page-text'"
				class="mt-4 text-2xl AnnouncementsPost__title md:mt-0"
			>
				{{ title }}
			</h2>

			<p v-if="!isRead" class="mt-2 AnnouncementsPost__summary">
				{{ summary }}
			</p>

			<a :title="title" class="flex items-center mt-4 cursor-pointer md:hidden" @click="openInBrowser(url)">
				<SvgIcon class="mr-2" name="open-external" view-box="0 0 12 12" />

				{{ $t("ANNOUNCEMENTS.READ_MORE") }}
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { SvgIcon } from "@/components/SvgIcon";

@Component({
	name: "AnnouncementsPost",

	components: {
		SvgIcon,
	},
})
export default class AnnouncementsPost extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	// @ts-ignore
	date;

	@Prop({
		type: String,
		required: true,
	})
	// @ts-ignore
	title;

	@Prop({
		required: true,
		validator: (value) => typeof value === "string" || value === null,
	})
	// @ts-ignore
	summary;

	@Prop({
		type: String,
		required: true,
	})
	// @ts-ignore
	url;

	@Prop({
		type: Boolean,
		required: true,
	})
	// @ts-ignore
	isRead;

	get formattedDate() {
		// @ts-ignore
		return this.formatter_date(this.date, "D MMMM");
	}

	get weekday() {
		// @ts-ignore
		return this.formatter_date(this.date, "dddd");
	}

	emitRead() {
		// @ts-ignore
		this.$emit("read", this.announcement);
	}

	// @ts-ignore
	openInBrowser(url) {
		// @ts-ignore
		this.electron_openExternal(url);
		setTimeout(() => this.emitRead(), 2000);
	}
}
</script>

<style scoped>
.AnnouncementsPost__close {
	/* The close button is shown only on hover over the entire announcement */
	@apply .flex .cursor-pointer .text-theme-option-button-text .bg-theme-button .rounded .p-2 .-mt-px .opacity-0;
}
.AnnouncementsPost:hover > .AnnouncementsPost__close {
	@apply .opacity-100;
}
.AnnouncementsPost:hover > .AnnouncementsPost__close:hover {
	@apply .opacity-50;
}
.AnnouncementsPost__date {
	line-height: 1.75rem;
}
.AnnouncementsPost__title {
	line-height: 1.75rem;
}
</style>
