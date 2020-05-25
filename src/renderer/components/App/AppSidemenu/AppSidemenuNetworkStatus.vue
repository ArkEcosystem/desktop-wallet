<template>
	<div v-click-outside.capture="emitClose">
		<MenuNavigationItem
			id="networks"
			:title="$t('APP_SIDEMENU.NETWORK')"
			:is-horizontal="isHorizontal"
			:can-activate="false"
			class="AppSidemenu__item"
			icon="cloud"
			@click="toggleShowNetworkStatus"
		/>

		<div
			v-if="isNetworkStatusVisible"
			:class="isHorizontal ? 'AppSidemenuNetworkStatus--horizontal' : 'AppSidemenuNetworkStatus'"
			class="absolute z-20 theme-dark"
			@close="closeShowNetworkStatus"
		>
			<MenuOptions :is-horizontal="isHorizontal" class="AppSidemenuNetworkStatus__peer">
				<div class="mx-6 mb-2 text-xs text-theme-settings-heading">
					<span class="float-left">
						{{ $t("PEER.PEER") }}
					</span>
					<span v-if="!peer.isCustom" class="float-right">
						{{ $t("PEER.BEST") }}
					</span>
					<span v-else class="float-right">
						{{ $t("PEER.DISCONNECT") }}
					</span>
				</div>
				<div
					class="relative inline-block px-3 py-2 mx-6 text-white rounded cursor-pointer select-none bg-theme-settings-sub"
				>
					<button class="w-full pr-12 text-left" @click.stop="toggleSelect('peers-menu')">
						<div slot="controls" class="w-full pointer-events-none">
							<MenuDropdown
								ref="peers-menu"
								:items="peerIps"
								:value="currentPeerId"
								:placeholder="
									peer ? `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}` : $t('PEER.NONE')
								"
								:pin-above="true"
								class="inline-block w-full text-white fill-white"
								@select="setPeer"
							/>
						</div>
					</button>
					<ButtonReload
						v-if="!peer.isCustom"
						:is-refreshing="isRefreshing"
						text-class="hover:text-white"
						color-class="AppSidemenuNetworkStatus__ButtonReload-colorClass"
						class="absolute AppSidemenuNetworkStatus__refresh__button hover:text-white bg-theme-settings-button text-grey-dark"
						@click="refreshPeer"
					/>
					<button
						v-else-if="!isRefreshing"
						class="absolute inline-flex items-center justify-center w-12 rounded cursor-pointer AppSidemenuNetworkStatus__refresh__button AppSidemenuNetworkStatus__refresh__button--disconnect bg-theme-settings-button text-theme-button-light-text hover:bg-theme-option-button-hover hover:text-grey-light"
						@click="refreshPeer"
					>
						<SvgIcon name="disconnect" view-box="0 0 16 15" />
					</button>
					<ButtonReload
						v-else
						:is-refreshing="true"
						class="absolute AppSidemenuNetworkStatus__refresh__button bg-theme-settings-button"
					/>
				</div>
				<div class="flex flex-wrap mx-auto mt-6 select-none AppSidemenuNetworkStatus__status">
					<div class="inline-block pr-6 border-r AppSidemenuNetworkStatus__status__height">
						<div class="mb-2 text-xs">
							{{ $t("PEER.HEIGHT") }}
						</div>
						<div class="text-white text-md">
							{{ peer ? peer.height : "-" }}
						</div>
					</div>
					<div class="inline-block pr-6 ml-6 border-r AppSidemenuNetworkStatus__status__last-checked">
						<div class="mb-2 text-xs">
							{{ $t("PEER.LAST_CHECKED") }}
						</div>
						<div class="text-white text-md">
							{{ formatter_date(peer.lastUpdated || lastUpdated, "LT") }}
						</div>
					</div>
					<div class="inline-block ml-6 AppSidemenuNetworkStatus__status__latency">
						<div class="mb-2 text-xs">
							{{ $t("PEER.LATENCY") }}
						</div>
						<div v-if="peer.latency" :class="peer && peer.latency < 500 ? 'text-green' : 'text-red'">
							<span class="text-md"> {{ peer.latency }} ms </span>
							<div
								:class="peer && peer.latency < 500 ? 'bg-green' : 'bg-red'"
								class="inline-block w-2 h-2 ml-1 rounded-full"
							/>
						</div>
						<div v-else>
							<span class="text-white">
								-
							</span>
						</div>
					</div>
				</div>
			</MenuOptions>
			<div class="px-10 pt-1 mt-2 rounded bg-theme-settings">
				<ButtonModal
					:label="$t('PEER.CONNECT_CUSTOM')"
					icon="connect"
					view-box="0 0 30 15"
					class="w-full py-4 text-left border-b cursor-pointer AppSidemenuNetworkStatus__ButtonModal text-grey-dark hover:text-white border-theme-settings-sub"
					@toggle="toggleCustomPeerModal"
				>
					<template slot-scope="{ toggle, isOpen }">
						<ModalPeer
							v-if="isOpen"
							:title="$t('PEER.CUSTOM_TITLE')"
							:allow-close="!showLoadingModal"
							:current-peer="peer"
							:close-trigger="toggle"
							@connect="connectPeer"
							@close="toggle"
						/>
					</template>
				</ButtonModal>
				<RouterLink
					:to="{ name: 'networks' }"
					:class="isHorizontal ? 'flex-row w-22' : 'rounded-t-lg'"
					class="flex items-center w-full py-4 text-left cursor-pointer text-grey-dark hover:no-underline hover:text-white"
					@click.native="goToNetworkOverview()"
				>
					<SvgIcon name="network-management" view-box="0 0 21 21" class="mr-4" />
					<span class="font-semibold">
						{{ $t("APP_SIDEMENU.NETWORKS") }}
					</span>
				</RouterLink>
			</div>
		</div>

		<ModalLoader :message="$t('MODAL_PEER.VALIDATING')" :allow-close="true" :visible="showLoadingModal" />
	</div>
