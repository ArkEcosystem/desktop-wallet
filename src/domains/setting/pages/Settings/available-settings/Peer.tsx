import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Table } from "app/components/Table";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks";
import { CustomPeers } from "domains/setting/components/CustomPeers";
import { PeerListItem } from "domains/setting/components/PeerListItem";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Peer = ({ env, formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const [isCustomPeer, setIsCustomPeer] = useState(
		activeProfile.settings().get(ProfileSetting.UseCustomPeer) || false,
	);
	const [isAddPeer, setIsAddPeer] = useState(false);

	const availableNetworks = useMemo(() => env.availableNetworks(), [env]);

	const peers = useMemo(() => activeProfile.peers().values(), [activeProfile]);

	const { context, register } = formConfig;

	const options = [
		{ label: t("COMMON.EDIT"), value: "edit" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	const columns = [
		{
			Header: t("SETTINGS.PEERS.CRYPTOASSET"),
			accessor: "cryptoasset",
		},
		{
			Header: t("SETTINGS.PEERS.NAME"),
			accessor: "name",
		},
		{
			Header: t("SETTINGS.PEERS.PEER_IP"),
		},
		{
			Header: t("SETTINGS.PEERS.TYPE"),
			className: "flex justify-center no-border",
		},
		{
			accessor: "onSelect",
			disableSortBy: true,
		},
	];

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
					defaultChecked={activeProfile.settings().get(ProfileSetting.UseMultiPeerBroadcast)}
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
					name="isCustomPeer"
					checked={isCustomPeer}
					onChange={(event) => setIsCustomPeer(event.target.checked)}
					data-testid="General-peers__toggle--isCustomPeer"
				/>
			),
			wrapperClass: "pt-6",
		},
	];

	const handleSubmit = async ({ isMultiPeerBroadcast, isCustomPeer }: any) => {
		activeProfile.settings().set(ProfileSetting.UseMultiPeerBroadcast, isMultiPeerBroadcast);
		activeProfile.settings().set(ProfileSetting.UseCustomPeer, isCustomPeer);

		await env.persist();

		onSuccess(t("SETTINGS.PEERS.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.PEERS.TITLE")} subtitle={t("SETTINGS.PEERS.SUBTITLE")} />

			<Form id="peer-settings__form" context={context} onSubmit={handleSubmit} className="mt-8">
				<ListDivided items={peerItems} />

				{isCustomPeer && (
					<div className="pt-8">
						<Table columns={columns} data={peers}>
							{(rowData: any) => <PeerListItem {...rowData} options={options} />}
						</Table>

						<Button
							variant="plain"
							className="w-full mt-8 mb-2"
							onClick={() => setIsAddPeer(true)}
							data-testid="peer-list__add-button"
						>
							{t("SETTINGS.PEERS.ADD_PEER")}
						</Button>
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

			<CustomPeers
				isOpen={isAddPeer}
				networks={availableNetworks}
				profile={activeProfile}
				onClose={() => setIsAddPeer(false)}
			/>
		</>
	);
};
