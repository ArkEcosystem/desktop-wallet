import { TruncateEnd } from "app/components/TruncateEnd";
import { TruncateMiddleDynamic } from "app/components/TruncateMiddleDynamic";
import React from "react";
import { Size } from "types";

interface Props {
	walletName?: string;
	addressClass?: string;
	address?: string;
	maxNameChars?: number;
	walletNameClass?: string;
	size?: Size;
	fontWeight?: "normal";
}

export const Address = ({
	address,
	addressClass,
	walletNameClass,
	fontWeight,
	walletName,
	maxNameChars,
	size,
}: Props) => {
	const getFontSize = (size?: Size) => {
		switch (size) {
			case "sm":
				return "text-sm";
			case "lg":
				return "text-lg";
			case "xl":
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
		<div className="flex-grow flex items-center no-ligatures overflow-hidden whitespace-nowrap space-x-2">
			{walletName && (
				<span
					data-testid="Address__alias"
					className={`${getFontWeight(fontWeight)} ${getFontSize(size)} ${
						walletNameClass || "text-theme-text"
					}`}
				>
					<TruncateEnd
						text={walletName}
						maxChars={maxNameChars}
						showTooltip={!!maxNameChars && walletName.length > maxNameChars}
					/>
				</span>
			)}
			{address && (
				<TruncateMiddleDynamic
					data-testid="Address__address"
					value={address}
					className={`${
						addressClass ||
						(walletName ? "text-theme-secondary-500 dark:text-theme-secondary-700" : "text-theme-text")
					} ${getFontWeight(fontWeight)} ${getFontSize(size)}`}
				/>
			)}
		</div>
	);
};
