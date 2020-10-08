import "swiper/swiper-bundle.css";

import React, { useEffect, useMemo } from "react";
import Swiper, { Pagination } from "swiper";

Swiper.use([Pagination]);

type SliderProps = {
	children?: any;
	data?: any;
	options?: any;
	className?: string;
	paginationPosition: "bottom-center" | "top-right";
};

const defaultOptions = {
	// Custom component options
	slideHeight: 184, // default slideheight (used for wallet cards),
	// Swiper options
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
	// If items are less or equal than slidesPerView, use 1 row
	swiperOptions.slidesPerColumn = data.length <= swiperOptions.slidesPerView ? 1 : swiperOptions.slidesPerColumn;

	const showPagination = useMemo(() => data.length > swiperOptions.slidesPerView * swiperOptions.slidesPerColumn, [
		data,
		swiperOptions,
	]);

	// Swiper needs container height to be defined.
	// `slideHeight` is required.
	const getContainerHeight = () => {
		const spacing = 20;

		const paginationOffset = showPagination && paginationPosition === "bottom-center" ? spacing + 24 : 0;

		return (
			swiperOptions.slidesPerColumn * swiperOptions.slideHeight +
			(data.length > swiperOptions.slidesPerView ? spacing : 0) +
			paginationOffset
		);
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
			{showPagination && paginationPosition === "top-right" && (
				<div className="absolute right-0 flex items-center w-auto h-6 space-x-2 -top-12 swiper-pagination" />
			)}

			<div className="swiper-container" style={{ height: `${getContainerHeight()}px` }}>
				<div className={`h-full swiper-wrapper ${className || ""}`}>
					{data.map((item: any, index: number) => (
						<div className="swiper-slide" key={index} style={{ height: `${swiperOptions.slideHeight}px` }}>
							{{ ...renderChildNode(item, index) }}
						</div>
					))}
				</div>

				{showPagination && paginationPosition === "bottom-center" && (
					<div className="flex items-center justify-center h-6 swiper-pagination important:bottom-0" />
				)}
			</div>
		</div>
	);
};

Slider.defaultProps = {
	data: [],
	paginationPosition: "bottom-center",
};
