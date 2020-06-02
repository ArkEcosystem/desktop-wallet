import { createLocalVue } from "@vue/test-utils";
import Emittery from "emittery";

import Subject from "@/support/plugins/event-bus";

it("should register the plugin", () => {
	const localVue = createLocalVue();

	expect(localVue.prototype.$eventBus).toBeUndefined();

	localVue.use(Subject);

	expect(localVue.prototype.$eventBus).toBeInstanceOf(Emittery);
});
