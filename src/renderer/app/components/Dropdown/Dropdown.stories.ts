import { select, withKnobs } from "@storybook/addon-knobs";

import Dropdown from "./Dropdown.vue";

export default { title: "Basic / Dropdown", decorators: [withKnobs] };

export const Default = () => ({
	components: { Dropdown },
	template: `
		<div class="p-5">
		        <div>Default example with props</div>
		        <div class="text-xs mt-5"><code>:options="['Contacts', 'Settings', 'Support', 'Exit']</code></div>
			<Dropdown class="mr-4 inline-block w-64 align-middle rounded-xl py-7 px-8" :options="['Contacts', 'Settings', 'Support', 'Exit']">
			</Dropdown>
		</div>
	`,
});
export const CustomToggle = () => ({
	components: { Dropdown },
	template: `
		<div class="p-5">
		        <div>Custom toggle html content (slot name="toggle")</div>
			<Dropdown class="mr-4 inline-block w-64 align-middle rounded-xl py-7 px-8" :options="['Contacts', 'Settings', 'Support', 'Exit']">
		        <div class="text-xs" slot="toggle">click here</div>
			</Dropdown>
		</div>
	`,
});
export const CustomDropdownContent = () => ({
	components: { Dropdown },
	template: `
		<div class="p-5">
		        <div>Custom dropdown content (default slot)</div>
			<Dropdown class="mr-4 inline-block w-64 align-middle rounded-xl py-7 px-8" :options="['Contacts', 'Settings', 'Support', 'Exit']">
		        <div class="text-xs p-10">Dropdown content</div>
			</Dropdown>
		</div>
	`,
});
