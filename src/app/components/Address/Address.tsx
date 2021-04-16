import { TruncateEnd } from "app/components/TruncateEnd";
import { useTextTruncate } from "app/hooks/use-text-truncate";
import React, { useRef } from "react";
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
	const ref = useRef(null);
	const [TruncatedAddress] = useTextTruncate({ text: address, parentRef: ref });

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
		<div ref={ref} className="w-full flex items-center no-ligatures overflow-hidden whitespace-nowrap">
			{walletName && (
				<span
					data-testid="address__wallet-name"
					className={`max-w-24 flex-auto truncate mr-2 ${getFontWeight(fontWeight)} ${getFontSize(size)} ${
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
				<TruncatedAddress
					data-testid="address__wallet-address"
					className={`${
						addressClass ||
						(walletName ? "text-theme-secondary-500 dark:text-theme-secondary-700" : "text-theme-text")
					} ${getFontWeight(fontWeight)} ${getFontSize(size)}`}
				/>
			)}
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
};
