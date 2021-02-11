import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd } from "app/components/Input";
import { SelectDropdownInput } from "app/components/SelectDropdown/SelectDropdownInput";
import { useCombobox } from "downshift";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SelectOptionsList } from "./styles";

type Option = {
	label: string;
	value: string | number;
};

type SelectProps = {
	options: Option[];
	defaultValue?: string;
	inputClassName?: string;
	isInvalid?: boolean;
	showCaret?: boolean;
	disabled?: boolean;
	allowFreeInput?: boolean;
	errorClassName?: string;
	onChange?: (selected: Option) => void;
} & React.InputHTMLAttributes<any>;

type SelectDropdownProps = {
	options: Option[];
	defaultSelectedItem?: Option;
	placeholder?: string;
	inputClassName?: string;
	showCaret?: boolean;
	isInvalid?: boolean;
	disabled?: boolean;
	allowFreeInput?: boolean;
	errorClassName?: string;
	onSelectedItemChange: any;
} & React.InputHTMLAttributes<any>;

const itemToString = (item: Option | null) => item?.label || "";

const SelectDropdown = ({
	options,
	defaultSelectedItem,
	placeholder,
	disabled,
	onSelectedItemChange,
	isInvalid,
	inputClassName,
	allowFreeInput = false,
	showCaret = true,
	errorClassName = "mr-8",
}: SelectDropdownProps) => {
	const { t } = useTranslation();

	const [items, setItems] = useState([...options]);
	const [isTyping, setIsTyping] = useState(false);

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
		onInputValueChange: ({ inputValue, selectedItem, type }) => {
			setItems(inputValue ? options.filter((option: Option) => isMatch(inputValue, option)) : options);

			if (type === "__input_change__") {
				setIsTyping(true);
			} else {
				setIsTyping(false);
			}

			if (!inputValue) {
				openMenu();
			}

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

	const dropdownItems =
		allowFreeInput && inputValue !== "" ? [...items, { label: inputValue, value: inputValue }] : items;

	const inputTypeAhead = useMemo(() => {
		if (inputValue && dropdownItems.length) {
			return [inputValue, dropdownItems[0].label.slice(inputValue.length)].join("");
		}
	}, [dropdownItems, inputValue]);

	const data = isTyping ? dropdownItems : options;

	return (
		<div className="relative w-full">
			<div {...getComboboxProps()}>
				<label {...getLabelProps()} />
				<SelectDropdownInput
					suggestion={inputTypeAhead}
					disabled={disabled}
					{...getInputProps({
						placeholder,
						className: `cursor-default ${isInvalid && " pr-16"} ${inputClassName}`,
						onFocus: openMenu,
						onBlur: () => {
							if (inputValue && dropdownItems.length > 0) {
								selectItem(dropdownItems[0]);
								closeMenu();
							} else {
								reset();
							}
						},
						onKeyDown: (event) => {
							if (event.key === "Tab" || event.key === "Enter") {
								// Select first match
								if (inputValue && dropdownItems.length > 0) {
									selectItem(dropdownItems[0]);

									if (event.key === "Enter") {
										closeMenu();
									}
								}
								event.preventDefault();
								return;
							}
						},
					})}
					errorClassName={errorClassName}
				/>
				<SelectOptionsList {...getMenuProps({ className: isOpen ? "is-open" : "" })}>
					{isOpen &&
						(data.length > 0 ? (
							data.map((item: Option, index: number) => (
								<li
									key={`${item.value}${index}`}
									data-testid={`select-list__toggle-option-${index}`}
									{...getItemProps({
										index,
										item,
										className: `select-list-option cursor-default ${
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
							))
						) : (
							<li className="select-list-option is-empty" data-testid="select-list__empty-option">
								{t("COMMON.NO_OPTIONS")}
							</li>
						))}
				</SelectOptionsList>
			</div>

			{showCaret && (
				<InputAddonEnd className="w-10 pointer-events-none text-theme-secondary-500">
					<Icon
						name="CaretDown"
						className={`transition-transform ${isOpen ? "transform rotate-180" : ""}`}
						width={7}
						height={5}
					/>
				</InputAddonEnd>
			)}
		</div>
	);
};

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
	(
		{
			options,
			defaultValue,
			placeholder,
			inputClassName,
			allowFreeInput,
			showCaret,
			isInvalid,
			disabled,
			onChange,
			errorClassName,
		}: SelectProps,
		ref,
	) => {
		const defaultSelectedItem = options.find((option: Option) => option.value === defaultValue);
		const [selected, setSelected] = useState(defaultSelectedItem);

		const fieldContext = useFormField();
		const isInvalidField = fieldContext?.isInvalid || isInvalid;

		return (
			<div className="relative w-full">
				<Input
					data-testid="select-list__input"
					ref={ref}
					value={selected?.value || ""}
					className="sr-only"
					isInvalid={isInvalidField}
					readOnly
				/>
				<SelectDropdown
					errorClassName={errorClassName}
					allowFreeInput={allowFreeInput}
					showCaret={showCaret}
					inputClassName={inputClassName}
					options={options}
					defaultSelectedItem={defaultSelectedItem}
					placeholder={placeholder}
					disabled={disabled}
					isInvalid={isInvalidField}
					onSelectedItemChange={({ selectedItem }: { selectedItem: Option }) => {
						setSelected(selectedItem);

						if (selectedItem) {
							onChange?.(selectedItem);
						}
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
