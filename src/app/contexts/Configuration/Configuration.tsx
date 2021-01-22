import React from "react";

type ConfigurationContextType = {
	configuration: Record<string, any>;
	setConfiguration: (configuration: Record<string, any>) => void;
};

type Props = {
	children: React.ReactNode;
	defaultConfiguration?: any;
};

const ConfigurationContext = React.createContext<any>(undefined);

export const ConfigurationProvider = ({ children, defaultConfiguration }: Props) => {
	const [configuration, setConfig] = React.useState<any>({
		// Domain specific configuration defaults
		dashboard: null,
		// Initial sync state of profile. Handled in profile synchronizer.
		profileIsSyncing: true,
		profileIsRestoring: false,
		restoredProfiles: [],
		...defaultConfiguration,
	});

	const setConfiguration = (config: any) => {
		setConfig({ ...configuration, ...config });
	};

	return (
		<ConfigurationContext.Provider value={{ ...configuration, setConfiguration } as ConfigurationContextType}>
			{children}
		</ConfigurationContext.Provider>
	);
};

export const useConfiguration = () => {
	const value = React.useContext(ConfigurationContext);
	if (value === undefined) {
		throw new Error("[useConfiguration] Component not wrapped within a Provider");
	}
	return value;
};
