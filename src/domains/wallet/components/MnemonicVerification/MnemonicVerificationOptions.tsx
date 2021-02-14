import { motion, useAnimation } from "framer-motion";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { getOrdinalIndicator } from "./utils/evaluateOrdinalIndicator";
import { shuffleOptions } from "./utils/shuffleOptions";

export const OptionButton = styled(motion.button)`
	${tw`font-medium rounded-lg transition-colors duration-100 border-2 border-theme-primary-100 dark:border-theme-secondary-800 p-3 focus:outline-none focus:shadow-outline hover:border-theme-primary-200 hover:dark:border-theme-secondary-700`}
	will-change: transform;
`;

type Props = {
	handleChange: (value: string) => void;
	answer: string;
	options: string[];
	limit: number;
	position: number;
};

export const MnemonicVerificationOptions = ({ handleChange, options, limit, answer, position }: Props) => {
	const controls = useAnimation();

	const { t } = useTranslation();

	const [shuffled] = React.useState(() => shuffleOptions({ options, limit, value: answer }));

	const handleClick = (value: string, index: number) => {
		handleChange(value);
		controls.start((i) => {
			if (i !== index) {
				return {};
			}
			return {
				x: [-3, 3, 0],
				transition: {
					loop: 2,
					duration: 0.1,
				},
			};
		});
	};

	return (
		<div>
			<p
				data-testid="MnemonicVerificationOptions__title"
				className="mb-2 text-lg font-semibold text-theme-secondary-700 dark:text-theme-secondary-200"
			>
				{t(`WALLETS.MNEMONIC_VERIFICATION.SELECT_WORD`, {
					position,
					ordinalIndicator: getOrdinalIndicator(position),
				})}
			</p>
			<div className="grid grid-cols-3 gap-2">
				{shuffled.map((item, index) => (
					<OptionButton
						data-testid="MnemonicVerificationOptions__button"
						type="button"
						whileHover={{ scale: 0.97 }}
						custom={index}
						animate={controls}
						key={index}
						onClick={() => handleClick(item, index)}
					>
						{item}
					</OptionButton>
				))}
			</div>
		</div>
	);
};
