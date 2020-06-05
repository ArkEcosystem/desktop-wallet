import tw from "twin.macro";

const baseStyle = [tw`flex overflow-hidden`];

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`py-4 px-2`;
		case "default":
			return tw`py-8 px-4`;
		case "large":
			return tw`py-12 px-8`;
	}
};

export const getStyles = ({ size }: { size?: string }) => {
	return [getSize(size!), ...baseStyle];
};

export default getStyles;
