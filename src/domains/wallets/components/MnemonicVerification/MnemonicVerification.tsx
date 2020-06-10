import React from "react";
import { Tabs, TabPanel } from "app/components/Tabs";

import { MnemonicVerificationProgress } from "./MnemonicVerificationProgress";
import { MnemonicVerificationOptions } from "./MnemonicVerificationOptions";

type Props = {
	mnemonic: string[];
	wordPositions: number[];
	optionsLimit: number;
	handleComplete: () => void;
};

export function MnemonicVerification({ mnemonic, wordPositions, optionsLimit, handleComplete }: Props) {
	const [activeTab, setActiveTab] = React.useState(0);

	const currentAnswer = React.useMemo(() => mnemonic[wordPositions[activeTab] - 1], [
		activeTab,
		wordPositions,
		mnemonic,
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
			
			<div className="mt-6">
				{wordPositions.map((position, index) => (
					<TabPanel key={position} tabId={index}>
						<MnemonicVerificationOptions
							limit={optionsLimit}
							answer={currentAnswer}
							options={mnemonic}
							handleChange={handleChange}
							position={position}
						/>
					</TabPanel>
				))}
			</div>
		</Tabs>
	);
}
