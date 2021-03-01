import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { clickOutsideHandler } from "app/hooks";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "twin.macro";
import { Position, Size } from "types";

import { defaultClasses, getStyles } from "./Dropdown.styles";

export type DropdownOption = {
	icon?: string;
	iconPosition?: "start" | "end";
	iconWidth?: number;
	iconHeight?: number;
	label: string;
	secondaryLabel?: string;
	value: string | number;
};

export type DropdownOptionGroup = {
	key: string;
	title?: string;
	hasDivider?: boolean;
	options: DropdownOption[];
	onSelect?: any;
};

type DropdownProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	onSelect?: any;
	options?: any;
	position?: Position;
	dropdownClass?: string;
	toggleIcon: string;
	toggleSize?: Size;
	toggleContent?: any;
};

export const Wrapper = styled.div<{ position?: string; variant: string }>(getStyles);

const isOptionGroup = (options: DropdownOption | DropdownOptionGroup) =>
	(options as DropdownOptionGroup).key !== undefined;

const renderOptionGroup = ({ key, hasDivider, title, options }: DropdownOptionGroup, onSelect: any) =>
	options.length ? (
		<div key={key} className="mt-4 first:mt-0">
			{hasDivider && (
				<div className="mx-8 -my-2">
					<Divider className="border-theme-secondary-300 dark:border-theme-secondary-600" />
				</div>
			)}
			<ul>
				{title && (
					<li className="block px-8 text-xs font-bold text-left uppercase whitespace-nowrap text-theme-secondary-500 dark:text-theme-secondary-600">
						{title}
					</li>
				)}
				{renderOptions(options, onSelect, key)}
			</ul>
		</div>
	) : null;

const renderOptions = (options: DropdownOption[] | DropdownOptionGroup[], onSelect: any, key?: string) => {
	if (options.length && isOptionGroup(options[0])) {
		return (
			<div className="pt-5 pb-1">
				{(options as DropdownOptionGroup[]).map((optionGroup: DropdownOptionGroup) =>
					renderOptionGroup(optionGroup, onSelect),
				)}
			</div>
		);
	}

	const renderIcon = ({ icon, iconWidth, iconHeight }: DropdownOption) => (
		<Icon
			name={icon!}
			className="dark:text-theme-secondary-600 dark:group-hover:text-theme-secondary-200"
			width={iconWidth}
			height={iconHeight}
		/>
	);

	return (
		<ul data-testid="dropdown__options">
			{(options as DropdownOption[]).map((option: DropdownOption, index: number) => (
				<li
					className="group flex items-center space-x-2 py-4 px-8 text-base font-semibold text-left whitespace-nowrap cursor-pointer text-theme-secondary-800 dark:text-theme-secondary-200 hover:bg-theme-secondary-200 dark:hover:bg-theme-primary-600 hover:text-theme-primary-600 dark:hover:text-theme-secondary-200"
					key={index}
					data-testid={`dropdown__option--${key ? `${key}-` : ""}${index}`}
					onClick={(e: any) => {
						onSelect?.(option);
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					{option?.icon && option?.iconPosition === "start" && renderIcon(option)}
					<span>
						{option.label}
						{option.secondaryLabel && (
							<span className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-600">
								{option.secondaryLabel}
							</span>
						)}
					</span>
					{option?.icon && option?.iconPosition !== "start" && renderIcon(option)}
				</li>
			))}
		</ul>
	);
};

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
			<div className="cursor-pointer outline-none focus:outline-none">
				<Icon name={toggleIcon} width={size} height={size} />
			</div>
		);
	}

	// Call children as a function and provide isOpen state
	if (typeof children === "function") {
		return children(isOpen);
	}

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
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = (e: any) => {
		setIsOpen(!isOpen);
		e.preventDefault();
		e.stopPropagation();
	};

	const hide = () => setIsOpen(false);

	const select = (option: DropdownOption) => {
		setIsOpen(false);
		if (typeof onSelect === "function") {
			onSelect(option);
		}
	};

	const ref = useRef(null);

	useEffect(() => {
		const handleResize = () => {
			const numberFromPixels = (value: string): number => (value ? parseInt(value.replace("px", "")) : 0);

			const OFFSET = 30;

			const parent = (ref.current as unknown) as HTMLElement;

			const toggleElement: HTMLElement | null = parent.querySelector('[data-testid="dropdown__toggle"]');
			const dropdownElement: HTMLElement | null = parent.querySelector('[data-testid="dropdown__content"]');

			if (toggleElement && dropdownElement) {
				const setStyles = (styles: Record<string, any>) => {
					Object.assign(dropdownElement.style, styles);
				};

				const toggleHeight: number = toggleElement.parentElement!.offsetHeight;

				const spaceBefore: number =
					toggleElement.getBoundingClientRect().top + document.documentElement.scrollTop;
				const spaceAfter: number = document.body.clientHeight - (spaceBefore + toggleHeight);

				setStyles({ height: null, marginTop: null });

				const styles = getComputedStyle(dropdownElement);

				if (
					spaceAfter < dropdownElement.offsetHeight + numberFromPixels(styles.marginTop) + OFFSET &&
					spaceBefore > dropdownElement.offsetHeight + numberFromPixels(styles.marginTop) + OFFSET
				) {
					setStyles({
						opacity: 100,
						marginTop: `-${
							dropdownElement.offsetHeight + toggleHeight + numberFromPixels(styles.marginTop)
						}px`,
					});
				} else {
					const newHeight = spaceAfter - numberFromPixels(styles.marginTop) - OFFSET;

					const newStyles =
						newHeight >=
						dropdownElement.firstElementChild!.clientHeight +
							numberFromPixels(styles.paddingTop) +
							numberFromPixels(styles.paddingBottom)
							? {
									height: null,
									overflowY: null,
							  }
							: {
									height: `${newHeight}px`,
									marginTop: null,
									overflowY: "scroll",
							  };

					setStyles({ opacity: 100, ...newStyles });
				}
			}
		};

		if (isOpen) {
			window.addEventListener("resize", handleResize);
		}

		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, [isOpen]);

	useEffect(() => {
		clickOutsideHandler(ref, hide);
	}, [ref]);

	return (
		<div ref={ref} className="relative">
			<span data-testid="dropdown__toggle" onClick={toggle}>
				{renderToggle(isOpen, toggleContent, toggleIcon, toggleSize)}
			</span>

			{isOpen && (
				<Wrapper
					data-testid="dropdown__content"
					position={position}
					variant={options ? "options" : "custom"}
					className={`opacity-0 ${defaultClasses} ${dropdownClass || ""}`}
				>
					{options?.length && renderOptions(options, select)}
					{children && <div>{children}</div>}
				</Wrapper>
			)}
		</div>
	);
};

Dropdown.defaultProps = {
	toggleIcon: "Settings",
	position: "right",
};
