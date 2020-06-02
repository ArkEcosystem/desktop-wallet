import Tab from "./Tab.vue";
import TabList from "./TabList.vue";
import TabPanel from "./TabPanel.vue";
import Tabs from "./Tabs.vue";

export default { title: "Navigation / Tabs" };

export const Default = () => ({
	components: {
		Tab,
		Tabs,
		TabList,
		TabPanel
	},
	data: () => ({
		value: "1"
	}),
	template: `
		<Tabs class="p-5" v-model="value">
			<TabList>
				<Tab id="1">Recent transactions</Tab>
				<Tab id="2">Delegate</Tab>
				<Tab id="3">Buy ARK</Tab>
				<Tab id="4">Statistics</Tab>
			</TabList>
			<div class="mt-5">
				<TabPanel id="1">
					Recent
				</TabPanel>
				<TabPanel id="2">
					Delegate
				</TabPanel>
				<TabPanel id="3">
					Buy ARK
				</TabPanel>
				<TabPanel id="4">
					Statistics
				</TabPanel>
			</div>
		</Tabs>
	`
})
