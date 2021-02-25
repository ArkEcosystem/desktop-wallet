import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { CollapseToggleButton } from "app/components/Collapse";
import { Dropdown, DropdownOption, DropdownOptionGroup } from "app/components/Dropdown";
import { useTransactionTypes } from "domains/transaction/hooks/use-transaction-types";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";

type FilterTransactionsProps = {
	className?: string;
	defaultSelected?: DropdownOption;
	wallets?: ReadWriteWallet[];
	onSelect?: (selectedOption: DropdownOption, types: any) => void;
};

export const FilterTransactions = memo(({ className, onSelect, defaultSelected, wallets }: FilterTransactionsProps) => {
	const { t } = useTranslation();
	const { types, getLabel, getQueryParamsByType } = useTransactionTypes({ wallets });

	const allOptions: DropdownOptionGroup[] = [
		{
			key: "all",
			options: [{ label: t("COMMON.ALL"), value: "all" }],
		},
		{
			key: "core",
			title: t("TRANSACTION.CORE"),
			hasDivider: true,
			options: types.core.map((type) => ({ label: getLabel(type), value: type })),
		},
	];

	const [selectedOption, setSelectedOption] = useState<DropdownOption>(defaultSelected || allOptions[0].options[0]);

	const handleSelect = (selectedOption: DropdownOption) => {
		setSelectedOption(selectedOption);
		onSelect?.(selectedOption, getQueryParamsByType(String(selectedOption.value)));
	};
	return (
		<div className={className} data-testid="FilterTransactions">
			<Dropdown
				dropdownClass="w-80 max-h-128 overflow-y-auto"
				options={allOptions}
				toggleContent={(isOpen: boolean) => (
					<CollapseToggleButton
						isOpen={isOpen}
						label={
							<>
								<span className="text-theme-secondary-500 dark:text-theme-secondary-600">
									{t("COMMON.TYPE")}:{" "}
								</span>
								<span className="text-theme-secondary-700 dark:text-theme-secondary-200">
									{selectedOption?.label}
								</span>
							</>
						}
					/>
				)}
				onSelect={handleSelect}
			/>
		</div>
	);
});
