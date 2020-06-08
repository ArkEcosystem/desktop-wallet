import tw from "twin.macro";

const baseStyle = [tw`flex overflow-hidden`];

const getSize = (size: string): any => {
	switch (size) {
		case "small":
			return tw`px-2 py-4`;
		case "default":
			return tw`px-4 py-8`;
		case "large":
			return tw`px-8 py-12`;
	}
};

export const getStyles = ({ size }: { size?: string }) => {
	return [getSize(size!), ...baseStyle];
};
