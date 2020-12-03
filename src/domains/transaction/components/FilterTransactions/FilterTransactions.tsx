import { Dropdown, DropdownOption, DropdownOptionGroup } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { useTransactionTypes } from "domains/transaction/hooks/use-transaction-types";
import React, { memo,useState } from "react";
import { useTranslation } from "react-i18next";

type FilterTransactionsProps = {
	className?: string;
	defaultSelected?: DropdownOption;
	onSelect?: (selectedOption: DropdownOption, types: any) => void;
};

type FilterTransactionsToggleProps = {
	isOpen: boolean;
	selectedOption?: DropdownOption;
};

const FilterTransactionsToggle = ({ selectedOption, isOpen }: FilterTransactionsToggleProps) => {
	const iconColorClass = isOpen
		? "bg-theme-primary-600 text-theme-primary-contrast"
		: "bg-theme-primary-100 text-theme-primary-600";

	return (
		<div className="flex items-center space-x-2 cursor-pointer" data-testid="FilterTransactionsToggle">
			<div className="font-semibold">
				<span className="text-theme-neutral-500">Type: </span>
				<span className="text-theme-neutral-600">{selectedOption?.label}</span>
			</div>
			<Icon
				className={`${iconColorClass} p-1 rounded-xl`}
				name={isOpen ? "ChevronUp" : "ChevronDown"}
				width={9}
				height={9}
			/>
		</div>
	);
};

export const FilterTransactions = memo(({ className, onSelect, defaultSelected }: FilterTransactionsProps) => {
	const { t } = useTranslation();
	const { types, getLabel, getQueryParamsByType } = useTransactionTypes();

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
		{
			key: "magistrate",
			title: t("TRANSACTION.MAGISTRATE"),
			hasDivider: true,
			options: types.magistrate.map((type) => ({ label: getLabel(type), value: type })),
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
				dropdownClass="max-h-128 overflow-y-auto"
				options={allOptions}
				toggleContent={(isOpen: boolean) => (
					<FilterTransactionsToggle isOpen={isOpen} selectedOption={selectedOption} />
				)}
				onSelect={handleSelect}
			/>
		</div>
	);
});
