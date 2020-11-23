import { useCombobox } from "downshift";
import React, { useEffect, useMemo, useState } from "react";

import { RegistrationTypeIcon } from "./RegistrationTypeIcon";
import { SelectRegistrationTypeInput } from "./SelectRegistrationTypeInput";

type Option = {
	label: string;
	value: string;
};

type SelectRegistrationTypeProps = {
	selected?: Option;
	options: Option[];
	placeholder?: string;
	name?: string;
	value?: string;
	id?: string;
	disabled?: boolean;
	onSelect?: (type?: string | null) => void;
};

const itemToString = (item: Option | null) => item?.label || "";

export const SelectRegistrationType = ({
	options,
	placeholder,
	onSelect,
	name,
	id,
	disabled,
	selected,
}: SelectRegistrationTypeProps) => {
	const [items, setItems] = useState([...options]);

	const isMatch = (inputValue: string, option: Option) =>
		inputValue && option.label.toLowerCase().startsWith(inputValue.toLowerCase());

	const {
		isOpen,
		closeMenu,
		openMenu,
		getComboboxProps,
		getLabelProps,
		getInputProps,
		getItemProps,
		getMenuProps,
		selectItem,
		selectedItem,
		inputValue,
		reset,
	} = useCombobox<Option | null>({
		id,
		items,
		itemToString,
		onSelectedItemChange: ({ selectedItem }) => onSelect?.(selectedItem?.value),
		onInputValueChange: ({ inputValue, selectedItem }) => {
			setItems(inputValue ? options.filter((option: Option) => isMatch(inputValue, option)) : options);

			// Clear selection when user is changing input,
			// and input does not match previously selected item
			if (selectedItem && selectedItem.label !== inputValue) {
				reset();
			}
		},
	});

	useEffect(() => {
		selectItem(selected || null);
	}, [selectItem, selected]);

	const inputTypeAhead = useMemo(() => {
		if (inputValue && items.length) {
			return [inputValue, items[0].label.slice(inputValue.length)].join("");
		}
	}, [items, inputValue]);

	return (
		<div>
			<div data-testid="SelectRegistrationType" {...getComboboxProps()}>
				<label {...getLabelProps()} />
				<SelectRegistrationTypeInput
					suggestion={inputTypeAhead}
					disabled={disabled}
					{...getInputProps({
						name,
						placeholder,
						onFocus: openMenu,
						onBlur: () => {
							if (inputValue && items.length > 0) selectItem(items[0]);
							else reset();
						},
						onKeyDown: (event: any) => {
							if (event.key === "Tab" || event.key === "Enter") {
								// Select first match
								if (inputValue && items.length > 0) {
									selectItem(items[0]);
									if (event.key === "Enter") {
										closeMenu();
									}
								}
								event.preventDefault();
								return;
							}
						},
					})}
				/>
			</div>
			<ul {...getMenuProps()} className={isOpen && items.length > 0 ? "grid grid-cols-6 gap-6 mt-6" : "hidden"}>
				{isOpen &&
					items.map((item: Option, index: number) => (
						<li
							data-testid="SelectRegistrationType__RegistrationTypeIcon--container"
							key={index}
							className="inline-block cursor-pointer"
							{...getItemProps({
								item,
								index,
								disabled,
							})}
						>
							<RegistrationTypeIcon iconName="Product" size="xl" iconSize={26} noShadow />
						</li>
					))}
			</ul>
		</div>
	);
};

SelectRegistrationType.defaultProps = {
	options: [],
	placeholder: "Choose the type of registration",
	disabled: false,
};
