import React from "react";

import { truncateStringMiddle } from "./utils";

type Props = {
	walletName?: string;
	address?: string | undefined;
	maxChars?: number;
	className?: string;
	size?: "small" | "default" | "large";
};

export const Address = ({ address, walletName, maxChars, size }: Props) => {
	if (!address) return null;

	const fontSizes: any = {
		small: "text-sm",
		default: "text-base",
		large: "text-xl",
	};

	return (
		<div className="inline-block truncate">
			{walletName && (
				<span
					data-testid="address__wallet-name"
					className={`text-theme-neutral-800 font-semibold max-w-24 flex-auto truncate mt-4 mr-1 ${
						size && fontSizes[size]
					}`}
				>
					{walletName}
				</span>
			)}
			<span
				data-testid="address__wallet-address"
				className={`text-theme-neutral-400 font-semibold ${size && fontSizes[size]}`}
			>
				{truncateStringMiddle(address, maxChars)}
			</span>
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
	size: "default",
};
