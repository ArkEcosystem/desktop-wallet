import { Header } from "app/components/Header";
import React from "react";

type PeerProps = {
	formConfig: any;
	onSubmit?: any;
};

export const Peer = ({ formConfig, onSubmit }: PeerProps) => {
	return (
		<>
			<Header title="Peer Settings" subtitle="Customize your wallet to suit your needs." />
		</>
	);
};
