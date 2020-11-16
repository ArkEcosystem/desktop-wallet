import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CustomPeersProps = {
	isOpen: boolean;
	networks?: Coins.Network[];
	profile: Profile;
	onAddPeer?: any;
	onClose?: () => void;
};

export const CustomPeers = ({ isOpen, networks, profile, onAddPeer, onClose }: CustomPeersProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const form = useForm({ mode: "onChange" });
	const { formState, getValues, register, setValue } = form;
	const { isValid } = formState;

	const selectedNetwork: Coins.Network = getValues("network");

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelectNetwork = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	const handleSubmit = async ({
		network,
		name,
		host,
		isMultiSignature,
	}: {
		network: Coins.Network;
		name: string;
		host: string;
		isMultiSignature: boolean;
	}) => {
		const [, networkId] = network.id().split(".");
		const coin = network.coin();

		profile.peers().create(coin, networkId, {
			name,
			host,
			isMultiSignature,
		});

		await persist();
	};

	return (
		<Modal title={t("SETTINGS.MODAL_CUSTOM_PEER.TITLE")} size="xl" isOpen={isOpen} onClose={onClose}>
			<Form context={form} onSubmit={handleSubmit as any}>
				<FormField name="network" className="my-8">
					<FormLabel label={t("SETTINGS.PEERS.CRYPTOASSET")} />
					<SelectNetwork
						id="CustomPeers__network"
						networks={networks}
						selected={selectedNetwork}
						onSelect={handleSelectNetwork}
					/>
				</FormField>

				<FormField name="name">
					<FormLabel label={t("SETTINGS.PEERS.NAME")} />
					<Input
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("SETTINGS.PEERS.NAME"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="host">
					<FormLabel label={t("SETTINGS.PEERS.PEER_IP")} />
					<Input
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("SETTINGS.PEERS.PEER_IP"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="type">
					<FormLabel label={t("SETTINGS.PEERS.TYPE")} required={false} optional />
					<label htmlFor="isMultiSignature" className="flex items-center space-x-2">
						<Checkbox name="isMultiSignature" ref={register()} />
						<span className="text-sm font-semibold text-theme-secondary-text">
							{t("COMMON.MULTISIGNATURE")}
						</span>
					</label>
				</FormField>

				<div className="flex justify-end mt-4">
					<Button type="submit" disabled={!isValid} data-testid="peer-list__add-button">
						{t("SETTINGS.PEERS.ADD_PEER")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

CustomPeers.defaultProps = {
	isOpen: false,
	networks: [],
};
