import React from "react";
import tw, { styled } from "twin.macro";

import { TabContext, TabId, useTab } from "./useTab";

interface TabsProperties {
	children: React.ReactNode;
	activeId?: TabId;
	className?: string;
	onChange?: (id: TabId) => void;
}

export function Tabs({ children, activeId, className, onChange }: TabsProperties) {
	const context = useTab({ initialId: activeId });
	const { currentId, setCurrentId } = context;

	React.useEffect(() => {
		if (currentId) {
			onChange?.(currentId);
		}
	}, [currentId]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		setCurrentId(activeId);
	}, [setCurrentId, activeId]);

	return (
		<TabContext.Provider value={context}>
			<div className={className}>{children}</div>
		</TabContext.Provider>
	);
}

interface TabProperties {
	children: React.ReactNode;
	tabId: string | number;
	count?: number;
}

const TabButton = styled.button``;

export const Tab = React.forwardRef<HTMLButtonElement, TabProperties>((properties: TabProperties, reference) => {
	const context = React.useContext(TabContext);
	const isActive = context?.isIdActive(properties.tabId);

	return (
		<TabButton
			data-testid={`tabs__tab-button-${properties.tabId}`}
			role="tab"
			type="button"
			className="group"
			ref={reference}
			aria-selected={isActive}
			tabIndex={isActive ? 0 : -1}
			onKeyDown={(event: any) => {
				switch (event.key) {
				case "ArrowLeft": {
					let previousTab = event.target.previousElementSibling;

					while (previousTab && previousTab.getAttribute("role") !== "tab") {
						previousTab = previousTab.previousElementSibling;
					}

					if (!previousTab) {
						previousTab = event.target.parentElement.querySelector("[role=tab]:last-child");
					}

					previousTab.focus();
				
				break;
				}
				case "ArrowRight": {
					let nextTab = event.target.nextElementSibling;

					while (nextTab && nextTab.getAttribute("role") !== "tab") {
						nextTab = nextTab.nextElementSibling;
					}

					if (!nextTab) {
						nextTab = event.target.parentElement.querySelector("[role=tab]");
					}

					nextTab.focus();
				
				break;
				}
				case "Enter": 
				case " ": {
					context?.setCurrentId(properties.tabId);
				
				break;
				}
				// No default
				}
			}}
			onClick={() => context?.setCurrentId(properties.tabId)}
		>
			<div className="absolute inset-0 -mx-3 rounded group-focus-visible group-focus:ring-2 ring-theme-primary-400" />

			<span>{properties.children}</span>

			{properties.count !== undefined && (
				<span
					data-testid={`tabs__tab-button-${properties.tabId}-count`}
					className="py-0.5 px-1.5 ml-2 text-sm font-semibold rounded bg-theme-primary-100 dark:bg-theme-secondary-900"
				>
					{properties.count}
				</span>
			)}
		</TabButton>
	);
});

Tab.displayName = "Tab";

export const TabList = styled.div<{ noBackground?: boolean }>`
	${tw`inline-flex justify-start items-stretch`}

	${({ noBackground }) => {
		if (!noBackground) {
			return tw`rounded-xl bg-theme-secondary-100 dark:bg-theme-secondary-background px-2`;
		}
	}}

	& > ${TabButton} {
		${tw`relative mx-6 font-semibold border-t-2 border-b-2 border-transparent text-theme-secondary-text transition-colors ease-in-out duration-300 focus:(outline-none text-theme-text) hover:text-theme-text`}

		&[aria-selected="true"] {
			border-bottom-color: var(--theme-color-primary-600);
			${tw`text-theme-text`}
		}

		& + ${TabButton}:after {
			content: "";
			width: 1px;
			${tw`h-4 bg-theme-secondary-300 dark:bg-theme-secondary-800 absolute -left-6 top-1/2 transform -translate-y-1/2 block`};
		}
	}
`;

type TabPanelProperties = {
	children: React.ReactNode;
	tabId: string | number;
} & React.HTMLProps<any>;

export const TabPanel = React.forwardRef<HTMLDivElement, TabProperties>(
	({ tabId, children, ...properties }: TabPanelProperties, reference) => {
		const context = React.useContext(TabContext);
		const isActive = context?.isIdActive(tabId);

		if (!isActive) {
			return <></>;
		}

		return (
			<div data-testid="tab-pabel__active-panel" ref={reference} {...properties}>
				{children}
			</div>
		);
	},
);

TabPanel.displayName = "TabPanel";
