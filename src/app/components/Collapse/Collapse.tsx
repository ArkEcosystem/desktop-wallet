import { motion } from "framer-motion";
import React from "react";

interface Properties {
	children: React.ReactNode;
	isOpen?: boolean;
	minHeight?: number | string;
	maxHeight?: number | string;
	duration?: number;
	className?: string;
}

export const Collapse = ({ isOpen, children, minHeight, maxHeight, duration, ...properties }: Properties) => {
	const variants = {
		hidden: {
			height: minHeight,
			opacity: 0,
			overflow: "hidden",
			transition: {
				duration: duration! * 0.75,
			},
		},
		visible: {
			height: "auto",
			maxHeight: maxHeight,
			opacity: 1,
			overflow: properties.className?.includes("custom-scroll") ? "overlay" : "auto",
			transition: {
				duration,
			},
		},
	};

	return (
		<motion.div
			data-testid="Collapse"
			aria-hidden={!isOpen}
			variants={variants}
			animate={isOpen ? "visible" : "hidden"}
			initial={isOpen ? "visible" : "hidden"}
			{...properties}
		>
			{children}
		</motion.div>
	);
};

Collapse.defaultProps = {
	duration: 0.2,
	isOpen: false,
	maxHeight: "auto",
	minHeight: 0,
};
