import { TabPanel, Tabs } from "app/components/Tabs";
import React from "react";

import { MnemonicVerificationOptions } from "./MnemonicVerificationOptions";
import { MnemonicVerificationProgress } from "./MnemonicVerificationProgress";

type Props = {
	mnemonic: string;
	wordPositions?: number[];
	optionsLimit: number;
	handleComplete: () => void;
};

const randomWordPositions = () => {
	const positions: number[] = [];
	while (positions.length < 3) {
		const randomNumber = Math.floor(Math.random() * 12) + 1;
		if (!positions.includes(randomNumber)) {
			positions.push(randomNumber);
		}
	}

	return positions;
};

export function MnemonicVerification({ mnemonic, wordPositions, optionsLimit, handleComplete }: Props) {
	const [activeTab, setActiveTab] = React.useState(0);
	const [positions, setPositions] = React.useState([] as number[]);
	const mnemonicWords = mnemonic.split(" ");

	if (!wordPositions?.length && activeTab === 0 && !positions.length) {
		setPositions(randomWordPositions());
	} else if (activeTab === 0 && !positions.length) {
		setPositions(wordPositions);
	}

	const currentAnswer = React.useMemo(() => mnemonicWords[positions[activeTab] - 1], [
		activeTab,
		positions,
		mnemonicWords,
	]);

	const handleNext = () => {
		if (activeTab === positions.length - 1) {
			handleComplete();
		}
		setActiveTab(activeTab + 1);
	};

	const handleChange = (value: string) => {
		if (value === currentAnswer) {
			handleNext();
		}
	};

	return (
		<Tabs activeId={activeTab}>
			<MnemonicVerificationProgress activeTab={activeTab} wordPositions={positions} />

			<div className="mt-10">
				{positions.map((position, index) => (
					<TabPanel key={position} tabId={index}>
						<MnemonicVerificationOptions
							limit={optionsLimit}
							answer={currentAnswer}
							options={mnemonicWords}
							handleChange={handleChange}
							position={position}
						/>
					</TabPanel>
				))}
			</div>
		</Tabs>
	);
}

MnemonicVerification.defaultProps = {
	wordPositions: [],
};
