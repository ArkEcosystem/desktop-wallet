import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks";
import { PeerTable } from "domains/setting/components/PeerTable";
import { peers } from "domains/setting/data";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Peer = ({ env, formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();

	const activeProfile = useActiveProfile();

	const { context, register } = formConfig;

	const [isCustomPeers, setIsCustomPeers] = useState(false);

	const availableNetworks = useMemo(() => env.availableNetworks(), [env]);

	const peerItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isMultiPeerBroadcast"
					defaultChecked={activeProfile.settings().get(ProfileSetting.MultiPeerBroadcast)}
					data-testid="General-peers__toggle--isMultiPeerBroadcast"
				/>
			),
			wrapperClass: "pb-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.CUSTOM_PEERS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: t("SETTINGS.PEERS.CUSTOM_PEERS.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isCustomPeers"
					checked={isCustomPeers}
					onChange={(event) => setIsCustomPeers(event.target.checked)}
					data-testid="General-peers__toggle--isCustomPeers"
				/>
			),
			wrapperClass: "pt-6",
		},
	];

	const handleSubmit = async ({ isMultiPeerBroadcast, isCustomPeers }: any) => {
		activeProfile.settings().set(ProfileSetting.MultiPeerBroadcast, isMultiPeerBroadcast);

		await env.persist();

		onSuccess(t("SETTINGS.PEERS.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.PEERS.TITLE")} subtitle={t("SETTINGS.PEERS.SUBTITLE")} />

			<Form id="peer-settings__form" context={context} onSubmit={handleSubmit} className="mt-8">
				<ListDivided items={peerItems} />

				{isCustomPeers && (
					<div className="pt-8">
						<PeerTable networks={availableNetworks} peers={peers} />
					</div>
				)}

				<div className="pt-2 pb-4">
					<Divider dashed />
				</div>

				<div className="flex justify-end w-full">
					<Button data-testid="Peer-settings__submit-button" type="submit">
						{t("COMMON.SAVE")}
					</Button>
				</div>
			</Form>
		</>
	);
};
