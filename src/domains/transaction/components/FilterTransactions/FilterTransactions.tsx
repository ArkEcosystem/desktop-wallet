import { Dropdown, DropdownOption, DropdownOptionGroup } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { useTransactionTypes } from "domains/transaction/hooks/use-transaction-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type FilterTransactionsProps = {
	className?: string;
	defaultSelected?: DropdownOption;
	onSelect?: (selectedOption: DropdownOption) => void;
};

type FilterTransactionsToggleProps = {
	isOpen: boolean;
	selectedOption?: DropdownOption;
};

const FilterTransactionsToggle = ({ selectedOption, isOpen }: FilterTransactionsToggleProps) => (
	<div className="flex cursor-pointer items-center space-x-2" data-testid="FilterTransactionsToggle">
		<div className="font-semibold">
			<span className="text-theme-neutral-500">Type: </span>
			<span className="text-theme-neutral-600">{selectedOption?.label}</span>
		</div>
		<Icon
			className="bg-theme-primary-600 border-theme-primary-600 text-theme-primary-contrast p-1 rounded-xl"
			name={isOpen ? "ChevronUp" : "ChevronDown"}
			width={9}
			height={9}
		/>
	</div>
);

export const FilterTransactions = ({ className, onSelect, defaultSelected }: FilterTransactionsProps) => {
	const { t } = useTranslation();
	const { types, getLabel } = useTransactionTypes();

	const allOptions: DropdownOptionGroup[] = [
		{
			key: "all",
			options: [{ label: t("COMMON.ALL"), value: "all" }],
		},
		{
			key: "core",
			title: t("TRANSACTION.CORE"),
			hasDivider: true,
			options: types.map((type) => ({ label: getLabel(type), value: type })),
		},
	];

	const [selectedOption, setSelectedOption] = useState<DropdownOption>(defaultSelected || allOptions[0].options[0]);

	const handleSelect = (selectedOption: DropdownOption) => {
		setSelectedOption(selectedOption);
		onSelect?.(selectedOption);
	};
	return (
		<div className={className} data-testid="FilterTransactions">
			<Dropdown
				dropdownClass="max-h-128 overflow-y-auto"
				options={allOptions}
				toggleContent={(isOpen: boolean) => (
					<FilterTransactionsToggle isOpen={isOpen} selectedOption={selectedOption} />
				)}
				onSelect={handleSelect}
			/>
		</div>
	);
};

FilterTransactions.defaultProps = {};
