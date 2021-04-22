import { Coins } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputDefault } from "app/components/Input";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Select } from "app/components/SelectDropdown";
import { Option } from "domains/contact/components/ContactListItem/ContactListItem.models";

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

	const handleSelectNetwork = (networkOption?: Option) => {
		const network = networks.find((network) => network.id() === networkOption?.value);

		if (form.errors.host?.message.includes("already exists")) {
			form.clearErrors("host");

			/* istanbul ignore else */
			if (host) {
				setValue("host", host, { shouldValidate: true, shouldDirty: true });
			}
		}

		setValue("network", network, { shouldValidate: true, shouldDirty: true });
	};

	const networkOptions = useMemo(
		() =>
			networks.map((network) => {
				return {
					value: network.id(),
					label: network.name(),
				};
			}),
		[networks],
	);

	return (
		<Form data-testid="PeerForm" context={form} onSubmit={() => onSave({ network, name, host, isMultiSignature })}>
			<FormField name="network" className="my-8">
				<FormLabel label={t("SETTINGS.PEERS.NETWORK")} />
				<Select
					placeholder={t("COMMON.SELECT_OPTION", {
						option: t("SETTINGS.PEERS.NETWORK"),
					})}
					defaultValue={network?.id()}
					options={networkOptions}
					onChange={(networkOption: any) => handleSelectNetwork(networkOption)}
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
				<label className="flex items-center space-x-2">
					<Checkbox
						ref={register()}
						name="isMultiSignature"
						defaultChecked={peer?.isMultiSignature}
						data-testid="PeerForm__multisignature-toggle"
					/>
					<span className="text-sm font-semibold text-theme-secondary-text select-none">
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
