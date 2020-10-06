import { Coins } from "@arkecosystem/platform-sdk";
import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type CustomPeersProps = {
	isOpen: boolean;
	onClose?: any;
	onAddPeer?: any;
	networks?: Coins.Network[];
};

export const CustomPeers = ({ isOpen, onClose, onAddPeer, networks }: CustomPeersProps) => {
	const form = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	return (
		<Modal title={t("SETTINGS.MODAL_CUSTOM_PEER.TITLE")} size="xl" isOpen={isOpen} onClose={onClose}>
			<Form context={form} onSubmit={onAddPeer}>
				<FormField name="network" className="my-8">
					<FormLabel label={t("SETTINGS.PEERS.CRYPTOASSET")} />
					<SelectNetwork id="CustomPeers__network" networks={networks} />
					<FormHelperText />
				</FormField>

				<FormField name="name">
					<FormLabel label={t("SETTINGS.PEERS.NAME")} />
					<Input
						ref={form.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("SETTINGS.PEERS.NAME"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="peer-ip">
					<FormLabel label={t("SETTINGS.PEERS.IP")} />
					<Input
						ref={form.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("SETTINGS.PEERS.IP"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="peer-type">
					<FormLabel label={t("SETTINGS.PEERS.TYPE")} />
					<label htmlFor="multisig" className="inline-flex items-center">
						<Checkbox />
						<span className="ml-2 text-sm font-semibold text-theme-neutral-dark">
							{t("COMMON.MULTISIGNATURE")}
						</span>
					</label>
				</FormField>

				<div className="flex justify-end mt-4">
					<Button type="submit" data-testid="peer-list__add-button">
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
