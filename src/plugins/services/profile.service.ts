export class ProfilePluginService {
	subscribers: ((profile: any) => void)[] = [];

	// Called by component
	emitProfileChange(profile: any) {
		this.subscribers.forEach((callback) => callback(profile));
	}

	onDidProfileChange(callback: (profile: any) => void) {
		this.subscribers.push(callback);
	}
}

// TODO: Move this to a container or elsewhere
export const profilePluginService = new ProfilePluginService();
