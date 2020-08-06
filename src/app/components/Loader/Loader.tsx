import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Icon } from "app/components/Icon";
import React from "react";

import { LoaderWrapper,LogoSpinner } from "./Loader.styles";

type LoaderProps = {
	position?: string;
	show?: boolean;
};

export const Loader = ({ position, show }: LoaderProps) => {
	if (!show) return <></>;

	return (
		<LoaderWrapper className={position}>
			<LogoSpinner>
				<div className="centered">
					<CircularProgressBar
						className="spin"
						showValue={false}
						size={100}
						strokeWidth={3}
						value={40}
						progressColor="var(--theme-color-neutral-800)"
						strokeColor="var(--theme-color-neutral-300)"
					/>
				</div>

				<div className="centered">
					<CircularProgressBar
						className="spin left"
						showValue={false}
						size={75}
						strokeWidth={3}
						value={30}
						progressColor="var(--theme-color-neutral-800)"
						strokeColor="var(--theme-color-neutral-300)"
					/>
				</div>

				<div className="centered">
					<Icon name="LoaderLogo" width={50} height={60} />
				</div>
			</LogoSpinner>
		</LoaderWrapper>
	);
};

Loader.defaultProps = {
	position: "absolute",
	show: true,
};
