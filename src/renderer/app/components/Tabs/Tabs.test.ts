import { defineComponent, inject, computed, ref } from "vue";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";

import Tab from "@/app/components/Tabs/Tab.vue";
import TabList from "@/app/components/Tabs/TabList.vue";
import TabPanel from "@/app/components/Tabs/TabPanel.vue";
import Tabs from "@/app/components/Tabs/Tabs.vue";

import { TabContextSymbol } from "./useTab";

const localVue = createLocalVue();

const tabContextMock = {
	state: reactive({
		currentId: "1",
	}),
	isIdActive: jest.fn(() => ref(false)),
	setCurrentId: jest.fn(() => ""),
};

describe("Tabs", () => {
	it("should render", () => {
		const wrapper = shallowMount(Tabs, { localVue });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should emit event when id changes", async () => {
		const wrapper = mount(Tabs, { propsData: { value: "1" }, localVue });
		// @ts-ignore
		wrapper.vm._provided[TabContextSymbol as string].state.currentId = "2";
		await wrapper.vm.$nextTick();
		expect(wrapper.emitted().input).toEqual([["1"], ["2"]]);
	});

	it("should render all together", () => {
		const wrapper = mount(
			{
				components: {
					Tabs,
					Tab,
					TabPanel,
					TabList,
				},
				data: () => ({
					value: "1",
				}),
				template: `
				<Tabs :value="value">
					<TabList>
						<Tab id="1">Test 1</Tab>
						<Tab id="2">Test 2</Tab>
					</TabList>
					<TabPanel id="1">Test 1</TabPanel>
					<TabPanel id="2">Test 2</TabPanel>
				</Tabs>
			`,
			},
			{ localVue },
		);
		const panels = wrapper.findAll("[data-testid='TabPanel']");
		expect(panels.length).toEqual(1);
		expect(panels.wrappers[0].text()).toEqual("Test 1");
		expect(wrapper.html()).toMatchSnapshot();
	});
});

describe("TabPanel", () => {
	it("should render", () => {
		const wrapper = mount(TabPanel, {
			propsData: { id: "1" },
			provide: {
				// @ts-ignore
				[TabContextSymbol as string]: tabContextMock,
			},
			localVue,
		});
		// @ts-ignore
		expect(wrapper.vm.isActive).toEqual(false);
		expect(wrapper.text()).toEqual("");
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should show if is active", () => {
		tabContextMock.isIdActive.mockReturnValue(ref(true));
		const wrapper = mount(TabPanel, {
			propsData: { id: "1" },
			provide: {
				// @ts-ignore
				[TabContextSymbol as string]: tabContextMock,
			},
			localVue,
			slots: {
				default: `Test 1`,
			},
		});
		// @ts-ignore
		expect(wrapper.vm.isActive).toEqual(true);
		expect(wrapper.text()).toEqual("Test 1");
		expect(wrapper.html()).toMatchSnapshot();
	});
});

describe("TabList", () => {
	it("should render", () => {
		const wrapper = mount(TabList, { localVue });
		expect(wrapper.html()).toMatchSnapshot();
	});
});

describe("Tab", () => {
	it("should render", () => {
		const wrapper = mount(Tab, {
			propsData: { id: "1" },
			provide: {
				// @ts-ignore
				[TabContextSymbol as string]: tabContextMock,
			},
			localVue,
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should update current id on click", () => {
		const wrapper = mount(Tab, {
			propsData: { id: "2" },
			provide: {
				// @ts-ignore
				[TabContextSymbol as string]: tabContextMock,
			},
			localVue,
		});
		wrapper.trigger("click");
		expect(tabContextMock.setCurrentId).toHaveBeenCalledWith("2");
	});
});
