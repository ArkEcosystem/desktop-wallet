import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { useClipboard } from "../../hooks";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { ClipboardCommonProps } from "./Clipboard";

export type ClipboardButtonProps = ClipboardCommonProps & {
	variant: "button";
} & React.ButtonHTMLAttributes<any>;

export const ClipboardButton = ({ data, variant, options, children, ...props }: ClipboardButtonProps) => {
	const [hasCopied, copy] = useClipboard({
		resetAfter: 1000,
		...options,
	});

	return (
		<div className="relative">
			<Button variant="secondary" onClick={() => copy(data)} {...props}>
				{children}
			</Button>

			<AnimatePresence>
				{hasCopied && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 0.4 } }}
						exit={{ opacity: 0, transition: { duration: 0.4 } }}
						className="absolute inset-0 flex justify-center items-center bg-theme-primary-100 dark:bg-theme-secondary-800 rounded"
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
