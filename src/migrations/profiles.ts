/* eslint-disable @typescript-eslint/require-await */
import { Base64 } from "@arkecosystem/platform-sdk-crypto";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";

export const migrations = {
	"^2.0.0": async ({ profile }: { profile: Contracts.IProfile }) => {
		const profileData: Record<string, any> = profile.getRawData();

		profile.setRawData({
			id: profile.id(),
			name: profile.name(),
			password: profile.settings().get(Contracts.ProfileSetting.Password),
			data: Base64.encode(JSON.stringify({ id: profile.id(), ...profileData })),
		});

		profile.settings().fill(profileData.settings);
	},
};
