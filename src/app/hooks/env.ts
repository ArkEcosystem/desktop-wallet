import { useEnvironment } from "app/contexts/Environment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const useActiveProfile = () => {
	const env = useEnvironment();
	const { profileId } = useParams();

	return useMemo(() => {
		if (env) {
			try {
				return env.profiles().findById(profileId);
			} catch {
				return undefined;
			}
		}
	}, [env, profileId]);
};
