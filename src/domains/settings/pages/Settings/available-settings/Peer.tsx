import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { PeerList } from "domains/settings/components/PeerList";
import { peers } from "domains/settings/data";
import React from "react";

type PeerProps = {
	formConfig: any;
	onSubmit?: any;
};

export const Peer = ({ formConfig, onSubmit }: PeerProps) => {
	const peerItems = [
		{
			isFloatingLabel: true,
			label: "Broadcast to Multiple Peers",
			labelClass: "text-xl font-bold text-theme-neutral-dark",
			content: (
				<div className="flex flex-row justify-between mb-3">
					<span className="w-3/4 -mt-4 text-sm text-theme-neutral">
						This protection will protect your money from unwanted Screenshot your PC.
					</span>
					<div className="-mt-11">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Use Custom Peers",
			labelClass: "text-xl font-bold text-theme-neutral-dark -mt-4",
			content: (
				<div className="flex flex-row justify-between">
					<span className="w-3/4 -mt-4 text-sm text-theme-neutral">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
					</span>
					<div className="-mt-11">
						<Toggle />
					</div>
				</div>
			),
		},
	];

	return (
		<>
			<Header title="Peer Settings" subtitle="Customize your wallet to suit your needs." />
			<Form id="peer-settings__form" context={formConfig.context} onSubmit={onSubmit}>
				<ListDivided items={peerItems} />
				<PeerList peers={peers} />
				<Divider dashed />
				<div className="flex justify-end">
					<Button>Save</Button>
				</div>
			</Form>
		</>
	);
};
