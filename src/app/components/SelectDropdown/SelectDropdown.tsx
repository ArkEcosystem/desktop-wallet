import { useFormField } from "app/components/Form/useFormField";
import { Icon } from "app/components/Icon";
import { Input, InputAddonEnd } from "app/components/Input";
import { useSelect } from "downshift";
import React, { useState } from "react";

import { SelectOptionsList, SelectToggleButton } from "./styles";

type Option = {
	label: string;
	value: string | number;
};

type Props = {
	defaultValue?: string;
	isInvalid?: boolean;
	disabled?: any;
	options: Option[];
	onChange?: (selected: Option) => void;
} & React.InputHTMLAttributes<any>;

const SelectDropdown = ({
	placeholder,
	options,
	onSelectedItemChange,
	disabled,
	isInvalid,
	defaultSelectedItem,
}: any) => {
	const { isOpen, selectedItem, getToggleButtonProps, getMenuProps, highlightedIndex, getItemProps } = useSelect({
		items: options,
		onSelectedItemChange,
		defaultSelectedItem: defaultSelectedItem,
	});

	const isOpenClassName = isOpen ? "is-open" : "";
	const isSelectedClassName = selectedItem ? "is-selected" : "";
	const isInvalidClassName = isInvalid ? "is-invalid" : "";
	const toggleButtonClassName = `${isOpenClassName} ${isSelectedClassName} ${isInvalidClassName}`;

	return (
		<div className="relative w-full cursor-pointer">
			<div>
				<SelectToggleButton
					data-testid="select-list__toggle-button"
					{...getToggleButtonProps({
						type: "button",
						disabled,
						className: toggleButtonClassName,
					})}
				>
					{selectedItem?.label || placeholder}
				</SelectToggleButton>
				<SelectOptionsList {...getMenuProps({ className: isOpenClassName })}>
					{isOpen &&
						options.map((item: Option, index: number) => (
							<li
								key={`${item.value}${index}`}
								data-testid={`select-list__toggle-option-${index}`}
								{...getItemProps({
									item,
									index,
									className: `select-list-option ${
										highlightedIndex === index ? "is-highlighted" : ""
									}`,
								})}
							>
								<div className="select-list-option__label">{item.label}</div>
							</li>
						))}
				</SelectOptionsList>
			</div>
			<InputAddonEnd className="w-10 pointer-events-none text-theme-neutral-500">
				<Icon name={isOpen ? "ArrowUp" : "ArrowDown"} width={8} height={8} />
			</InputAddonEnd>
		</div>
	);
};

export const Select = React.forwardRef<HTMLInputElement, Props>(
	({ isInvalid, placeholder, onChange, defaultValue, options, disabled }: Props, ref) => {
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
					readOnly
					isInvalid={isInvalidField}
				/>
				<SelectDropdown
					disabled={disabled}
					options={options}
					defaultSelectedItem={defaultSelectedItem}
					placeholder={placeholder}
					isInvalid={isInvalidField}
					onSelectedItemChange={({ selectedItem }: any) => {
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
	defaultValue: "",
	options: [],
};
