import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

import { OptionButton } from "./MnemonicVerificationOptions";

const TabStyled = styled(OptionButton)<{ isActive: boolean; isComplete: boolean; isPending: boolean }>`
	${tw`flex-1 flex justify-center pointer-events-none transition-colors duration-200`};
	${({ isActive }) => isActive && tw`font-medium bg-theme-success-contrast border-theme-success`};
	${({ isComplete }) => isComplete && tw`border-transparent bg-theme-success-200`};
	${({ isPending }) => isPending && tw`border-theme-primary-contrast text-theme-primary`};
`;

type TabProps = {
	activeTab: number;
	tabId: number;
	wordPosition: number;
};

const Tab = ({ activeTab, tabId, wordPosition }: TabProps) => {
	const { isActive, isComplete, isPending } = React.useMemo(
		() => ({
			isActive: activeTab === tabId,
			isComplete: activeTab > tabId,
			isPending: tabId > activeTab,
		}),
		[activeTab, tabId],
	);

	const { t } = useTranslation();

	return (
		<TabStyled
			disabled
			data-testid="MnemonicVerificationProgress__Tab"
			isActive={isActive}
			isComplete={isComplete}
			isPending={isPending}
		>
			{isComplete ? (
				<span className="text-lg text-theme-success">
					<Icon name="Ok" />
				</span>
			) : (
				<span>{t("WALLETS.MNEMONIC_VERIFICATION.WORD_NUMBER", { position: wordPosition })}</span>
			)}
		</TabStyled>
	);
};

type Props = {
	activeTab: number;
	wordPositions: number[];
};

export const MnemonicVerificationProgress = ({ activeTab, wordPositions }: Props) => {
	return (
		<ul className="flex space-x-2">
			{wordPositions.map((position, index) => (
				<Tab key={index} activeTab={activeTab} tabId={index} wordPosition={position} />
			))}
		</ul>
	);
};
