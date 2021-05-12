import { Coins } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import * as yup from "yup";

const nameMaxLength = 20;

export const peer = (t: any) => ({
	name: () => ({
		validate: {
			required: (name: string) =>
				!!name?.trim() ||
				t("COMMON.VALIDATION.FIELD_REQUIRED", {
					field: t("SETTINGS.PEERS.NAME"),
				}).toString(),
		},
		maxLength: {
			message: t("COMMON.VALIDATION.MAX_LENGTH", {
				field: t("SETTINGS.PEERS.NAME"),
				maxLength: nameMaxLength,
			}),
			value: nameMaxLength,
		},
	}),
	host: (limit: number, profile: Contracts.IProfile, network?: Coins.Network) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("SETTINGS.PEERS.PEER_IP"),
		}).toString(),
		validate: {
			hasProtocol: (host: string) =>
				/^https?:\/\//.test(host) ||
				t("SETTINGS.PEERS.VALIDATION.NO_PROTOCOL", { field: t("SETTINGS.PEERS.PEER_IP") }),
			isValid: (host: string) =>
				yup.string().url().isValidSync(host) ||
				t("SETTINGS.PEERS.VALIDATION.NOT_VALID", { field: t("SETTINGS.PEERS.PEER_IP") }),
			isUnique: (host: string) => {
				try {
					const peers = profile.peers().get(network!.coin(), network!.id());
					if (peers.filter((peer: Contracts.IPeer) => peer.host === host).length > limit) {
						return t("SETTINGS.PEERS.VALIDATION.HOST_EXISTS");
					}
				} catch {
					//
				}

				return true;
			},
		},
	}),
});
