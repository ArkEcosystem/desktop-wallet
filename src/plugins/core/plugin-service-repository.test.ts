import { EventsPluginService } from "plugins/services";
import { PluginServiceIdentifier } from "plugins/types";

import { PluginServiceRepository } from "./plugin-service-repository";

describe("Plugin Service Repository", () => {
	it("should return all", () => {
		const repository = new PluginServiceRepository();
		repository.register([new EventsPluginService()]);
		expect(repository.all().size).toBe(1);
	});

	it("should find by id", () => {
		const repository = new PluginServiceRepository();
		repository.register([new EventsPluginService()]);
		expect(repository.findById(PluginServiceIdentifier.Events)).toBeTruthy();
	});
});
