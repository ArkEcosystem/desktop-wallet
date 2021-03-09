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
	id,
}: SelectDropdownProps) => {
	const { t } = useTranslation();

	const [isTyping, setIsTyping] = useState(false);

	const isMatch = (inputValue: string, option: Option) =>
		inputValue && option.label.toLowerCase().startsWith(inputValue.toLowerCase());

	const handleInputChange = ({ selectedItem }: { selectedItem: Option }) => {
		if (!allowFreeInput) {
			return;
		}
		onSelectedItemChange({ selected: selectedItem });
	};

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
		id,
		items: options,
		itemToString,
		onSelectedItemChange: ({ selectedItem }) => {
			if (allowFreeInput) {
				return;
			}

			onSelectedItemChange?.({ selected: selectedItem });
		},
		onInputValueChange: ({ inputValue, selectedItem, type }) => {
			if (type === "__input_change__") {
				setIsTyping(true);
			} else {
				setIsTyping(false);
			}

			if (allowFreeInput) {
				const selected = { label: inputValue as string, value: inputValue as string };

				selectItem(selected);
				onSelectedItemChange({ selected });

				const matchedOptions = inputValue
					? options.filter((option: Option) => isMatch(inputValue, option))
					: options;

				if (matchedOptions.length === 0) {
					closeMenu();
				}

				return;
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
	}, [defaultSelectedItem, selectItem]);

	const inputTypeAhead = useMemo(() => {
		const firstMatch = options.find((option) => isMatch(inputValue, option));
		if (inputValue && firstMatch) {
			return [inputValue, firstMatch.label.slice(inputValue.length)].join("");
		}
	}, [inputValue, options]);

	const data = isTyping && inputValue ? options.filter((option: Option) => isMatch(inputValue, option)) : options;

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
						onBlur: (event) => {
							if (allowFreeInput) {
								const selectedItem = { label: event.target.value, value: event.target.value };
								handleInputChange({ selectedItem });
								return;
							}

							const firstMatch = options.find((option) => isMatch(inputValue, option));

							if (inputValue && firstMatch) {
								selectItem(firstMatch);
								handleInputChange({ selectedItem: firstMatch });

								closeMenu();
							} else {
								reset();
							}
						},
						onKeyDown: (event) => {
							if (event.key === "Tab" || event.key === "Enter") {
								// Select first match
								const firstMatch = options.find((option) => isMatch(inputValue, option));

								if (inputValue && firstMatch) {
									selectItem(firstMatch);
									handleInputChange({ selectedItem: firstMatch });

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
											handleInputChange({ selectedItem: item });
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
			id,
		}: SelectProps,
		ref,
	) => {
		const defaultSelectedItem = useMemo(
			() =>
				allowFreeInput
					? ({ value: defaultValue, label: defaultValue } as Option)
					: options.find((option: Option) => option.value === defaultValue),
			[defaultValue, allowFreeInput, options],
		);

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
					id={id}
					errorClassName={errorClassName}
					allowFreeInput={allowFreeInput}
					showCaret={showCaret}
					inputClassName={inputClassName}
					options={options}
					defaultSelectedItem={defaultSelectedItem}
					placeholder={placeholder}
					disabled={disabled}
					isInvalid={isInvalidField}
					onSelectedItemChange={({ selected }: { selected: Option }) => {
						setSelected(selected);

						if (selected) {
							onChange?.(selected);
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
