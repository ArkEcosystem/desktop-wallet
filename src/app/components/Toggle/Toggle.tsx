import React from "react";
import tw, { css, styled } from "twin.macro";

const Input = styled.input`
	${tw`sr-only`}
`;

const Handle = styled.div`
	height: 7px;
	${tw`inline-flex rounded-full relative w-9 cursor-pointer bg-theme-neutral-light`}
`;

const HandleInner = styled.span<{ baseColor?: string; disabled?: boolean }>`
	margin-top: 3px;
	width: 18px;
	height: 18px;
	${tw`rounded-full absolute transform -translate-y-1/2 transition transition-colors transition-transform ease-in-out duration-200`}

	${({ baseColor, disabled }) =>
		css`
			${Input} ~ ${Handle} & {
				background-color: var(${baseColor && !disabled ? baseColor : "--theme-color-neutral-light"});
			}
		`};

	${Input}:checked ~ ${Handle} & {
		${tw`translate-x-full bg-theme-primary text-2xl`}
	}

	${Input}:focus ~ ${Handle} & {
		${tw`shadow-outline`}
	}
`;

type ToggleProps = { baseColor?: string; disabled?: boolean } & React.InputHTMLAttributes<any>;

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
	const inputProps = { ...props };

	const { baseColor, disabled } = inputProps;

	for (const prop of ["baseColor", "disabled"]) {
		// @ts-ignore
		delete inputProps[prop];
	}

	return (
		<label className="flex">
			<Input type="checkbox" ref={ref} {...inputProps} />
			<Handle>
				<HandleInner baseColor={baseColor} disabled={disabled} />
			</Handle>
		</label>
	);
});

Toggle.displayName = "Toggle";
