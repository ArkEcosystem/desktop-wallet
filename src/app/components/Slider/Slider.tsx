import "swiper/css/swiper.min.css";

import React, { useEffect } from "react";
import Swiper from "swiper";

type SliderProps = {
	children?: any;
	data?: any;
	options?: any;
	className?: string;
	paginationPosition: "bottom-center" | "top-right";
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

export const Slider = ({ children, data, options, className, paginationPosition }: SliderProps) => {
	const swiperOptions = { ...defaultOptions, ...options };

	// Swiper needs container height to be defined.
	// `slideHeight` is required.
	const getContainerHeight = () => {
		const bottomOffsetRatio = swiperOptions.slidesPerView > 1 ? 1.1 : 1.3;
		const paginationOffset = paginationPosition === "bottom-center" ? bottomOffsetRatio : 1; // offset for pagination.

		// If items are less than slidesPerView, use 1 row
		const slidesPerColumn = data.length <= swiperOptions.slidesPerView ? 1 : swiperOptions.slidesPerColumn;
		const containerHeight = slidesPerColumn * swiperOptions.slideHeight * paginationOffset;
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
		<div className="relative">
			{paginationPosition === "top-right" && (
				<div className="absolute right-0 w-auto -top-12 space-x-2 swiper-pagination" />
			)}

			<div className="swiper-container" style={{ height: `${getContainerHeight()}px` }}>
				<div className={`h-full swiper-wrapper ${className || ""}`}>
					{data.map((item: any, index: number) => {
						return (
							<div
								className="swiper-slide"
								key={index}
								style={{ height: `${swiperOptions.slideHeight}px` }}
							>
								{{ ...renderChildNode(item, index) }}
							</div>
						);
					})}
				</div>

				{paginationPosition === "bottom-center" && <div className="swiper-pagination" />}
			</div>
		</div>
	);
};

Slider.defaultProps = {
	data: [],
	paginationPosition: "bottom-center",
};
