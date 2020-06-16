import "swiper/css/swiper.min.css";

import React, { useEffect } from "react";
import Swiper from "swiper";

type SliderProps = {
	children?: any;
	data?: any;
	options?: any;
};

const defaultOptions = {
	// Custom component options
	slideHeight: 180, // default slideheight (used for wallet cards),
	// Wwiper options
	slidesPerView: 1,
	slidesPerColumn: 1,
	touchStartPreventDefault: false,
	watchOverflow: true,
	roundLengths: true,
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
};

export const Slider = ({ children, data, options }: SliderProps) => {
	const swiperOptions = { ...defaultOptions, ...options };

	// Swiper needs container height to be defined.
	// `slideHeight` is required.
	const getContainerHeight = () => {
		const bottomOffset = 1.3; // bottom offset for pagination.

		// If items are less than slidesPerView, use 1 row
		const slidesPerColumn = data.length <= swiperOptions.slidesPerView ? 1 : swiperOptions.slidesPerColumn;
		const containerHeight = slidesPerColumn * swiperOptions.slideHeight * bottomOffset;
		return containerHeight;
	};

	useEffect(() => {
		const sw = new Swiper(".swiper-container", swiperOptions);
		return () => sw.destroy(true, false);
	});

	const renderChildNode = (data: any, index: number) => {
		if (typeof children === "function") return children(data, index);
		return <div />;
	};

	return (
		<div className="swiper-container" style={{ height: `${getContainerHeight()}px` }}>
			<div className="h-full swiper-wrapper">
				{data.map((item: any, index: number) => {
					return (
						<div className="swiper-slide" key={index} style={{ height: `${swiperOptions.slideHeight}px` }}>
							{{ ...renderChildNode(item, index) }}
						</div>
					);
				})}
			</div>
			<div className="swiper-pagination" />
		</div>
	);
};

Slider.defaultProps = {
	data: [],
};
