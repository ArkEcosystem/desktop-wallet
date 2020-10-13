import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd } from "app/components/Input";
import { SelectDropdownInput } from "app/components/SelectDropdown/SelectDropdownInput";
import { useCombobox } from "downshift";
import React, { useEffect, useMemo, useState } from "react";

import { SelectOptionsList } from "./styles";

type Option = {
	label: string;
	value: string | number;
};

type SelectProps = {
	options: Option[];
	defaultValue?: string;
	isInvalid?: boolean;
	disabled?: boolean;
	onChange?: (selected: Option) => void;
} & React.InputHTMLAttributes<any>;

type SelectDropdownProps = {
	options: Option[];
	defaultSelectedItem?: Option;
	placeholder?: string;
	isInvalid?: boolean;
	disabled?: boolean;
	onSelectedItemChange: any;
} & React.InputHTMLAttributes<any>;

export const itemToString = (item: Option | null) => item?.label || "";

const SelectDropdown = ({
	options,
	defaultSelectedItem,
	placeholder,
	disabled,
	onSelectedItemChange,
}: SelectDropdownProps) => {
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
		inputValue,
		highlightedIndex,
		reset,
	} = useCombobox<Option | null>({
		items,
		itemToString,
		onSelectedItemChange,
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
		selectItem(defaultSelectedItem || null);
	}, [selectItem, defaultSelectedItem]);

	const inputTypeAhead = useMemo(() => {
		if (inputValue && items.length) {
			return [inputValue, items[0].label.slice(inputValue.length)].join("");
		}
	}, [items, inputValue]);

	return (
		<div className="relative w-full cursor-pointer">
			<div {...getComboboxProps()}>
				<label {...getLabelProps()} />
				<SelectDropdownInput
					suggestion={inputTypeAhead}
					disabled={disabled}
					{...getInputProps({
						placeholder,
						onFocus: openMenu,
						onBlur: () => {
							if (inputValue && items.length > 0) {
								selectItem(items[0]);
								closeMenu();
							} else {
								reset();
							}
						},
						onKeyDown: (event) => {
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
				<SelectOptionsList {...getMenuProps({ className: isOpen ? "is-open" : "" })}>
					{isOpen &&
						options.map((item: Option, index: number) => (
							<li
								key={`${item.value}${index}`}
								data-testid={`select-list__toggle-option-${index}`}
								{...getItemProps({
									index,
									item,
									className: `select-list-option ${
										item.label === inputValue || (!inputValue && highlightedIndex === index)
											? "is-highlighted"
											: ""
									}`,
									onMouseDown: () => {
										selectItem(item);
										closeMenu();
									},
								})}
							>
								<div className="select-list-option__label">{item.label}</div>
							</li>
						))}
				</SelectOptionsList>
			</div>
			<InputAddonEnd className="w-10 pointer-events-none text-theme-neutral">
				<Icon name="CaretDown" className={isOpen ? "transform rotate-180" : ""} width={7} height={5} />
			</InputAddonEnd>
		</div>
	);
};

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
	({ options, defaultValue, placeholder, isInvalid, disabled, onChange }: SelectProps, ref) => {
		const defaultSelectedItem = options.find((option: Option) => option.value === defaultValue);
		const [selected, setSelected] = useState(defaultSelectedItem);

		const fieldContext = useFormField();
		const isInvalidField = fieldContext?.isInvalid || isInvalid;

		return (
			<div className="relative w-full">
				<Input
					data-testid="select-list__input"
					type="text"
					ref={ref}
					value={selected?.value || ""}
					className="sr-only"
					isInvalid={isInvalidField}
					readOnly
				/>
				<SelectDropdown
					disabled={disabled}
					options={options}
					defaultSelectedItem={defaultSelectedItem}
					placeholder={placeholder}
					isInvalid={isInvalidField}
					onSelectedItemChange={({ selectedItem }: { selectedItem: Option }) => {
						setSelected(selectedItem);
						onChange?.(selectedItem);
					}}
				/>
			</div>
		);
	},
);

Select.displayName = "Select";
Select.defaultProps = {
	options: [],
	defaultValue: "",
	placeholder: "Select option",
	disabled: false,
};
