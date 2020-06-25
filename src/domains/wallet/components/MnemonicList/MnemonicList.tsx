import React from "react";

type Props = {
	mnemonic: string[];
};

export function MnemonicList({ mnemonic }: Props) {
	return (
		<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 row-gap-5 col-gap-3">
			{mnemonic.map((word, index) => (
				<li
					data-testid="MnemonicList__item"
					key={word}
					className="relative px-3 py-3 border rounded border-theme-neutral-light"
				>
					<span className="absolute top-0 left-0 px-1 text-xs font-semibold transform translate-x-2 -translate-y-2 bg-theme-background text-theme-neutral">
						{index + 1}
					</span>
					<span className="font-medium text-theme-neutral-800">{word}</span>
				</li>
			))}
		</ul>
	);
}
