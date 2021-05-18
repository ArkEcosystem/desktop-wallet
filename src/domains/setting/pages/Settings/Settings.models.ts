import { DeepMap, FieldError, UseFormMethods } from "react-hook-form";

export type SettingsProps = {
	formConfig: {
		context: UseFormMethods<Record<string, any>>;
		errors: DeepMap<Record<string, any>, FieldError>;
		register: any;
	};
	onSuccess: (message?: string) => void;
	onError: (errorMessage: string, message?: string) => void;
};
