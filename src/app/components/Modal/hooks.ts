import { useCallback, useEffect } from "react";

export const useModal = ({ isOpen, onClose }: { isOpen: boolean; onClose?: any }) => {
	useEffect(() => {
		document.body.style.overflow = "overlay";
		document.body.style.overflowX = "hidden";

		if (isOpen) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = "overlay";
			document.body.style.overflowX = "hidden";
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
		if (isOpen) {
			document.addEventListener("keyup", onEscKey, false);
		} else {
			document.removeEventListener("keyup", onEscKey);
		}

		return () => {
			document.removeEventListener("keyup", onEscKey);
		};
	}, [isOpen, onEscKey]);
};
