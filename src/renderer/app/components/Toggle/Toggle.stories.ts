import Toggle from "./Toggle.vue";

export default { title: "Form / Toggle" };

export const Default = () => ({
	components: { Toggle },
	template: `<div class="p-5"><Toggle /></div>`,
});

export const Disabled = () => ({
	components: { Toggle },
	template: `<div class="p-5">
		<Toggle disabled />
		<Toggle checked disabled />
	</div>`,
});
