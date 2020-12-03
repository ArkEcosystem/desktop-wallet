import React from "react";

type ConfigurationContextType = {
	configuration: Record<string, any>;
	setConfiguration: (configuration: Record<string, any>) => void;
};

type Props = {
	children: React.ReactNode;
};

const ConfigurationContext = React.createContext<any>(undefined);

export const ConfigurationProvider = ({ children }: Props) => {
	const [configuration, setConfiguration] = React.useState<any>({
		// Domain specific configuration defaults
		dashboard: null,
	});

	return (
		<ConfigurationContext.Provider value={{ configuration, setConfiguration } as ConfigurationContextType}>
			{children}
		</ConfigurationContext.Provider>
	);
};

export const useConfiguration = () => React.useContext(ConfigurationContext);
