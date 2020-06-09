import React, { useState, useRef, useEffect } from "react";
import { clickOutsideHandler } from "./hooks";
import { Icon } from "app/components/Icon";

export type Option = {
	label: string;
	value: string | number;
};

type Props = {
	as?: React.ElementType;
	children?: React.ReactNode;
	onSelect?: any;
	options?: any;
	toggleIcon: string;
};

/*
 * Dropdown options list
 */
const renderOptions = (options: any[], onSelect: any) => (
	<ul data-testid="dropdown__options">
		{options.map((option: Option, key: number) => (
			<li
				className="block cursor-pointer px-8 py-4 text-sm font-semibold text-theme-neutral-800 hover:bg-theme-neutral-200 hover:text-theme-primary-600"
				key={key}
				data-testid={`dropdown__option--${key}`}
				onClick={() => onSelect(option)}
			>
				{option.label}
			</li>
		))}
	</ul>
);

export const Dropdown = ({ children, options, onSelect, toggleIcon }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);
	const hide = () => setIsOpen(false);

	const select = (option: Option) => {
		setIsOpen(false);
		if (typeof onSelect === "function") onSelect(option);
	};

	const ref = useRef(null);
	useEffect(() => clickOutsideHandler(ref, hide), [ref]);

	if (!isOpen) {
		return (
			<div onClick={toggle} ref={ref} className="relative">
				<button data-testid="dropdown__toggle" className="outline-none focus:outline-none float-right">
					<Icon name={toggleIcon} width={20} height={20} />
				</button>
			</div>
		);
	}

	return (
		<div ref={ref} className="relative">
			<button onClick={toggle} className="outline-none focus:outline-none float-right">
				<Icon name={toggleIcon} width={20} height={20} />
			</button>

			<div className="mt-8 py-3 w-48 absolute right-0 z-10 bg-theme-background rounded-lg shadow-xl border-theme-neutral-100 border-1">
				<div data-testid="dropdown__content">{renderOptions(options, select)}</div>
				<div>{children}</div>
			</div>
		</div>
	);
};

Dropdown.defaultProps = {
	options: [],
	toggleIcon: "settings",
};
