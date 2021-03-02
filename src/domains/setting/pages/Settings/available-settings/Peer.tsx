import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { groupBy } from "@arkecosystem/utils";
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
import * as yup from "yup";

import { SettingsProps } from "../Settings.models";

export const Peer = ({ formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();

	const activeProfile = useActiveProfile();
	const { env, state, persist } = useEnvironmentContext();

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

	const peerGroupByNetwork: any = useMemo(() => groupBy(peers, (peer) => peer.network), [peers]);

	const syncWallets = useCallback(async () => {
		const promises: Promise<void>[] = [];

		for (const wallet of activeProfile.wallets().values()) {
			promises.push(wallet.sync());
		}

		await Promise.allSettled(promises);
	}, [activeProfile]);

	useEffect(() => {
		if (
			isMultiPeerBroadcast &&
			(!isCustomPeer ||
				Object.keys(peerGroupByNetwork).every((network) => peerGroupByNetwork[network].length < 2))
		) {
			setIsMultiPeerBroadcast(false);

			const savePeerSettings = async () => {
				activeProfile.settings().set(ProfileSetting.UseMultiPeerBroadcast, isMultiPeerBroadcast);
				activeProfile.settings().set(ProfileSetting.UseCustomPeer, isCustomPeer);

				await syncWallets();
				await persist(activeProfile);
			};

			savePeerSettings();
		}
	}, [activeProfile, isCustomPeer, isMultiPeerBroadcast, peerGroupByNetwork, peers, persist, syncWallets]);

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
			labelDescription: t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.DESCRIPTION"),
			labelAddon: (
				<Toggle
					ref={register()}
					name="isMultiPeerBroadcast"
					checked={isMultiPeerBroadcast}
					onChange={(event) => setIsMultiPeerBroadcast(event.target.checked)}
					data-testid="General-peers__toggle--isMultiPeerBroadcast"
					disabled={
						!(
							isCustomPeer &&
							Object.keys(peerGroupByNetwork).some((network) => peerGroupByNetwork[network].length > 1)
						)
					}
				/>
			),
			wrapperClass: "pb-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.CUSTOM_PEERS.TITLE"),
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

	const validateHost = (network: string, host: string) => {
		const hostHasProtocol = (value: string) => /^https?:\/\//.test(value);

		if (!yup.string().url().isValidSync(host)) {
			return t("SETTINGS.PEERS.VALIDATION.NOT_VALID", { field: t("SETTINGS.PEERS.PEER_IP") });
		}

		if (!hostHasProtocol(host)) {
			return t("SETTINGS.PEERS.VALIDATION.NO_PROTOCOL", { field: t("SETTINGS.PEERS.PEER_IP") });
		}

		return (
			!peerGroupByNetwork?.[network]?.some((peer: any) => peer.host === host) ||
			t("SETTINGS.PEERS.VALIDATION.HOST_EXISTS")
		);
	};

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

		await syncWallets();
		await persist(activeProfile);

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
							variant="secondary"
							className="mt-8 mb-2 w-full"
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
				onValidateHost={validateHost}
			/>

			{selectedPeer && (
				<>
					<UpdatePeer
						isOpen={peerAction === "edit"}
						networks={availableNetworks}
						peer={selectedPeer}
						profile={activeProfile}
						onClose={resetPeerAction}
						onValidateHost={validateHost}
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
