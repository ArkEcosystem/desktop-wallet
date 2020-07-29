import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { useActiveProfile } from "app/hooks/env";
import { PeerList } from "domains/setting/components/PeerList";
import { networks, peers } from "domains/setting/data";
import React from "react";
import { useTranslation } from "react-i18next";

type PeerProps = {
	formConfig: any;
	onSubmit?: any;
};

export const Peer = ({ formConfig, onSubmit }: PeerProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const activeProfile = useActiveProfile()!;
	const { t } = useTranslation();

	const peerItems = [
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-theme-neutral mt-1 text-sm">
						{t("SETTINGS.PEERS.BROADCAST_TRANSACTIONS.DESCRIPTION")}
					</span>
					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: t("SETTINGS.PEERS.CUSTOM_PEERS.TITLE"),
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pt-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="text-theme-neutral mt-1 text-sm">
						{t("SETTINGS.PEERS.CUSTOM_PEERS.DESCRIPTION")}
					</span>
					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
	];

	return (
		<>
			<Header title={t("SETTINGS.PEERS.TITLE")} subtitle={t("SETTINGS.PEERS.SUBTITLE")} />

			<Form id="peer-settings__form" context={formConfig.context} onSubmit={onSubmit} className="mt-8">
				<ListDivided items={peerItems} />

				<div className="pt-8">
					<PeerList networks={networks} peers={peers} />
				</div>

				<div className="pt-2 pb-4">
					<Divider dashed />
				</div>

				<div className="flex justify-end w-full">
					<Button>{t("COMMON.SAVE")}</Button>
				</div>
			</Form>
		</>
	);
};
