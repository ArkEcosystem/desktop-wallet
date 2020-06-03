import { select, withKnobs } from "@storybook/addon-knobs";

import XCircle from "./Circle.vue";

export default { title: "Basic / Circle", decorators: [withKnobs] };

export const Blank = () => ({
	components: { XCircle },
	props: {
		size: {
			default: select("Size", ["small", "default"], "default"),
		},
	},
	template: `
		<div class="p-5">
		        <div class="mb-5"></div>
			<XCircle class="border-gray-200 -mr-3" :size="size"></XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-gray-200 -mr-3" :size="size"></XCircle>
			<XCircle class="border-gray-200 -mr-3" :size="size"></XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-gray-200 -mr-3" :size="size"></XCircle>
			<XCircle class="border-red-200 -mr-3" :size="size"></XCircle>
			<XCircle class="border-yellow-200 -mr-3" :size="size"></XCircle>
			<XCircle class="border-green-400" :size="size"></XCircle>

		</div>
	`,
});

export const Icon = () => ({
	components: { XCircle },
	props: {
		size: {
			default: select("Size", ["small", "default"], "default"),
		},
	},
	template: `
		<div class="p-5">
		        <div class="mb-5">With icon (slot)</div>
			<XCircle class="border-gray-200 -mr-3 text-green-200" :size="size"> ↑ </XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-gray-200 -mr-3 text-green-200" :size="size"> ↑ </XCircle>
			<XCircle class="border-red-200 text-red-200 -mr-3" :size="size"> ↓ </XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-yellow-200 text-yellow-200 -mr-3" :size="size">₿</XCircle>
			<XCircle class="border-gray-200 -mr-3 text-green-200" :size="size"> ↑ </XCircle>
			<XCircle class="border-red-200 text-red-200 -mr-3" :size="size"> ↓ </XCircle>
			<XCircle class="border-green-400 -mr-3 text-green-400" :size="size"> ↑ </XCircle>
			<XCircle class="border-yellow-200 -mr-3 text-yellow-200" :size="size"> ↑ </XCircle>

		</div>
	`,
});

export const AvatarMode = () => ({
	components: { XCircle },
	props: {
		size: {
			default: select("Size", ["small", "default"], "default"),
		},
	},
	template: `
		<div class="p-5">
		        <div class="mt-4 mb-5">Renders with avatar css when "avatarId" is provided</div>
			<XCircle class="border-red-200 text-red-200 -mr-3" avatarId="test2" :size="size"></XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-red-200 text-red-200 -mr-3" avatarId="test2" :size="size"></XCircle>
			<XCircle class="border-green-400 -mr-3 text-green-400" :size="size"> ↑ </XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-red-200 text-red-200 -mr-3" avatarId="test2" :size="size"></XCircle>
			<XCircle class="border-red-200 text-red-200 -mr-3" :size="size"> ↓ </XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-yellow-200 text-yellow-200 -mr-3" :size="size">₿</XCircle>
			<XCircle class="border-red-200 text-red-200 -mr-3" avatarId="test2" :size="size"></XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-red-200 text-red-200 -mr-3" avatarId="test2" :size="size"></XCircle>
			<XCircle class="border-red-200 -mr-3" :size="size"></XCircle>
			<XCircle class="border-yellow-200 -mr-3" :size="size"></XCircle>
			<XCircle class="border-green-400" :size="size"></XCircle>

		        <div class="mt-4 mb-5"></div>
			<XCircle class="border-red-200 text-red-200 -mr-3" avatarId="test2" :size="size"></XCircle>
			<XCircle class="border-red-200 text-red-200 -mr-3" :size="size"> ↓ </XCircle>
			<XCircle class="border-green-400 -mr-3 text-green-400" :size="size"> ↑ </XCircle>
			<XCircle class="border-yellow-200 -mr-3 text-yellow-200" :size="size"> ↑ </XCircle>

		</div>
	`,
});
