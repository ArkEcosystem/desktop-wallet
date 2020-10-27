import { useCallback,useEffect } from "react";

export const useModal = ({ isOpen, onClose }: { isOpen: boolean; onClose?: any }) => {
	useEffect(() => {
		document.body.style.width = "100vw";
		document.body.style.overflowX = "hidden";
		document.body.style.overflowY = "auto";

		if (isOpen) {
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = "calc(100vw - 100%)";
		}

		return () => {
			document.body.style.overflowY = "auto";
			document.body.style.paddingRight = "0";
			return;
		};
	}, [isOpen]);

	const onEscKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		},
		[onClose],
	);

	useEffect(() => {
		document.addEventListener("keyup", onEscKey, false);

		return () => {
			document.removeEventListener("keyup", onEscKey);
		};
	}, [onEscKey]);
};
