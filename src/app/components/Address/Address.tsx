import { TruncateMiddle } from "app/components/TruncateMiddle";
import React from "react";
import { Size } from "types";

type Props = {
	walletName?: string;
	addressClass?: string;
	address?: string | undefined;
	maxChars?: number;
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
					className={`text-theme-text max-w-24 flex-auto truncate mt-4 mr-1 ${getFontWeight(
						fontWeight,
					)} ${getFontSize(size)}`}
				>
					{walletName}
				</span>
			)}
			<TruncateMiddle
				text={address}
				maxChars={maxChars}
				data-testid="address__wallet-address"
				className={`${
					addressClass || (walletName ? "text-theme-neutral-light" : "text-theme-text")
				} ${getFontWeight(fontWeight)} ${getFontSize(size)}`}
			/>
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
};
