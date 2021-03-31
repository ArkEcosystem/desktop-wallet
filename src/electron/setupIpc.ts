import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { Handlers } from "@arkecosystem/platform-sdk-profiles/dist/drivers/electron";

export const setupIpc = (env: Environment) => {
	const handlersRegistration: Handlers = new Handlers(env);
	handlersRegistration.registerHandlers();
};
