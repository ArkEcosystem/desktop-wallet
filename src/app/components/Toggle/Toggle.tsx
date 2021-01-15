import React from "react";
import tw, { css, styled } from "twin.macro";

const Input = styled.input`
	${tw`sr-only`}
`;

const Handle = styled.div<{ disabled?: boolean }>`
	height: 5px;
	width: 30px;
	${tw`inline-flex rounded-full relative bg-theme-primary-100 dark:bg-theme-secondary-800`}

	${({ disabled }) => (disabled ? tw`cursor-not-allowed` : tw`cursor-pointer`)}
`;

const HandleInner = styled.span<{ disabled?: boolean }>`
	margin-top: 2px;
	width: 16px;
	height: 16px;
	${tw`rounded-full absolute transform -translate-y-1/2 transition transition-colors transition-transform ease-in-out duration-200`}

	${({ disabled }) =>
		disabled
			? tw`bg-theme-primary-100 dark:bg-theme-secondary-800`
			: css`
					${Input} ~ ${Handle} & {
						${tw`bg-theme-secondary-400 dark:bg-theme-secondary-600`}
					}

					${Input}:checked ~ ${Handle} & {
						${tw`translate-x-full bg-theme-primary-600`}
					}

					${Input}:hover ~ ${Handle} & {
						${tw`shadow-outline`}
					}

					${Input}:focus ~ ${Handle} & {
						${tw`shadow-outline`}
					}
			  `}
`;

type ToggleProps = { baseColor?: string; disabled?: boolean } & React.InputHTMLAttributes<any>;

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
	const inputProps = { ...props };

	const { disabled } = inputProps;

	for (const prop of ["disabled"]) {
		// @ts-ignore
		delete inputProps[prop];
	}

	return (
		<label className="flex">
			<Input type="checkbox" ref={ref} {...inputProps} />
			<Handle disabled={disabled}>
				<HandleInner disabled={disabled} />
			</Handle>
		</label>
	);
});

Toggle.displayName = "Toggle";
