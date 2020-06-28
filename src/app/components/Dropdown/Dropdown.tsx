import { Icon } from "app/components/Icon";
import { clickOutsideHandler } from "app/hooks/click-outside";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "twin.macro";

import { defaultClasses, defaultStyles } from "./Dropdown.styles";

export type Option = {
	label: string;
	value: string | number;
};

type Props = {
	as?: React.ElementType;
	children?: React.ReactNode;
	onSelect?: any;
	options?: any;
	position?: string;
	toggleIcon: string;
	toggleSize: "small" | "large" | "default";
	toggleContent?: any;
};

export const Wrapper = styled.div`
	${defaultStyles}
	${defaultClasses}
`;

/*
 * Dropdown options list
 */
const renderOptions = (options: any[], onSelect: any) => (
	<ul data-testid="dropdown__options">
		{options.map((option: Option, key: number) => (
			<li
				className="block px-8 py-4 text-sm font-semibold cursor-pointer text-theme-neutral-800 hover:bg-theme-neutral-200 hover:text-theme-primary-600"
				key={key}
				data-testid={`dropdown__option--${key}`}
				onClick={(e: any) => {
					onSelect(option);
					e.stopPropagation();
				}}
			>
				{option.label}
			</li>
		))}
	</ul>
);

const renderToggle = (
	children: any,
	toggleIcon: string,
	toggleSize: "small" | "large" | "default",
	isOpen: boolean,
) => {
	// Default with toggleIcon
	const size = {
		small: 10,
		default: 20,
		large: 30,
	};

	if (!children) {
		return (
			<div className="float-right outline-none focus:outline-none cursor-pointer">
				<Icon name={toggleIcon} width={size[toggleSize]} height={size[toggleSize]} />
			</div>
		);
	}

	// Call children as a function and provide isOpen state
	if (typeof children === "function") return children(isOpen);

	// Render children as provided
	return children;
};

export const Dropdown = ({ children, options, onSelect, position, toggleIcon, toggleSize, toggleContent }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = (e: any) => {
		setIsOpen(!isOpen);
		e.stopPropagation();
	};
	const hide = () => setIsOpen(false);

	const select = (option: Option) => {
		setIsOpen(false);
		if (typeof onSelect === "function") onSelect(option);
	};

	const ref = useRef(null);
	useEffect(() => clickOutsideHandler(ref, hide), [ref]);

	if (!isOpen) {
		return (
			<div onClick={toggle} ref={ref} className="relative" data-testid="dropdown__toggle">
				{renderToggle(toggleContent, toggleIcon, toggleSize, isOpen)}
			</div>
		);
	}

	return (
		<div ref={ref} className="relative">
			<span onClick={toggle}>{renderToggle(toggleContent, toggleIcon, toggleSize, isOpen)}</span>

			<Wrapper className={`${position}-0`}>
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
	toggleSize: "default",
};
