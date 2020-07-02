import React from "react";
import { Size } from "types";

import { truncateStringMiddle } from "./utils";

type Props = {
	walletName?: string;
	addressClass?: string;
	address?: string | undefined;
	maxChars?: number | null;
	className?: string;
	size?: Size;
	fontWeight?: "normal";
};

export const Address = ({ address, addressClass, fontWeight, walletName, maxChars, size }: Props) => {
	if (!address) return null;

	const getFontSize = (size?: Size) => {
		switch (size) {
			case "sm":
				return "text-sm";
			case "lg":
				return "text-xl";
			default:
				return "text-base";
		}
	};

	const getFontWeight = (fontWeight?: string) => {
		switch (fontWeight) {
			case "normal":
				return "font-normal";
			default:
				return "font-semibold";
		}
	};

	return (
		<div className="inline-block truncate align-middle">
			{walletName && (
				<span
					data-testid="address__wallet-name"
					className={`text-theme-neutral-800 max-w-24 flex-auto truncate mt-4 mr-1 ${getFontWeight(
						fontWeight,
					)} ${getFontSize(size)}`}
				>
					{walletName}
				</span>
			)}
			<span
				data-testid="address__wallet-address"
				className={`${
					addressClass || (walletName ? "text-theme-neutral-400" : "text-theme-neutral-800")
				} ${getFontWeight(fontWeight)} ${getFontSize(size)}`}
			>
				{truncateStringMiddle(address, maxChars)}
			</span>
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
};
