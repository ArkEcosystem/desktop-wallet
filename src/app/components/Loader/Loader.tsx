import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Icon } from "app/components/Icon";
import React from "react";

import { LoaderWrapper, LogoSpinner } from "./Loader.styles";

type LoaderProps = {
	show?: boolean;
};

export const Loader = ({ show }: LoaderProps) => {
	if (!show) {
		return <></>;
	}

	return (
		<LoaderWrapper>
			<LogoSpinner>
				<div className="centered">
					<CircularProgressBar
						className="spin"
						showValue={false}
						size={100}
						strokeWidth={3}
						value={40}
						progressColor="var(--theme-color-secondary-800)"
						strokeColor="var(--theme-color-secondary-300)"
					/>
				</div>

				<div className="centered">
					<CircularProgressBar
						className="spin left"
						showValue={false}
						size={75}
						strokeWidth={3}
						value={30}
						progressColor="var(--theme-color-secondary-800)"
						strokeColor="var(--theme-color-secondary-300)"
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
	show: true,
};
