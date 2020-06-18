import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

describe("Tabs", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<Tabs>
				<TabList>
					<Tab tabId={1}>First</Tab>
					<Tab tabId={2}>Second</Tab>
					<Tab tabId={3}>Third</Tab>
				</TabList>
				<div className="mt-5">
					<TabPanel tabId={1}>1</TabPanel>
					<TabPanel tabId={2}>2</TabPanel>
					<TabPanel tabId={3}>3</TabPanel>
				</div>
			</Tabs>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should react to use effect call", () => {
		const { container, asFragment, getByTestId } = render(
			<Tabs activeId={2}>
				<TabList>
					<Tab tabId={1}>First</Tab>
					<Tab tabId={2}>Second</Tab>
				</TabList>
				<TabPanel tabId={1}>1</TabPanel>
				<TabPanel tabId={2}>2</TabPanel>
			</Tabs>,
		);

		fireEvent.click(getByTestId("tabs__tab-button-1"));

		expect(container).toBeTruthy();
		expect(getByTestId("tab-pabel__active-panel")).toHaveTextContent("1");
		expect(asFragment()).toMatchSnapshot();
	});
});
