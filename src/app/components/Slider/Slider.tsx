import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";

type SliderProps = {
	children?: any;
	data?: any;
	options?: any;
};

const defaultOptions = {
	// Custom component options
	slideHeight: 180, // default slideheight (used for wallet cards),
	// Wwiper options
	slidesPerView: 4,
	slidesPerColumn: 2,
	spaceBetween: 5,
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	// Responsive breakpoints
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 20,
		},
		// when window width is >= 480px
		640: {
			slidesPerView: 3,
			spaceBetween: 40,
		},
		// when window width is >= 1200px
		1200: {
			slidesPerView: 4,
			spaceBetween: 40,
		},
	},
};

export const Slider = ({ children, data, options }: SliderProps) => {
	const swiperOptions = { ...defaultOptions, ...options };

	// Swiper needs container height to be defined.
	// slideHeight need to be always defined.
	const bottomOffset = 1.3; // bottom offset for pagination.
	const containerHeight = swiperOptions.slidesPerColumn * swiperOptions.slideHeight * bottomOffset;

	useEffect(() => {
		const sw = new Swiper(".swiper-container", swiperOptions);
		return () => sw.destroy(true, true);
	});

	const totalPages = () => {
		const slidesPerView = swiperOptions.slidesPerView;
		const slidesPerColumn = swiperOptions.slidesPerColumn;
		return Math.ceil(data.length / (slidesPerView * slidesPerColumn));
	};

	const renderChildNode = (data: any, index: number) => {
		if (typeof children === "function") return children(data, index);
		return <div />;
	};

	return (
		<div className="swiper-container" style={{ height: `${containerHeight}px` }}>
			<div className="swiper-wrapper">
				{data.map((item: any, index: number) => {
					return (
						<div className="swiper-slide" key={index} style={{ height: `${swiperOptions.slideHeight}px` }}>
							{{ ...renderChildNode(item, index) }}
						</div>
					);
				})}
			</div>
			{totalPages() > 1 && <div className="swiper-pagination" />}
		</div>
	);
};

Slider.defaultProps = {
	data: [],
};
