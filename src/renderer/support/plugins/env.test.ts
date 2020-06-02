import { Environment, ProfileRepository } from "@arkecosystem/platform-sdk-profiles";
import { createLocalVue } from "@vue/test-utils";

import Subject from "@/support/plugins/env";

it("should register the plugin", () => {
	const localVue = createLocalVue();

	expect(localVue.prototype.$env).toBeUndefined();
	expect(localVue.prototype.$profiles).toBeUndefined();

	localVue.use(Subject);

	expect(localVue.prototype.$env).toBeInstanceOf(Environment);
	expect(localVue.prototype.$profiles).toBeInstanceOf(ProfileRepository);
});
