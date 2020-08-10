import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
	const [onlineStatus, setNetworkStatus] = useState(window.navigator.onLine);

	const updateNetworkStatus = () => {
		setNetworkStatus(window.navigator.onLine);
	};

	useEffect(() => {
		window.addEventListener("offline", updateNetworkStatus);
		window.addEventListener("online", updateNetworkStatus);

		return () => {
			window.removeEventListener("offline", updateNetworkStatus);
			window.removeEventListener("online", updateNetworkStatus);
		};
	}, []);

	return onlineStatus;
};
