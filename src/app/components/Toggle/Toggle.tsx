import React from "react";
import tw, { styled } from "twin.macro";

const Input = styled.input`
	${tw`sr-only`}
`;

const Handle = styled.div`
	height: 7px;
	${tw`inline-flex rounded-full relative w-9 cursor-pointer bg-theme-neutral-light`}
`;

const HandleInner = styled.span`
	margin-top: 3px;
	width: 18px;
	height: 18px;
    ${tw`bg-theme-neutral-light rounded-full absolute transform -translate-y-1/2 transition transition-colors transition-transform ease-in-out duration-200`}

    ${Input}:checked ~ ${Handle} & {
        ${tw`translate-x-full bg-theme-primary text-2xl`}
    }

    ${Input}:focus ~ ${Handle} & {
        ${tw`shadow-outline`}
    }
`;

type ToggleProps = React.InputHTMLAttributes<any>;

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
	return (
		<label className="flex">
			<Input type="checkbox" ref={ref} {...props} />
			<Handle>
				<HandleInner />
			</Handle>
		</label>
	);
});

Toggle.displayName = "Toggle";
