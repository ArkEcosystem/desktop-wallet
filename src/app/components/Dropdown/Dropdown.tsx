import { Icon } from "app/components/Icon";
import { clickOutsideHandler } from "app/hooks/click-outside";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "twin.macro";
import { Size } from "types";

import { defaultClasses } from "./Dropdown.styles";

export type DropdownOption = {
	label: string;
	value: string | number;
};

type Props = {
	as?: React.ElementType;
	children?: React.ReactNode;
	onSelect?: any;
	options?: any;
	position?: string;
	dropdownClass?: string;
	toggleIcon: string;
	toggleSize?: Size;
	toggleContent?: any;
};

export const Wrapper = styled.div`
	${defaultClasses}
`;

/*
 * Dropdown options list
 */
const renderOptions = (options: DropdownOption[], onSelect: any) => (
	<ul data-testid="dropdown__options">
		{options.map((option: DropdownOption, key: number) => (
			<li
				className="block px-8 py-4 text-base font-semibold text-left cursor-pointer text-theme-neutral-800 hover:bg-theme-neutral-200 hover:text-theme-primary"
				key={key}
				data-testid={`dropdown__option--${key}`}
				onClick={(e: any) => {
					onSelect?.(option);
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				{option.label}
			</li>
		))}
	</ul>
);

const renderToggle = (isOpen: boolean, children: any, toggleIcon: string, toggleSize?: Size) => {
	// Default with toggleIcon
	const getSize = (size?: Size) => {
		switch (size) {
			case "sm":
				return 10;
			case "lg":
				return 30;
			default:
				return 20;
		}
	};

	if (!children) {
		const size = getSize(toggleSize);

		return (
			<div className="float-right outline-none cursor-pointer focus:outline-none">
				<Icon name={toggleIcon} width={size} height={size} />
			</div>
		);
	}

	// Call children as a function and provide isOpen state
	if (typeof children === "function") return children(isOpen);

	// Render children as provided
	return children;
};

export const Dropdown = ({
	children,
	dropdownClass,
	options,
	onSelect,
	position,
	toggleIcon,
	toggleSize,
	toggleContent,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = (e: any) => {
		setIsOpen(!isOpen);
		e.preventDefault();
		e.stopPropagation();
	};
	const hide = () => setIsOpen(false);

	const select = (option: DropdownOption) => {
		setIsOpen(false);
		if (typeof onSelect === "function") onSelect(option);
	};

	const ref = useRef(null);
	useEffect(() => clickOutsideHandler(ref, hide), [ref]);

	if (!isOpen) {
		return (
			<div onClick={toggle} ref={ref} className="relative" data-testid="dropdown__toggle">
				{renderToggle(isOpen, toggleContent, toggleIcon, toggleSize)}
			</div>
		);
	}

	return (
		<div ref={ref} className="relative">
			<span onClick={toggle}>{renderToggle(isOpen, toggleContent, toggleIcon, toggleSize)}</span>

			<Wrapper className={`${position}-0 ${dropdownClass}`}>
				<div data-testid="dropdown__content">{renderOptions(options, select)}</div>
				<div>{children}</div>
			</Wrapper>
		</div>
	);
};

Dropdown.defaultProps = {
	options: [],
	toggleIcon: "Settings",
	position: "right",
};
