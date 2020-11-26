import { Coins } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type PeerFormProps = {
	networks: Coins.Network[];
	onSave: any;
};

export const PeerForm = ({ networks, onSave }: PeerFormProps) => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register, setValue, watch } = form;
	const { isValid } = formState;
	const { network, name, host, isMultiSignature } = watch();

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	const handleSelectNetwork = (network?: Coins.Network | null) => {
		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<Form data-testid="PeerForm" context={form} onSubmit={() => onSave({ network, name, host, isMultiSignature })}>
			<FormField name="network" className="my-8">
				<FormLabel label={t("SETTINGS.PEERS.CRYPTOASSET")} />
				<SelectNetwork
					id="CustomPeers__network"
					networks={networks}
					selected={network}
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
					data-testid="PeerForm__name-input"
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
					data-testid="PeerForm__host-input"
				/>
				<FormHelperText />
			</FormField>

			<FormField name="type">
				<FormLabel label={t("SETTINGS.PEERS.TYPE")} required={false} optional />
				<label htmlFor="isMultiSignature" className="flex items-center space-x-2">
					<Checkbox name="isMultiSignature" ref={register()} data-testid="PeerForm__multisignature-toggle" />
					<span className="text-sm font-semibold text-theme-secondary-text">
						{t("COMMON.MULTISIGNATURE")}
					</span>
				</label>
			</FormField>

			<div className="flex justify-end mt-4">
				<Button type="submit" disabled={!isValid} data-testid="PeerForm__add-button">
					{t("SETTINGS.PEERS.ADD_PEER")}
				</Button>
			</div>
		</Form>
	);
};

PeerForm.defaultProps = {
	networks: [],
};
