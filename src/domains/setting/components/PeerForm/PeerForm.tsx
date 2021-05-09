import { Coins } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputDefault } from "app/components/Input";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { Option } from "domains/contact/components/ContactListItem/ContactListItem.models";
import React, { useEffect, useMemo } from "react";
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
	const { isValid, isSubmitting } = formState;
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
			networks.map((network) => ({
				value: network.id(),
				label: `${network.coin()} ${network.name()}`,
			})),
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

			<FormField name="isMultiSignature">
				<div className="flex flex-col space-y-2 w-full">
					<div className="flex justify-between items-center space-x-5">
						<span className="text-lg font-semibold text-theme-secondary-700 dark:text-theme-secondary-200">
							{t("SETTINGS.PEERS.MULTISIGNATURE.TITLE")}
						</span>

						<Toggle
							ref={register()}
							name="isMultiSignature"
							defaultChecked={peer?.isMultiSignature}
							data-testid="PeerForm__multisignature-toggle"
						/>
					</div>

					<span className="text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-700">
						{t("SETTINGS.PEERS.MULTISIGNATURE.DESCRIPTION")}
					</span>
				</div>
			</FormField>

			<div className="flex justify-end pt-8 border-t border-theme-secondary-300 dark:border-theme-secondary-800">
				<Button type="submit" disabled={!isValid || isSubmitting} data-testid="PeerForm__submit-button">
					{t(`SETTINGS.PEERS.${!peer ? "ADD_PEER" : "EDIT_PEER"}`)}
				</Button>
			</div>
		</Form>
	);
};

PeerForm.defaultProps = {
	networks: [],
};
