import { select, text, withKnobs } from "@storybook/addon-knobs";

import Alert from "./Alert.vue";

export default { title: "Basic / Alert", decorators: [withKnobs] };

export const Default = () => ({
	components: { Alert },
	props: {
		status: {
			default: select("Status", ["error", "warning", "success", "info"], "warning"),
		},
		size: {
			default: select("Size", ["small", "default", "large"], "default"),
		},
		title: {
			default: text("Title", "Disclaimer"),
		},
	},
	template: `
		<div class='p-5'>
			<Alert :status="status" :title="title" :size="size">
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda molestias voluptatibus minus eveniet cumque?
			</Alert>
		</div>
	`,
});
