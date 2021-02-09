import { Button as ButtonBase } from "app/components/Button";
import { Circle } from "app/components/Circle";
import tw, { styled } from "twin.macro";

export const Button = styled(ButtonBase)`
	&:hover {
		${Circle} {
			${tw`bg-theme-primary-700 dark:bg-theme-secondary-800 border-theme-primary-700 dark:border-theme-secondary-800 text-white`}
		}
	}
`;
