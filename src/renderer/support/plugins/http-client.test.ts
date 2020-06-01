import { createLocalVue } from "@vue/test-utils";

import Subject from "@/support/plugins/http-client";
import { HttpClient } from "@/support/services/http";

it("should register the plugin", () => {
	const localVue = createLocalVue();

	expect(localVue.prototype.$http).toBeUndefined();

	localVue.use(Subject);

	expect(localVue.prototype.$http).toBeInstanceOf(HttpClient);
});
