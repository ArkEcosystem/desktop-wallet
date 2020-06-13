import React, { useState, useRef, useEffect } from "react";
import { styled } from "twin.macro";

import { Icon } from "app/components/Icon";
import { clickOutsideHandler } from "./hooks";
import { defaultStyles, defaultClasses } from "./Dropdown.styles";

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
				className="text-theme-neutral-800 hover:bg-theme-neutral-200 hover:text-theme-primary-600 block px-8 py-4 text-sm font-semibold cursor-pointer"
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
				<button data-testid="dropdown__toggle" className="focus:outline-none float-right outline-none">
					<Icon name={toggleIcon} width={20} height={20} />
				</button>
			</div>
		);
	}

	return (
		<div ref={ref} className="relative">
			<button onClick={toggle} className="focus:outline-none float-right outline-none">
				<Icon name={toggleIcon} width={20} height={20} />
			</button>

			<Wrapper>
				<div data-testid="dropdown__content">{renderOptions(options, select)}</div>
				<div>{children}</div>
			</Wrapper>
		</div>
	);
};

Dropdown.defaultProps = {
	options: [],
	toggleIcon: "Settings",
};
