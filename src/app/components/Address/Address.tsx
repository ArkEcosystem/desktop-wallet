import React from "react";

import { truncateStringMiddle } from "./utils";

type Props = {
	walletName?: string;
	addressClass?: string;
	address?: string | undefined;
	maxChars?: number | null;
	className?: string;
	size?: "small" | "default" | "large";
	fontWeight?: "default" | "normal";
};

export const Address = ({ address, addressClass, fontWeight, walletName, maxChars, size }: Props) => {
	if (!address) return null;

	const fontSizes: any = {
		small: "text-sm",
		default: "text-base",
		large: "text-xl",
	};

	const fontWeights: any = {
		default: "font-semibold",
		normal: "font-normal",
	};

	return (
		<div className="inline-block truncate">
			{walletName && (
				<span
					data-testid="address__wallet-name"
					className={`text-theme-neutral-800 max-w-24 flex-auto truncate mt-4 mr-1 ${
						fontWeight && fontSizes[fontWeight]
					} ${size && fontSizes[size]}`}
				>
					{walletName}
				</span>
			)}
			<span
				data-testid="address__wallet-address"
				className={`${addressClass || (walletName ? "text-theme-neutral-400" : "text-theme-neutral-800")} ${
					fontWeight && fontSizes[fontWeight]
				} ${size && fontSizes[size]}`}
			>
				{truncateStringMiddle(address, maxChars)}
			</span>
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
	size: "default",
	fontWeight: "default",
};
