import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import cn from "classnames";
import { useCombobox } from "downshift";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SelectOptionsList } from "./styles";

interface Option {
	label: string;
	value: string | number;
	isSelected?: boolean;
}

type SelectProperties = {
	addons?: any;
	options: Option[];
	defaultValue?: string;
	innerClassName?: string;
	isInvalid?: boolean;
	showCaret?: boolean;
	disabled?: boolean;
	allowFreeInput?: boolean;
	onChange?: (selected: Option) => void;
	renderLabel?: (option: Option) => JSX.Element;
} & React.InputHTMLAttributes<any>;

type SelectDropdownProperties = {
	addons?: any;
	options: Option[];
	defaultSelectedItem?: Option;
	placeholder?: string;
	innerClassName?: string;
	showCaret?: boolean;
	isInvalid?: boolean;
	disabled?: boolean;
	allowFreeInput?: boolean;
	onSelectedItemChange: any;
	renderLabel?: (option: Option) => JSX.Element;
} & React.InputHTMLAttributes<any>;

const itemToString = (item: Option | null) => item?.label || "";

const SelectDropdown = ({
	addons,
	options,
	defaultSelectedItem,
	placeholder,
	disabled,
	onSelectedItemChange,
	isInvalid,
	className,
	innerClassName,
	allowFreeInput = false,
	showCaret = true,
	renderLabel,
	id,
}: SelectDropdownProperties) => {
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
		toggleMenu,
		selectedItem,
	} = useCombobox<Option | null>({
		id,
		itemToString,
		items: options,
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

			// Clear selection when user is changing input,
			// and input does not match previously selected item
			if (selectedItem && selectedItem.label !== inputValue) {
				reset();
			}
		},
		onSelectedItemChange: ({ selectedItem }) => {
			if (allowFreeInput) {
				return;
			}

			onSelectedItemChange?.({ selected: selectedItem });
		},
	});

	useEffect(() => {
		selectItem(defaultSelectedItem || null);
	}, [defaultSelectedItem, selectItem]);

	const suggestion = useMemo(() => {
		const firstMatch = options.find((option) => isMatch(inputValue, option));
		if (inputValue && firstMatch) {
			return [inputValue, firstMatch.label.slice(inputValue.length)].join("");
		}
	}, [inputValue, options]);

	const data = isTyping && inputValue ? options.filter((option: Option) => isMatch(inputValue, option)) : options;

	if (showCaret) {
		addons = {
			...addons,
			end: (
				<div
					data-testid="SelectDropdown__caret"
					className="flex justify-center items-center py-2 px-1"
					onClick={toggleMenu}
				>
					<Icon
						name="CaretDown"
						className={cn(
							"transition-transform",
							isInvalid ? "text-theme-danger-500" : "text-theme-secondary-500",
							{
								"transform rotate-180": isOpen,
							},
						)}
						width={7}
						height={5}
					/>
				</div>
			),
		};
	}

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
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
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Tab" || event.key === "Enter") {
			// check if item already was selected
			if (selectedItem?.label === inputValue) {
				return;
			}

			// Select first suggestion
			const firstMatch = options.find((option) => isMatch(inputValue, option));

			if (inputValue && firstMatch) {
				selectItem(firstMatch);
				handleInputChange({ selectedItem: firstMatch });

				if (event.key === "Enter") {
					closeMenu();
				}
			}
		}
	};

	return (
		<div className="relative w-full">
			<div {...getComboboxProps()}>
				<label {...getLabelProps()} />
				<Input
					data-testid="SelectDropdown__input"
					suggestion={suggestion}
					disabled={disabled}
					isInvalid={isInvalid}
					addons={addons}
					innerClassName={cn({ "cursor-default": !inputValue }, innerClassName)}
					{...getInputProps({
						className,
						onBlur: handleBlur,
						onFocus: openMenu,
						onKeyDown: handleKeyDown,
						placeholder,
					})}
				/>
				<SelectOptionsList {...getMenuProps({ className: isOpen ? "is-open" : "" })}>
					{isOpen &&
						(data.length > 0 ? (
							data.map((item: Option, index: number) => (
								<li
									key={`${item.value}${index}`}
									data-testid={`SelectDropdown__option--${index}`}
									{...getItemProps({
										className: cn(
											"select-list-option",
											{ "is-highlighted": highlightedIndex === index },
											{ "is-selected": item.label === inputValue },
										),
										index,
										item,
										onMouseDown: () => {
											selectItem(item);
											handleInputChange({ selectedItem: item });
											closeMenu();
										},
									})}
								>
									<div className="select-list-option__label">
										{renderLabel
											? renderLabel({ ...item, isSelected: item.label === inputValue })
											: item.label}
									</div>
								</li>
							))
						) : (
							<li className="select-list-option is-empty">{t("COMMON.NO_OPTIONS")}</li>
						))}
				</SelectOptionsList>
			</div>
		</div>
	);
};

export const Select = React.forwardRef<HTMLInputElement, SelectProperties>(
	(
		{
			addons,
			options,
			defaultValue,
			placeholder,
			className,
			innerClassName,
			allowFreeInput,
			showCaret,
			isInvalid,
			disabled,
			onChange,
			renderLabel,
			id,
		}: SelectProperties,
		reference,
	) => {
		const defaultSelectedItem = useMemo(
			() =>
				allowFreeInput
					? ({ label: defaultValue, value: defaultValue } as Option)
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
					ref={reference}
					value={selected?.value || ""}
					className="sr-only"
					isInvalid={isInvalidField}
					readOnly
					tabIndex={-1}
				/>
				<SelectDropdown
					id={id}
					allowFreeInput={allowFreeInput}
					showCaret={showCaret}
					className={className}
					innerClassName={innerClassName}
					options={options}
					defaultSelectedItem={defaultSelectedItem}
					placeholder={placeholder}
					disabled={disabled}
					isInvalid={isInvalidField}
					addons={addons}
					onSelectedItemChange={({ selected }: { selected: Option }) => {
						setSelected(selected);
						onChange?.(selected);
					}}
					renderLabel={renderLabel}
				/>
			</div>
		);
	},
);

Select.displayName = "Select";
Select.defaultProps = {
	defaultValue: "",
	disabled: false,
	options: [],
	placeholder: "Select option",
};
