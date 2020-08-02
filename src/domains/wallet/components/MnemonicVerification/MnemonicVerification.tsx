import { TabPanel, Tabs } from "app/components/Tabs";
import React, { useEffect, useMemo, useState } from "react";

import { MnemonicVerificationOptions } from "./MnemonicVerificationOptions";
import { MnemonicVerificationProgress } from "./MnemonicVerificationProgress";

type Props = {
	mnemonic: string;
	wordPositions?: number[];
	optionsLimit: number;
	handleComplete: () => void;
	isCompleted?: boolean;
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

export function MnemonicVerification({ mnemonic, wordPositions, optionsLimit, handleComplete, isCompleted }: Props) {
	const [activeTab, setActiveTab] = useState(0);
	const [positions, setPositions] = useState([] as number[]);
	const mnemonicWords = mnemonic.split(" ");

	if (!wordPositions?.length && activeTab === 0 && !positions.length) {
		setPositions(randomWordPositions());
	} else if (activeTab === 0 && !positions.length) {
		setPositions(wordPositions as number[]);
	}

	useEffect(() => {
		if (isCompleted) {
			setActiveTab(positions.length);
		}
	}, [isCompleted, positions, setActiveTab]);

	const currentAnswer = useMemo(() => mnemonicWords[positions[activeTab] - 1], [activeTab, positions, mnemonicWords]);

	const handleChange = (value: string) => {
		if (value === currentAnswer) {
			if (activeTab === positions.length - 1) {
				handleComplete();
			}

			setActiveTab(activeTab + 1);
		}
	};

	return (
		<Tabs activeId={activeTab}>
			<MnemonicVerificationProgress activeTab={activeTab} wordPositions={positions} />

			<div className="mt-10">
				{positions.map((position, index) => (
					<TabPanel key={index} tabId={index}>
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
	isCompleted: false,
};
