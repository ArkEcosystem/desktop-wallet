import React from "react";

import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

export default {
	title: "Navigation / Tabs",
};

export const Default = () => (
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
	</Tabs>
);
