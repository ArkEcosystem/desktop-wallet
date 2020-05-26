<template>
	<ModalWindow
		:title="$t('MODAL_PLUGIN_MANAGE_BLACKLIST.TITLE')"
		container-classes="w-md max-w-md"
		@close="emitClose"
	>
		<section class="flex flex-col ModalConfirmation__container">
			<div class="mb-6">
				<p v-if="!blacklist.length" class="mb-2">
					{{ $t("MODAL_PLUGIN_MANAGE_BLACKLIST.EMPTY") }}
				</p>

				<ListDivided class="overflow-y-auto max-h-2xs">
					<ListDividedItem v-for="plugin of blacklist" :key="plugin" :label="plugin">
						<button
							class="flex p-1 text-xs font-semibold hover:text-red text-theme-page-text-light"
							@click="removeFromBlacklist(plugin)"
						>
							<SvgIcon name="delete-wallet" view-box="0 0 16 16" />
						</button>
					</ListDividedItem>
				</ListDivided>
			</div>

			<div class="flex flex-row mt-2">
				<button class="blue-button" @click="removeAll">
					{{ $t("MODAL_PLUGIN_MANAGE_BLACKLIST.REMOVE_ALL") }}
				</button>

				<button class="blue-button" @click="emitClose">
					{{ $t("MODAL_PLUGIN_MANAGE_BLACKLIST.CLOSE") }}
				</button>
			</div>
		</section>
	</ModalWindow>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { ListDivided, ListDividedItem } from "@/components/ListDivided";
import { ModalWindow } from "@/components/Modal";
import { SvgIcon } from "@/components/SvgIcon";
import { StoreBinding } from "@/enums";

@Component({
    name: "PluginManageBlacklistModal",

    components: {
		ListDivided,
		ListDividedItem,
		ModalWindow,
		SvgIcon,
	}
})
export default class PluginManageBlacklistModal extends Vue {
    @Prop({
        type: Array,
        required: true,
    })
    blacklist;

    emitClose() {
        this.$emit("close");
    }

    removeAll() {
        this.$store.dispatch(StoreBinding.PluginSetBlacklisted, {
            scope: "local",
            plugins: [],
        });
    }

    removeFromBlacklist(plugin) {
        this.$store.dispatch(StoreBinding.PluginSetBlacklisted, {
            scope: "local",
            plugins: this.$store.getters["plugin/blacklisted"].local.filter(
                (blacklisted) => blacklisted !== plugin,
            ),
        });
    }
}
</script>
