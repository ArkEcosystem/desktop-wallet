import React from "react";

type Props = {
	mnemonic: string;
};

export function MnemonicList({ mnemonic }: Props) {
	let mnemonicWords: string[];

	// Check for Japanese "space"
	if (/\u3000/.test(mnemonic)) {
		mnemonicWords = mnemonic.split("\u3000");
	} else {
		mnemonicWords = mnemonic.split(" ");
	}

	return (
		<ul className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
			{mnemonicWords.map((word, index) => (
				<li
					data-testid="MnemonicList__item"
					key={index}
					className="relative p-4 rounded border border-theme-secondary-400 dark:border-theme-secondary-700"
				>
					<span className="absolute top-0 left-0 px-1 text-xs font-medium transform translate-x-2 -translate-y-2 bg-theme-background text-theme-secondary-700">
						{index + 1}
					</span>
					<span className="font-medium">{word}</span>
				</li>
			))}
		</ul>
	);
}
