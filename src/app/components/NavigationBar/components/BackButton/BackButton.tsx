import { Icon } from "app/components/Icon";
import React from "react";
import { useHistory } from "react-router-dom";
import { styled } from "twin.macro";

import { getStyles } from "./BackButton.styles";

type BackButtonProps = {
	className?: string;
	disabled?: boolean;
};

const StyledBackButton = styled.button<BackButtonProps>(getStyles);

export const BackButton = ({ className, disabled }: BackButtonProps) => {
	const history = useHistory();

	const handleOnClick = () => {
		if (disabled) {
			return;
		}

		history.go(-1);
	};

	return (
		<StyledBackButton onClick={handleOnClick} disabled={disabled} className={className}>
			<Icon name="ArrowLeft" width={6} height={10} />
		</StyledBackButton>
	);
};
