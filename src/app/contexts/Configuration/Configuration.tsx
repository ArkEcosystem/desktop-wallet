import React from "react";

interface ConfigurationContextType {
	configuration: Record<string, any>;
	setConfiguration: (configuration: Record<string, any>) => void;
}

interface Properties {
	children: React.ReactNode;
	defaultConfiguration?: any;
}

const ConfigurationContext = React.createContext<any>(undefined);

export const ConfigurationProvider = ({ children, defaultConfiguration }: Properties) => {
	const [configuration, setConfig] = React.useState<any>({
		activityState: {},
		// Domain specific configuration defaults
		dashboard: null,
		// Initial sync state of profile. Handled in profile synchronizer.
		profileIsSyncing: true,
		profileIsRestoring: false,
		// Separate flag for exchange rate sync status. Updated by profile sync exchange job.
		profileIsSyncingExchangeRates: false,
		restoredProfiles: [],
		...defaultConfiguration,
	});

	const setConfiguration = (config: any) => {
		setConfig((latestConfig: any) => ({ ...latestConfig, ...config }));
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
