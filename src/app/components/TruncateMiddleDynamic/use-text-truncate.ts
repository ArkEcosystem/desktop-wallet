import { useMemo } from "react";

export const useTextTruncate = (referenceElement: any, value: string, offset = 0) =>
	useMemo(() => {
		const hasOverflow = (element: HTMLElement, referenceElement: HTMLElement) => {
			if (!element.offsetWidth && !referenceElement.offsetWidth) {
				return false;
			}

			return element.offsetWidth > referenceElement.offsetWidth - offset;
		};

		if (!referenceElement) {
			return value;
		}

		const element = document.createElement("span");

		element.innerHTML = value;
		element.classList.add("fixed", "invisible", "w-auto", "whitespace-nowrap");

		referenceElement.appendChild(element);

		let temp = value;

		if (!hasOverflow(element, referenceElement)) {
			referenceElement.removeChild(element);
			return value;
		}

		let mid = Math.floor(value.length / 2) - 1;

		do {
			const prefix = value.substr(0, mid);
			const suffix = value.substr(-mid);

			temp = `${prefix}…${suffix}`;

			element.innerHTML = temp;

			mid--;
		} while (hasOverflow(element, referenceElement));

		referenceElement.removeChild(element);

		return temp;
	}, [value, offset, referenceElement]);
