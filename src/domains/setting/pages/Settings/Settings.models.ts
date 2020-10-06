import { Environment } from "@arkecosystem/platform-sdk-profiles";

export type SettingsProps = {
	env: Environment;
	formConfig: any;
	onSuccess: (message?: string) => void;
	onError: (errorMessage: string, message?: string) => void;
};
