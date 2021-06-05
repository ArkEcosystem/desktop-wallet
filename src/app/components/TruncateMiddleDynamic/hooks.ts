import { useCallback } from "react";

export const useTextTruncate = (value: string, offset: number, referenceElement: any) => {
	const truncate = useCallback(() => {
		const hasOverflow = (element: HTMLElement, referenceElement: HTMLElement) => {
			if (!element.offsetWidth && !referenceElement.offsetWidth) {
				return false;
			}

			return element.offsetWidth > referenceElement.offsetWidth - offset;
		};

		if (!referenceElement) {
			return value;
		}

		let length = value.length;

		const element = document.createElement("span");
		element.classList.add("fixed", "invisible", "w-auto", "whitespace-nowrap");

		element.innerHTML = value;

		referenceElement.appendChild(element);

		let truncated = value;

		if (!hasOverflow(element, referenceElement)) {
			referenceElement.removeChild(element);
			return value;
		}

		do {
			const mid = Math.floor(length / 2) - 1;

			const prefix = value.substr(0, mid);
			const suffix = value.substr(-length + mid);

			truncated = `${prefix}…${suffix}`;

			element.innerHTML = truncated;

			length--;
		} while (hasOverflow(element, referenceElement));

		referenceElement.removeChild(element);

		return truncated;
	}, [value, offset, referenceElement]);

	return truncate;
};
