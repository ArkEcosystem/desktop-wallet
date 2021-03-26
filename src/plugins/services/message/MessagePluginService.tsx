import { PluginService } from "plugins";
import { PluginServiceIdentifier } from "plugins/types";

import { useSignMessageModal } from "./use-sign-message-modal";

export class MessagePluginService implements PluginService {
	config() {
		return {
			id: PluginServiceIdentifier.Message,
			accessor: "message",
		};
	}

	api() {
		return {
			useSignMessageModal,
		};
	}
}
