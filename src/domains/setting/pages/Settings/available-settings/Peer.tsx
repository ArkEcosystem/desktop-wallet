import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Table } from "app/components/Table";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { CreatePeer } from "domains/setting/components/CreatePeer";
import { DeletePeer } from "domains/setting/components/DeletePeer";
import { PeerListItem } from "domains/setting/components/PeerListItem";
import { UpdatePeer } from "domains/setting/components/UpdatePeer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Peer = ({ env, formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();
	const { state } = useEnvironmentContext();
	const activeProfile = useActiveProfile();

	const [isMultiPeerBroadcast, setIsMultiPeerBroadcast] = useState(
		activeProfile.settings().get(ProfileSetting.UseMultiPeerBroadcast) || false,
	);
	const [isCustomPeer, setIsCustomPeer] = useState(
		activeProfile.settings().get(ProfileSetting.UseCustomPeer) || false,
	);

	const loadPeers = useCallback(() => {
		const allPeers: any = activeProfile.peers().all();

		return Object.keys(allPeers).reduce((peers: any, coinKey: string) => {
			for (const coin of Object.keys(allPeers[coinKey])) {
				for (const network of Object.keys(allPeers[coinKey][coin])) {
					for (const peer of allPeers[coinKey][coin][network]) {
						peers.push({
							...peer,
							coin: coinKey,
							network: `${coin}.${network}`,
						});
					}
				}
			}

			return peers;
		}, []);
	}, [activeProfile]);

	const [peers, setPeers] = useState(loadPeers());
	const [isCreatePeer, setIsCreatePeer] = useState(false);

	const [peerAction, setPeerAction] = useState<string | null>(null);
	const [selectedPeer, setSelectedPeer] = useState<any | null>(null);

	useEffect(() => {
		if (!peerAction) {
			setSelectedPeer(null);
		}
	}, [peerAction]);

	useEffect(() => {
		setPeers(loadPeers());
	}, [loadPeers, state]);

	useEffect(() => {
		if (isMultiPeerBroadcast && (!isCustomPeer || peers.length < 2)) {
			setIsMultiPeerBroadcast(false);

			const savePeerSettings = async () => {
				activeProfile.settings().set(ProfileSetting.UseMultiPeerBroadcast, isMultiPeerBroadcast);
				activeProfile.settings().set(ProfileSetting.UseCustomPeer, isCustomPeer);

				await env.persist();
			};

			savePeerSettings();
		}
	}, [activeProfile, env, isCustomPeer, isMultiPeerBroadcast, peers]);

	const availableNetworks = useMemo(() => env.availableNetworks(), [env]);

	const { context, register } = formConfig;

	const peerOptions = [
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
					checked={isMultiPeerBroadcast}
					onChange={(event) => {
						if (isCustomPeer && peers.length > 1) {
							setIsMultiPeerBroadcast(event.target.checked);
						}
					}}
					data-testid="General-peers__toggle--isMultiPeerBroadcast"
				/>
			),
			wrapperClass: "pb-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.CUSTOM_PEERS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-secondary-text",
			labelDescription: (
				<Trans i18nKey="SETTINGS.PEERS.CUSTOM_PEERS.DESCRIPTION">
					Customize your individual peers by network. <br /> Note: Only use trusted peers. Using an unknown
					peer may put your funds at risk.
				</Trans>
			),
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

	const handlePeerAction = (action: string, peer: any) => {
		setPeerAction(action);
		setSelectedPeer(peer);
	};

	const resetPeerAction = () => {
		setPeerAction(null);
	};

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
					<div className="pt-8" data-testid="Peer-settings__table">
						<Table columns={columns} data={peers}>
							{(rowData: any) => (
								<PeerListItem {...rowData} options={peerOptions} onAction={handlePeerAction} />
							)}
						</Table>

						<Button
							variant="plain"
							className="w-full mt-8 mb-2"
							onClick={() => setIsCreatePeer(true)}
							data-testid="Peer-list__add-button"
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

			<CreatePeer
				isOpen={isCreatePeer}
				networks={availableNetworks}
				profile={activeProfile}
				onClose={() => setIsCreatePeer(false)}
			/>

			{selectedPeer && (
				<>
					<UpdatePeer
						isOpen={peerAction === "edit"}
						networks={availableNetworks}
						peer={selectedPeer}
						profile={activeProfile}
						onClose={resetPeerAction}
					/>

					<DeletePeer
						isOpen={peerAction === "delete"}
						peer={selectedPeer}
						profile={activeProfile}
						onCancel={resetPeerAction}
						onClose={resetPeerAction}
						onDelete={resetPeerAction}
					/>
				</>
			)}
		</>
	);
};
