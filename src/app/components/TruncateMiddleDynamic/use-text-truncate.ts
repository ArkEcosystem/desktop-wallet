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

		referenceElement.append(element);

		let temporary = value;

		if (!hasOverflow(element, referenceElement)) {
			element.remove();
			return value;
		}

		let mid = Math.floor(value.length / 2) - 1;

		do {
			const prefix = value.slice(0, Math.max(0, mid));
			const suffix = value.slice(-mid);

			temporary = `${prefix}…${suffix}`;

			element.innerHTML = temporary;

			mid--;
		} while (hasOverflow(element, referenceElement));

		element.remove();

		return temporary;
	}, [value, offset, referenceElement]);
