<template>
	<div class="flex">
		<SelectionNetworkButton
			v-for="network in availableNetworks"
			:key="network.id"
			:network="network"
			:is-custom="isCustom"
			:show-title="true"
			:class="[selected.id === network.id && !isOtherSelected ? 'SelectionNetworkButton--selected' : null]"
			class="SelectionNetworkButton"
			@click="select(network)"
		/>

		<SelectionNetworkButton
			v-if="addButton"
			:show-title="false"
			tag="div"
			class="flex-none"
			network-image="networks/add.svg"
			@click="toggleAddNetwork"
		/>

		<SelectionNetworkButton
			v-if="othersNetworks.length"
			:class="isOtherSelected ? 'SelectionNetworkButton--selected' : null"
			class="SelectionNetworkButton"
			@click="openModal"
		>
			<div class="flex flex-col justify-between p-1">
				<span
					class="flex items-center justify-center w-16 h-16 mx-auto text-3xl tracking-wide text-theme-page-text-light"
				>
					...
				</span>
				<span class="block w-full font-semibold truncate text-theme-page-text text-theme-page-text-light">
					{{ $t("COMMON.OTHER") }}
				</span>
			</div>
		</SelectionNetworkButton>

		<NetworkModal
			v-if="showAddNetwork"
			:title="$t('PAGES.NETWORK_OVERVIEW.NEW_NETWORK')"
			@cancel="toggleAddNetwork"
			@saved="toggleAddNetwork"
			@removed="toggleAddNetwork"
		/>

		<NetworkSelectionModal v-if="isModalOpen" :toggle="closeModal" @cancel="closeModal" @selected="select" />
	</div>
</template>

<script>
import { pullAllBy } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

import { NetworkModal, NetworkSelectionModal } from "@/components/Network";

import SelectionNetworkButton from "./SelectionNetworkButton";

@Component({
	name: "SelectionNetwork",

	components: {
		NetworkModal,
		NetworkSelectionModal,
		SelectionNetworkButton,
	},

	// @TODO
	// model: {
	// 	prop: "selected",
	// 	event: "select",
	// },
})
export default class SelectionNetwork extends Vue {
	maxItems = 2;
	buttonClasses = "";

	@Prop({
		type: Array,
		required: true,
	})
	networks;

	@Prop({
		type: [Object],
		required: false,
		default: null,
	})
	selected;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isCustom;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	addButton;

	isModalOpen = false;
	showAddNetwork = false;

	get availableNetworks() {
		return this.networks.slice(0, this.$options.maxItems);
	}

	get othersNetworks() {
		return pullAllBy(this.networks, this.availableNetworks);
	}

	get isOtherSelected() {
		return this.othersNetworks.map((n) => n.id).includes(this.selected.id);
	}

	select(network) {
		this.$emit(this.$options.model.event, network);
		this.closeModal();
	}

	openModal() {
		this.isModalOpen = true;
	}

	closeModal() {
		this.isModalOpen = false;
	}

	toggleAddNetwork() {
		this.showAddNetwork = !this.showAddNetwork;
	}
}
</script>

<style lang="postcss" scoped>
.SelectionNetworkButton--selected {
	@apply border-green;
}
.SelectionNetworkButton:not(.SelectionNetworkButton--selected):hover {
	@apply border-grey;
}
.SelectionNetworkButton:focus {
	@apply border-green;
}
</style>
