import React from "react";

type Props = {
	mnemonic: string;
};

export function MnemonicList({ mnemonic }: Props) {
	return (
		<ul className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
			{mnemonic.split(" ").map((word, index) => (
				<li
					data-testid="MnemonicList__item"
					key={index}
					className="relative py-3 px-3 rounded border border-theme-secondary-300 dark:border-theme-secondary-800"
				>
					<span className="absolute top-0 left-0 px-1 text-xs font-semibold transform translate-x-2 -translate-y-2 bg-theme-background text-theme-secondary-800">
						{index + 1}
					</span>
					<span className="font-medium">{word}</span>
				</li>
			))}
		</ul>
	);
}
