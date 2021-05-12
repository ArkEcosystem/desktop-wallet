import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputDefault } from "app/components/Input";
import { Select } from "app/components/SelectDropdown";
import { Toggle } from "app/components/Toggle";
import { useNetworkOptions, useValidation } from "app/hooks";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type PeerFormProps = {
	peer?: any;
	profile: Contracts.IProfile;
	onSave: any;
};

export const PeerForm = ({ peer, profile, onSave }: PeerFormProps) => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });

	const { clearErrors, formState, register, setValue, trigger, watch } = form;
	const { isValid, isSubmitting } = formState;
	const { network, name, host, isMultiSignature } = watch();

	const { peer: peerValidation } = useValidation();
	const { networkOptions, networkById } = useNetworkOptions();

	useEffect(() => {
		register("network", {
			required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
				field: t("SETTINGS.PEERS.NETWORK"),
			}).toString(),
		});
	}, [register, t]);

	useEffect(() => {
		if (peer) {
			setValue("network", networkById(peer.network)!, { shouldValidate: true, shouldDirty: true });
		}
	}, [networkById, peer, setValue]);

	const handleSelectNetwork = async (networkOption?: { label: string; value: string }) => {
		const selectedNetwork = networkById(networkOption?.value);

		// eslint-disable-next-line @typescript-eslint/await-thenable
		await setValue("network", selectedNetwork, { shouldValidate: true, shouldDirty: true });

		clearErrors("host");

		/* istanbul ignore else */
		if (selectedNetwork && host) {
			trigger("host");
		}
	};

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
					ref={register(peerValidation.name())}
					defaultValue={peer?.name}
					data-testid="PeerForm__name-input"
				/>
			</FormField>

			<FormField name="host">
				<FormLabel label={t("SETTINGS.PEERS.PEER_IP")} />
				<InputDefault
					ref={register(peerValidation.host(peer?.network === network?.id() ? 1 : 0, profile, network))}
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
