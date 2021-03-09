import React from "react";
import { getTrackBackground, Range as ReactRange } from "react-range";
import tw, { styled } from "twin.macro";

const Track = styled.div`
	height: 1px;
	${tw`flex w-full rounded`}
`;

const TrackFilled = styled.div`
	${tw`p-0 border-0 h-1 w-full rounded self-center`}
`;

const Thumb = styled.div`
	&:active {
		${tw`bg-theme-primary-600`}
	}
	${tw`m-0 transition-colors duration-100 w-4 h-4 rounded-full bg-theme-background border-3 border-theme-primary-600 focus:outline-none focus:shadow-outline`}
`;

type Props = {
	values: number[];
	onChange: (values: number[]) => void;
	min?: number;
	max?: number;
	step?: number;
	isInvalid?: boolean;
};

export const Range = ({ values, min, max, step, onChange, isInvalid }: Props) => {
	const color = !isInvalid ? "var(--theme-color-primary-600)" : "var(--theme-color-danger-700)";

	return (
		<div data-testid="Range" className="flex flex-wrap justify-center">
			<ReactRange
				values={values}
				step={step}
				min={min}
				max={max}
				onChange={onChange}
				renderTrack={({ props: track, children }) => (
					<Track
						data-testid="Range__track"
						onMouseDown={track.onMouseDown}
						onTouchStart={track.onTouchStart}
						style={track.style}
					>
						<TrackFilled
							data-testid="Range__track__filled"
							style={{
								background: getTrackBackground({
									values,
									colors: [color, "transparent"],
									min: min!,
									max: max!,
								}),
							}}
							ref={track.ref}
						>
							{children}
						</TrackFilled>
					</Track>
				)}
				renderThumb={({ props: thumb }) => (
					<Thumb data-testid="Range__thumb" {...thumb} style={{ ...thumb.style, borderColor: color }} />
				)}
			/>
		</div>
	);
};

Range.defaultProps = {
	min: 1,
	max: 100,
	step: 1,
	colors: ["var(--theme-color-primary-600)", "var(--theme-color-secondary-400)"],
};
