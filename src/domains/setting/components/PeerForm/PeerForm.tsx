import { Coins } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputDefault } from "app/components/Input";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type PeerFormProps = {
	networks: Coins.Network[];
	peer?: any;
	onSave: any;
	onValidateHost?: any;
};

export const PeerForm = ({ networks, peer, onSave, onValidateHost }: PeerFormProps) => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register, setValue, watch } = form;
	const { isValid } = formState;
	const { network, name, host, isMultiSignature } = watch();

	const nameMaxLength = 20;

	useEffect(() => {
		register("network", { required: true });
	}, [register]);

	useEffect(() => {
		if (peer) {
			const network = networks.find((network) => network.coin() === peer.coin && network.id() === peer.network);
			setValue("network", network, { shouldValidate: true, shouldDirty: true });
		}
	}, [networks, peer, setValue]);

	const handleSelectNetwork = (network?: Coins.Network | null) => {
		if (form.errors.host?.message.includes("already exists")) {
			form.clearErrors("host");

			/* istanbul ignore else */
			if (host) {
				setValue("host", host, { shouldValidate: true, shouldDirty: true });
			}
		}

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
				<InputDefault
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("SETTINGS.PEERS.NAME"),
						}).toString(),
						maxLength: {
							message: t("COMMON.VALIDATION.MAX_LENGTH", {
								field: t("SETTINGS.PEERS.NAME"),
								maxLength: nameMaxLength,
							}),
							value: nameMaxLength,
						},
					})}
					defaultValue={peer?.name}
					data-testid="PeerForm__name-input"
				/>
			</FormField>

			<FormField name="host">
				<FormLabel label={t("SETTINGS.PEERS.PEER_IP")} />
				<InputDefault
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("SETTINGS.PEERS.PEER_IP"),
						}).toString(),
						validate: (host) => {
							if (peer?.host === host) {
								return true;
							}

							return onValidateHost?.(network?.id(), host);
						},
					})}
					defaultValue={peer?.host}
					data-testid="PeerForm__host-input"
				/>
			</FormField>

			<FormField name="type">
				<FormLabel label={t("SETTINGS.PEERS.TYPE")} required={false} optional />
				<label htmlFor="isMultiSignature" className="flex items-center space-x-2">
					<Checkbox
						ref={register()}
						name="isMultiSignature"
						defaultChecked={peer?.isMultiSignature}
						data-testid="PeerForm__multisignature-toggle"
					/>
					<span className="text-sm font-semibold text-theme-secondary-text">
						{t("COMMON.MULTISIGNATURE")}
					</span>
				</label>
			</FormField>

			<div className="flex justify-end mt-4">
				<Button type="submit" disabled={!isValid} data-testid="PeerForm__submit-button">
					{t(`SETTINGS.PEERS.${!peer ? "ADD_PEER" : "EDIT_PEER"}`)}
				</Button>
			</div>
		</Form>
	);
};

PeerForm.defaultProps = {
	networks: [],
};