</template>

<script>
import { ButtonModal, ButtonReload } from "@/components/Button";
import { MenuDropdown, MenuNavigationItem, MenuOptions } from "@/components/Menu";
import { ModalLoader, ModalPeer } from "@/components/Modal";
import SvgIcon from "@/components/SvgIcon";
import { StoreBinding } from "@/enums";

export default {
	name: "AppSidemenuNetworkStatus",

	components: {
		ButtonModal,
		ButtonReload,
		MenuDropdown,
		MenuNavigationItem,
		MenuOptions,
		ModalLoader,
		ModalPeer,
		SvgIcon,
	},

	props: {
		outsideClick: {
			type: Boolean,
			required: false,
			default: false,
		},
		isHorizontal: {
			type: Boolean,
			required: false,
			default: false,
		},
	},

	data() {
		return {
			isNetworkStatusVisible: false,
			isRefreshing: false,
			showCustomPeerModal: false,
			showLoadingModal: false,
		};
	},

	computed: {
		peer() {
			return this.$store.getters["peer/current"]();
		},
		bestPeers() {
			return this.$store.getters["peer/bestPeers"](undefined, false);
		},
		peerIps() {
			const bestPeers = this.bestPeers;
			if (!bestPeers) {
				return {};
			}

			return bestPeers.reduce((map, peer, index) => {
				map[index] = `${peer.isHttps ? "https" : "http"}://${peer.ip}`;

				return map;
			}, {});
		},
		currentPeerId() {
			if (this.peer.isCustom) {
				return null;
			}

			const bestPeers = this.bestPeers;
			for (const peerId in bestPeers) {
				const peer = bestPeers[peerId];
				if (peer.ip === this.peer.ip) {
					return peerId;
				}
			}

			return null;
		},
		lastUpdated() {
			return this.$store.getters["peer/lastUpdated"]();
		},
	},

	methods: {
		toggleShowNetworkStatus() {
			this.isNetworkStatusVisible = !this.isNetworkStatusVisible;
		},

		closeShowNetworkStatus() {
			this.isNetworkStatusVisible = false;
		},

		async connectPeer({ peer, closeTrigger }) {
			this.showLoadingModal = true;

			const response = await this.$store.dispatch(StoreBinding.PeerValidatePeer, {
				host: peer.host,
				port: peer.port,
			});

			if (response === false) {
				this.$error(this.$t("PEER.CONNECT_FAILED"));
				this.showLoadingModal = false;
			} else if (typeof response === "string") {
				this.$error(`${this.$t("PEER.CONNECT_FAILED")}: ${response}`);
				this.showLoadingModal = false;
			} else {
				response.isCustom = true;
				await this.$store.dispatch(StoreBinding.PeerSetCurrentPeer, response);
				await this.$store.dispatch(StoreBinding.PeerUpdateCurrentPeerStatus);
				this.$success(`${this.$t("PEER.CONNECTED")}: ${peer.host}:${peer.port}`);
				if (closeTrigger) {
					closeTrigger();
				}
			}

			this.showLoadingModal = false;
		},

		async refreshPeer() {
			this.isRefreshing = true;
			await this.$store.dispatch(StoreBinding.PeerConnectToBest, {
				skipIfCustom: false,
			});
			this.isRefreshing = false;
		},

		async setPeer(peerId) {
			const peer = this.bestPeers[peerId];
			if (!peer) {
				this.$error("Could not find peer");
			} else {
				await this.$store.dispatch(StoreBinding.PeerSetCurrentPeer, peer);
			}
		},

		toggleSelect(name) {
			this.$refs[name].toggle();
		},

		toggleCustomPeerModal() {
			this.showCustomPeerModal = !this.showCustomPeerModal;
		},

		emitClose() {
			if (this.outsideClick && !this.showCustomPeerModal) {
				this.closeShowNetworkStatus();
			}
		},

		goToNetworkOverview() {
			this.closeShowNetworkStatus();
			this.$router.push({ name: "networks" });
		},
	},
};
</script>

