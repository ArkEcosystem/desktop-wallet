import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form } from "app/components/Form";
import { Header } from "app/components/Header";
import { ListDivided } from "app/components/ListDivided";
import { Toggle } from "app/components/Toggle";
import { PeerList } from "domains/setting/components/PeerList";
import { peers } from "domains/setting/data";
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
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pb-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm text-theme-neutral">
						This protection will protect your money from unwanted Screenshot your PC.
					</span>
					<div className="-mt-7">
						<Toggle />
					</div>
				</div>
			),
		},
		{
			isFloatingLabel: true,
			label: "Use Custom Peers",
			labelClass: "text-lg font-semibold text-theme-neutral-dark",
			wrapperClass: "pt-6",
			content: (
				<div className="flex flex-row justify-between">
					<span className="mt-1 text-sm text-theme-neutral">
						You hereby assume the risk associated with downloading files and installing said files from a
						direct URL link.
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
			<Header title="Peer Settings" subtitle="Customize your wallet to suit your needs." />

			<Form id="peer-settings__form" context={formConfig.context} onSubmit={onSubmit} className="mt-8">
				<ListDivided items={peerItems} />

				<div className="pt-8">
					<PeerList peers={peers} />
				</div>

				<div className="pt-2 pb-4">
					<Divider dashed />
				</div>

				<div className="flex justify-end w-full">
					<Button>Save</Button>
				</div>
			</Form>
		</>
	);
};
