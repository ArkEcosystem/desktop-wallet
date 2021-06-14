import React from "react";
import tw, { styled } from "twin.macro";

import { TabContext, TabId, useTab } from "./useTab";

interface TabsProps {
	children: React.ReactNode;
	activeId?: TabId;
	className?: string;
	onChange?: (id: TabId) => void;
}

export function Tabs({ children, activeId, className, onChange }: TabsProps) {
	const context = useTab({ initialId: activeId });
	const { currentId, setCurrentId } = context;

	React.useEffect(() => {
		if (currentId) {
			onChange?.(currentId);
		}
	}, [currentId, onChange]);

	React.useEffect(() => {
		setCurrentId(activeId);
	}, [setCurrentId, activeId]);

	return (
		<TabContext.Provider value={context}>
			<div className={className}>{children}</div>
		</TabContext.Provider>
	);
}

interface TabProps {
	children: React.ReactNode;
	tabId: string | number;
}

const TabButton = styled.button``;

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>((props: TabProps, ref) => {
	const context = React.useContext(TabContext);
	const isActive = context?.isIdActive(props.tabId);

	return (
		<TabButton
			data-testid={`tabs__tab-button-${props.tabId}`}
			role="tab"
			type="button"
			className="group"
			ref={ref}
			aria-selected={isActive}
			tabIndex={isActive ? 0 : -1}
			onKeyDown={(event: any) => {
				if (event.key === "ArrowLeft") {
					let previousTab = event.target.previousElementSibling;

					if (!previousTab) {
						previousTab = event.target.parentElement.querySelector("[role=tab]:last-child");
					}

					previousTab.focus();
				} else if (event.key === "ArrowRight") {
					let nextTab = event.target.nextElementSibling;

					if (!nextTab) {
						nextTab = event.target.parentElement.querySelector("[role=tab]");
					}

					nextTab.focus();
				} else if (event.key === "Enter" || event.key === " ") {
					context?.setCurrentId(props.tabId);
				}
			}}
			onClick={() => context?.setCurrentId(props.tabId)}
		>
			<div className="absolute inset-0 -mx-1 rounded ring-theme-primary-400 group-focus:ring-2 group-focus-visible" />
			<span>{props.children}</span>
		</TabButton>
	);
});
Tab.displayName = "Tab";

export const TabList = styled.div`
	${tw`inline-flex justify-start items-stretch rounded-xl bg-theme-secondary-100 dark:bg-theme-secondary-background px-3`}

	& > ${TabButton} {
		${tw`px-4 mx-4 py-5 border-t-2 border-b-2 border-transparent font-semibold text-theme-secondary-text relative transition-colors ease-in-out duration-300 focus:(outline-none text-theme-text) hover:text-theme-text`}

		&[aria-selected="true"] {
			border-bottom-color: var(--theme-color-primary-600);
			${tw`text-theme-text`}
		}

		& + ${TabButton}:after {
			content: "";
			width: 1px;
			${tw`h-4 bg-theme-secondary-400 dark:bg-theme-secondary-700 absolute -left-4 top-1/2 transform -translate-y-1/2 block`};
		}
	}
`;

type TabPanelProps = {
	children: React.ReactNode;
	tabId: string | number;
} & React.HTMLProps<any>;

export const TabPanel = React.forwardRef<HTMLDivElement, TabProps>(
	({ tabId, children, ...props }: TabPanelProps, ref) => {
		const context = React.useContext(TabContext);
		const isActive = context?.isIdActive(tabId);

		if (!isActive) {
			return <></>;
		}

		return (
			<div data-testid="tab-pabel__active-panel" ref={ref} {...props}>
				{children}
			</div>
		);
	},
);

TabPanel.displayName = "TabPanel";
