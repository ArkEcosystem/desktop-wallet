import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { PeerList } from "domains/setting/components/PeerList";
import { networks, peers } from "domains/setting/data";
import React from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const Peer = ({ formConfig, onSuccess }: SettingsProps) => {
	const { t } = useTranslation();

	const peerItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			labelDescription: t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.DESCRIPTION"),
			labelAddon: <Toggle />,
			wrapperClass: "pb-6",
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.CUSTOM_PEERS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			labelDescription: t("SETTINGS.PEERS.CUSTOM_PEERS.DESCRIPTION"),
			labelAddon: <Toggle />,
			wrapperClass: "pt-6",
		},
	];

	const handleSubmit = () => {
		onSuccess(t("SETTINGS.PEERS.SUCCESS"));
	};

	return (
		<>
			<Header title={t("SETTINGS.PEERS.TITLE")} subtitle={t("SETTINGS.PEERS.SUBTITLE")} />

			<Form id="peer-settings__form" context={formConfig.context} onSubmit={handleSubmit} className="mt-8">
				<ListDivided items={peerItems} />

				<div className="pt-8">
					<PeerList networks={networks} peers={peers} />
				</div>

				<div className="pt-2 pb-4">
					<Divider dashed />
				</div>

				<div className="flex justify-end w-full">
					<Button data-testid="Peer-settings__submit-button" type="submit">{t("COMMON.SAVE")}</Button>
				</div>
			</Form>
		</>
	);
};
