import { getStyles } from "app/components/Button/Button.styles";
import { Icon } from "app/components/Icon";
import { useClipboard } from "app/hooks";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { styled } from "twin.macro";
import { Size } from "types";

import { ClipboardCommonProps } from "./Clipboard";

export type ClipboardButtonProps = ClipboardCommonProps & {
	variant: "button";
} & React.ButtonHTMLAttributes<any>;

type ButtonProps = {
	size?: Size;
} & React.ButtonHTMLAttributes<any>;
const StyledButton = styled.button<ButtonProps>(getStyles);

export const ClipboardButton = ({ data, options, children, ...props }: ClipboardButtonProps) => {
	const [hasCopied, copy] = useClipboard({
		resetAfter: 1000,
		...options,
	});

	return (
		<div className="relative">
			<StyledButton
				type="button"
				variant="secondary"
				onClick={() => copy(data)}
				data-testid="clipboard-button__wrapper"
				{...props}
			>
				<div className="flex items-center space-x-2">{children}</div>
			</StyledButton>

			<AnimatePresence>
				{hasCopied && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 0.3 } }}
						exit={{ opacity: 0, transition: { duration: 0.3 } }}
						className="absolute inset-0 flex items-center justify-center rounded bg-theme-primary-100 dark:bg-theme-secondary-800"
						data-testid="clipboard-button__checkmark"
					>
						<Icon
							name="Checkmark"
							className="text-theme-primary-600 dark:text-theme-secondary-200"
							width={28}
							height={28}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
