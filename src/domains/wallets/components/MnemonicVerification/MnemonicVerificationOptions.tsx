import React from "react";
import tw, { styled } from "twin.macro";
import { motion, useAnimation } from "framer-motion";
import { shuffleOptions } from "./utils/shuffleOptions";

export const OptionButton = styled(motion.button)`
	${tw`rounded-lg transition-colors duration-100 border-2 border-theme-primary-contrast p-3 focus:outline-none focus:shadow-outline hover:border-theme-primary-light`}
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

	const shuffled = React.useMemo(() => shuffleOptions({ options, limit, value: answer }), [options, limit, answer]);

	const handleClick = (value: string, index: number) => {
		handleChange(value);
		controls.start((i) => {
			if (i !== index) return {};
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
			<p data-testid="MnemonicVerificationOptions__title" className="text-theme-neutral-dark font-semibold mb-2">
				Select word #{position}
			</p>
			<div className="grid grid-cols-3 gap-2">
				{shuffled.map((item, index) => (
					<OptionButton
						data-testid="MnemonicVerificationOptions__button"
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
