import { TruncateEnd } from "app/components/TruncateEnd";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import React from "react";
import { Size } from "types";

type Props = {
	walletName?: string;
	addressClass?: string;
	address?: string | undefined;
	maxChars?: number;
	maxNameChars?: number;
	walletNameClass?: string;
	size?: Size;
	fontWeight?: "normal";
};

export const Address = ({
	address,
	addressClass,
	walletNameClass,
	fontWeight,
	walletName,
	maxChars,
	maxNameChars,
	size,
}: Props) => {
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
		<div className="inline-flex items-center no-ligatures">
			{walletName && (
				<span
					data-testid="address__wallet-name"
					className={`max-w-24 flex-auto truncate mr-2 ${getFontWeight(fontWeight)} ${getFontSize(size)} ${
						walletNameClass || "text-theme-text"
					}`}
				>
					<TruncateEnd text={walletName} maxChars={maxNameChars} />
				</span>
			)}
			{address && (
				<TruncateMiddle
					text={address}
					maxChars={maxChars}
					data-testid="address__wallet-address"
					className={`${
						addressClass ||
						(walletName ? "text-theme-secondary-500 dark:text-theme-secondary-700" : "text-theme-text")
					} truncate ${getFontWeight(fontWeight)} ${getFontSize(size)}`}
				/>
			)}
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
};
