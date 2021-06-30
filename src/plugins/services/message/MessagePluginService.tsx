import { PluginService } from "plugins";
import { PluginServiceIdentifier } from "plugins/types";

import { useSignMessageModal } from "./use-sign-message-modal";

export class MessagePluginService implements PluginService {
	config() {
		return {
			accessor: "message",
			id: PluginServiceIdentifier.Message,
		};
	}

	api() {
		return {
			useSignMessageModal,
		};
	}
}
