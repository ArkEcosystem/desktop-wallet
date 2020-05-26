<template>
	<div class="relative p-10 rounded-lg ProfileAll bg-theme-feature m-r-4">
		<h3>{{ $t("PAGES.PROFILE_ALL.HEADER") }} ({{ totalBalances.join(", ") }})</h3>

		<div class="mt-10 ProfileAll__grid">
			<RouterLink :to="{ name: 'profile-new' }" class="flex flex-row w-full ProfileAll__grid__profile">
				<div
					:style="`backgroundImage: url('${assets_loadImage(addProfileImagePath)}')`"
					:title="$t('PAGES.PROFILE_ALL.ADD_PROFILE')"
					class="flex ProfileAvatar__image profile-avatar-xl background-image"
				/>
				<div class="flex items-center font-semibold ProfileAll__grid__profile__name">
					{{ $t("PAGES.PROFILE_ALL.ADD_PROFILE") }}
				</div>
			</RouterLink>

			<div
				v-for="profile in profiles"
				:key="profile.id"
				:class="{
					'ProfileAll__grid__profile--selected': profile.id === session_profile.id,
				}"
				class="flex flex-row w-full ProfileAll__grid__profile"
			>
				<ProfileAvatar :profile="profile" letter-size="2xl" @click="selectProfile(profile.id)" />

				<div class="flex flex-col justify-between">
					<div class="pl-1">
						<div class="flex text-lg font-semibold ProfileAll__grid__profile__name">
							{{ profile.name | truncate(12) }}
						</div>

						<span class="ProfileAll__grid__profile__balance">
							{{ profileBalance(profile) }}
						</span>

						<RouterLink
							:to="{ name: 'profile-edition', params: { profileId: profile.id } }"
							class="flex mt-2 mb-1 text-xs font-semibold ProfileAll__grid__profile__edition-link"
						>
							{{ $t("PAGES.PROFILE_ALL.EDIT_PROFILE") }}
						</RouterLink>

						<button
							v-if="profiles.length > 1"
							class="flex text-xs font-semibold cursor-pointer ProfileAll__grid__profile__delete text-theme-page-text-light hover:underline hover:text-red"
							@click="openRemovalConfirmation(profile)"
						>
							{{ $t("PAGES.PROFILE_ALL.REMOVE_PROFILE") }}
						</button>
					</div>

					<a
						v-show="profile.id !== session_profile.id"
						class="flex pl-1 mt-4 text-xs font-semibold cursor-pointer ProfileAll__grid__profile__select hover:underline"
						@click="selectProfile(profile.id)"
					>
						{{ $t("PAGES.PROFILE_ALL.SELECT_PROFILE") }}
					</a>
				</div>
			</div>
		</div>

		<ProfileRemovalConfirmation
			v-if="profileToRemove"
			:profile="profileToRemove"
			@cancel="hideRemovalConfirmation"
			@removed="onRemoval"
		/>
	</div>
</template>

<script>
import { mapValues, sortBy, uniqBy } from "lodash";
import { Component, Vue } from "vue-property-decorator";

import { ProfileAvatar, ProfileRemovalConfirmation } from "@/components/Profile";
import { StoreBinding } from "@/enums";

@Component({
	name: "ProfileAll",

	components: {
		ProfileAvatar,
		ProfileRemovalConfirmation,
	},
})
export default class ProfileAll extends Vue {
	profileToRemove = null;

	get profiles() {
		return sortBy(this.$store.getters["profile/all"], ["name", "networkId"]);
	}

	get addProfileImagePath() {
		return "pages/new-profile-avatar.svg";
	}

	get aggregatedBalances() {
		const walletsByNetwork = this.profiles.reduce((all, profile) => {
			const wallets = this.$store.getters["wallet/byProfileId"](profile.id);
			return {
				...all,
				[profile.networkId]: (all[profile.networkId] || []).concat(wallets),
			};
		}, {});

		// Add the Ledger wallets of the current network only
		if (!walletsByNetwork[this.session_network.id]) {
			walletsByNetwork[this.session_network.id] = [];
		}
		walletsByNetwork[this.session_network.id] = [
			...walletsByNetwork[this.session_network.id],
			...this.$store.getters["ledger/wallets"],
		];

		return mapValues(walletsByNetwork, (wallets) => {
			return uniqBy(wallets, "address").reduce((total, wallet) => {
				return this.currency_toBuilder(wallet.balance).plus(total);
			}, 0);
		});
	}

	get totalBalances() {
		const balances = [];
		for (const networkId in this.aggregatedBalances) {
			const network = this.$store.getters["network/byId"](networkId);
			const amount = this.currency_subToUnit(this.aggregatedBalances[networkId], network);
			const formatted = this.currency_format(amount, {
				currency: network.symbol,
				maximumFractionDigits: network.fractionDigits,
			});
			balances.push({
				formatted,
				amount: Number(amount),
			});
		}
		const sorted = sortBy(balances, ["amount", "formatted"]);
		return sorted.map((sort) => sort.formatted).reverse();
	}

	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.$synchronizer.focus();
			vm.$synchronizer.pause("market");
		});
	}

	hideRemovalConfirmation() {
		this.profileToRemove = null;
	}

	onRemoval() {
		this.hideRemovalConfirmation();
	}

	openRemovalConfirmation(profile) {
		this.profileToRemove = profile;
	}

	profileBalance(profile) {
		const balance = this.$store.getters["profile/balanceWithLedger"](profile.id);
		const network = this.$store.getters["network/byId"](profile.networkId);
		const amount = this.currency_subToUnit(balance, network);
		return this.currency_format(amount, {
			currency: network.symbol,
			maximumFractionDigits: network.fractionDigits,
		});
	}

	selectProfile(profileId) {
		this.$store.dispatch(StoreBinding.SessionSetProfileId, profileId);
	}
}
</script>

<style lang="postcss" scoped>
.ProfileAll__grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, calc(var(--profile-avatar-xl) * 2));
	grid-gap: 1rem;
}
.ProfileAll__grid__profile {
	@apply .p-3 .border-transparent .border-2 .rounded-lg;
}
.ProfileAll__grid__profile:hover .profile-avatar-xl,
.ProfileAll__grid__profile:hover .ProfileAvatar__image,
.ProfileAll__grid__profile:hover .ProfileAvatar__letter {
	transition: 0.5s;
	opacity: 0.5;
}
.ProfileAll__grid__profile--selected {
	@apply .border-green;
}
.ProfileAll__grid__profile__name {
	width: var(--profile-avatar-xl);
}
.ProfileAll__grid__profile__balance {
	max-width: 10rem;
	@apply .font-bold .my-2 .text-lg .truncate .inline-block;
}

.ProfileAll .ProfileAvatar {
	@apply .flex;
}
.ProfileAll .ProfileAvatar,
.ProfileAll .ProfileAvatar__image {
	height: calc(var(--profile-avatar-xl) * 0.66);
	width: calc(var(--profile-avatar-xl) * 0.66);
}
.ProfileAll .ProfileAvatar__image {
	@apply .flex .self-center .cursor-pointer;
}
.ProfileAll .ProfileAvatar__letter {
	@apply .mx-auto .self-center .cursor-pointer;
}
</style>
