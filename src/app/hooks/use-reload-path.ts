import { useHistory, useLocation } from "react-router-dom";

export const useReloadPath = () => {
	const history = useHistory();
	const location = useLocation();

	return (path?: string) => {
		history.replace(path || location.pathname);
	};
};
