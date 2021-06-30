import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { PluginHooks } from "plugins/core/internals/plugin-hooks";
import { PluginService, PluginServiceIdentifier } from "plugins/types";

export class ProfilePluginService implements PluginService {
	#profile: Contracts.IProfile | undefined;

	config() {
		return {
			accessor: "profile",
			id: PluginServiceIdentifier.Profile,
		};
	}

	boot(context: { hooks: PluginHooks }) {
		context.hooks.on("profile", (profile) => (this.#profile = profile));
	}

	api() {
		// TODO: return ReadOnlyWallet[]
		return {
			wallets: () =>
				this.#profile
					?.wallets()
					.values()
					.map((wallet) => wallet.toObject()),
		};
	}
}
