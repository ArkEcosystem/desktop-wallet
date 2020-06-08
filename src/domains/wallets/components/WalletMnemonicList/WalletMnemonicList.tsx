import React from "react";

type WalletMnemonicListProps = {
	mnemonic: string[];
};

export function WalletMnemonicList({ mnemonic }: WalletMnemonicListProps) {
	return (
		<ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 row-gap-5 col-gap-3">
			{mnemonic.map((word, index) => (
				<li
					data-testid="WalletMnemonicList__item"
					key={word}
					className="rounded border border-theme-neutral-light relative px-3 py-3"
				>
					<span className="absolute left-0 top-0 transform translate-x-2 -translate-y-2 text-xs px-1 bg-theme-background font-semibold text-theme-neutral">
						{index + 1}
					</span>
					<span className="font-medium text-theme-neutral-800">{word}</span>
				</li>
			))}
		</ul>
	);
}
