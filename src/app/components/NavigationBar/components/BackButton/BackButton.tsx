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

	return (
		<StyledBackButton onClick={() => history.go(-1)} disabled={disabled} className={className}>
			<Icon name="ArrowLeft" width={6} height={10} />
		</StyledBackButton>
	);
};
