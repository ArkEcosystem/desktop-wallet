import React, { useState, useEffect } from "react";
import { boolean } from "@storybook/addon-knobs";
import { WalletUpdate } from "./";

export default { title: "Wallets / Components / Wallet Update" };

export const Default = () => {
	const [isUpdate, setIsUpdate] = useState(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isUpdate) {
			setTimeout(() => {
				setIsReady(true);
				setIsUpdate(false);
			}, 2000);
		}
	}, [isUpdate]);

	return (
		<WalletUpdate
			isOpen={boolean("Is Open", true)}
			isUpdate={isUpdate}
			isReady={isReady}
			onClose={() => alert("closed")}
			onCancel={() => alert("cancelled")}
			onUpdate={() => setIsUpdate(true)}
		/>
	);
};
