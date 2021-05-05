import styled from "styled-components";
import tw from "twin.macro";

export const DropdownItem = styled.li<{ disabled?: boolean }>(({ disabled }) => [
	tw`flex items-center space-x-2 py-4 px-8`,
	tw`text-base font-semibold text-left whitespace-nowrap focus:outline-none`,
	disabled &&
		tw`
		cursor-not-allowed select-none bg-theme-secondary-100 text-theme-secondary-400
		dark:(bg-theme-secondary-700 text-theme-secondary-500)
	`,
	!disabled &&
		tw`
		cursor-pointer text-theme-secondary-800
		light:hover:(text-theme-primary-600 bg-theme-secondary-200)
		dark:(text-theme-secondary-200 hover:bg-theme-primary-600)
		focus:(ring-2 ring-inset ring-theme-primary-400)
	`,
]);