<style lang="postcss" scoped>
.AppSidemenuNetworkStatus {
	width: 380px;
	left: 6.5rem;
	bottom: -1rem;
}

.AppSidemenuNetworkStatus--horizontal {
	width: 380px;
	right: 4.5rem;
	top: 5.75rem;
}

.AppSidemenuNetworkStatus__status__height,
.AppSidemenuNetworkStatus__status__last-checked,
.AppSidemenuNetworkStatus__status__latency {
	@apply .text-theme-settings-heading .border-theme-settings-border;
}

.AppSidemenuNetworkStatus__refresh__button {
	bottom: 0.25rem;
	right: 0.25rem;
	top: 0.25rem;
	padding-left: 0.75rem;
	padding-right: 0.75rem;
	padding-top: 7px;
}
.AppSidemenuNetworkStatus__refresh__button--disconnect {
	padding-top: 0px !important;
}

.AppSidemenuNetworkStatus .MenuOptions--vertical:after {
	top: 7.1rem;
}

.AppSidemenuNetworkStatus__peer .MenuDropdownHandler.text-theme-page-text-light {
	@apply .text-white;
}

.AppSidemenuNetworkStatus__peer .MenuDropdownHandler span svg {
	transform: rotate(-180deg);
}

.AppSidemenuNetworkStatus__ButtonModal {
	@apply .block;
}
.AppSidemenuNetworkStatus__ButtonModal svg {
	@apply .align-baseline;
}

.AppSidemenuNetworkStatus__ButtonReload-colorClass:hover {
	@apply .bg-blue;
	box-shadow: 0 5px 15px rgba(9, 100, 228, 0.34);
	transition: all 0.1s ease-in;
}
</style>
