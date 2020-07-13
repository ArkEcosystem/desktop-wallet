import { TabPanel, Tabs } from "app/components/Tabs";
import React from "react";

import { MnemonicVerificationOptions } from "./MnemonicVerificationOptions";
import { MnemonicVerificationProgress } from "./MnemonicVerificationProgress";

type Props = {
	mnemonic: string;
	wordPositions: number[];
	optionsLimit: number;
	handleComplete: () => void;
};

export function MnemonicVerification({ mnemonic, wordPositions, optionsLimit, handleComplete }: Props) {
	const [activeTab, setActiveTab] = React.useState(0);
	const mnemonicWords = mnemonic.split(" ");

	const currentAnswer = React.useMemo(() => mnemonicWords[positions[activeTab] - 1], [
		activeTab,
		wordPositions,
		mnemonicWords,
	]);

	const handleNext = () => {
		if (activeTab === wordPositions.length - 1) {
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
			<MnemonicVerificationProgress activeTab={activeTab} wordPositions={wordPositions} />

			<div className="mt-10">
				{wordPositions.map((position, index) => (
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
