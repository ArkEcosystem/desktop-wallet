import React from "react";
import { truncateStringMiddle } from "./utils";

type Props = {
	walletName?: string;
	address?: string | undefined;
	maxChars?: number;
	className?: string;
};

export const Address = ({ address, walletName, maxChars }: Props) => {
	if (!address) return null;

	if (!walletName) {
		return (
			<div className="truncate inline-block">
				<span className="text-theme-neutral-800 font-semibold text-sm">
					{truncateStringMiddle(address, maxChars)}
				</span>
			</div>
		);
	}

	return (
		<div className="truncate inline-block">
			<span className="text-theme-neutral-800 font-semibold max-w-24 flex-auto truncate mt-4 text-sm mr-1">
				{walletName}
			</span>
			<span className="text-theme-neutral-400 font-semibold text-sm">
				{truncateStringMiddle(address, maxChars)}
			</span>
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
};
