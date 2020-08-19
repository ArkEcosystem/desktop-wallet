export class ProfilePluginService {
	private subscribers: ((profile: any) => void)[] = [];

	// Called by component
	emitProfileChange(profile: any) {
		this.subscribers.forEach((callback) => callback(profile));
	}

	onDidProfileChange(callback: (profile: any) => void) {
		this.subscribers.push(callback);
	}
}
