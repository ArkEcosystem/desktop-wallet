import React from "react";
import { styled } from "twin.macro";
import { getStyles } from "./style";

type AlertProps = {
	children: React.ReactNode;
	title?: string;
	variant?: "primary" | "success" | "danger" | "warning" | "neutral";
	size?: "small" | "default" | "large";
};

const Wrapper = styled.div(getStyles);

const Alert = ({ variant, title, size, children }: AlertProps) => (
	<div className={`flex rounded-lg overflow-hidden bg-theme-${variant}`}>
		<Wrapper
			size={size}
			className={`w-24 flex items-center justify-center text-theme-${variant} bg-theme-${variant}-200`}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-8 h-8">
				<path
					d="M0 10C0 4.5 4.5 0 10 0s10 4.5 10 10-4.5 10-10 10S0 15.5 0 10zm2 0c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8zm7 4c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm0-3V6c0-.6.4-1 1-1s1 .4 1 1v5c0 .6-.4 1-1 1s-1-.4-1-1z"
					fill="currentColor"
				/>
			</svg>
		</Wrapper>
		<Wrapper className={`flex-1 bg-theme-${variant}-100 pl-5`}>
			<div className="flex flex-col justify-center">
				{title && (
					<p className={`text-xl font-bold text-theme-${variant}`} data-testid="alert__title">
						{title}
					</p>
				)}
				{children}
			</div>
		</Wrapper>
	</div>
);

Alert.defaultProps = {
	title: "Alert",
	variant: "warning",
	size: "default",
};

export { Alert };
