import { Contracts } from "@arkecosystem/platform-sdk-profiles";

export const markAsRead = async (isVisible: boolean, id: string, profile: Contracts.IProfile, env: any) => {
	if (!isVisible) {
		return;
	}

	const notification = profile.notifications().get(id);
	if (!notification || notification?.read_at) {
		return;
	}

	profile.notifications().markAsRead(id);
	env.profiles().persist(profile);

	await env.persist();
};
