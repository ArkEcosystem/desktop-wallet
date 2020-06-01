import { select, withKnobs } from "@storybook/addon-knobs";

import XButton from "./Button.vue";

export default { title: "Basic / Button", decorators: [withKnobs] };

export const Default = () => ({
	components: { XButton },
	props: {
		size: {
			default: select("Size", ["small", "default", "large"], "default"),
		},
	},
	template: `
		<div class="p-5 space-y-5">
			<div class="space-x-4">
				<XButton color="primary" :size="size">Primary</XButton>
				<XButton color="success" :size="size">Success</XButton>
				<XButton color="danger" :size="size">Danger</XButton>
				<XButton color="light" :size="size">Light</XButton>
			</div>

			<div class="space-x-4">
				<XButton color="primary" variant="plain" :size="size">Primary</XButton>
				<XButton color="success" variant="plain" :size="size">Success</XButton>
				<XButton color="danger" variant="plain" :size="size">Danger</XButton>
				<XButton color="light" variant="plain" :size="size">Light</XButton>
			</div>

			<div class="space-x-4">
				<XButton color="primary" variant="outline" :size="size">Primary</XButton>
				<XButton color="success" variant="outline" :size="size">Success</XButton>
				<XButton color="danger" variant="outline" :size="size">Danger</XButton>
				<XButton color="light" variant="outline" :size="size">Light</XButton>
			</div>
		</div>
	`,
});

export const Circle = () => ({
	components: { XButton },
	template: `
		<div class="space-x-4 p-5">
			<XButton color="primary" variant="plain" shape="circle">Ѧ</XButton>
			<XButton color="success" variant="plain" shape="circle">Ѧ</XButton>
			<XButton color="danger" variant="plain" shape="circle">Ѧ</XButton>
			<XButton color="light" variant="plain" shape="circle">Ѧ</XButton>
		</div>
	`,
});

export const Disabled = () => ({
	components: { XButton },
	template: `
		<div class="space-x-4 p-5">
			<XButton color="primary" disabled>Disabled</XButton>
			<XButton color="primary" shape="circle" disabled>Ѧ</XButton>
		</div>
	`,
});
