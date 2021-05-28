import { useEffect, useState } from "react";

export const useScroll = () => {
	const [scroll, setScroll] = useState(0);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleScroll = () => {
		setScroll(window.scrollY);
	};

	return scroll;
};
