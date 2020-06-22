import { motion } from "framer-motion";
import React from "react";

type Props = {
	children: React.ReactNode;
	isOpen?: boolean;
	minHeight?: number | string;
	maxHeight?: number | string;
	duration?: number;
	className?: string;
};

export const Collapse = ({ isOpen, children, minHeight, maxHeight, duration, ...props }: Props) => {
	const variants = {
		visible: {
			maxHeight: maxHeight,
			height: "auto",
			opacity: 1,
			overflow: "auto",
			transition: {
				duration,
			},
		},
		hidden: {
			height: minHeight,
			opacity: 0,
			overflow: "hidden",
			transition: {
				duration: duration! * 0.75,
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
			{...props}
		>
			{children}
		</motion.div>
	);
};

Collapse.defaultProps = {
	isOpen: false,
	minHeight: 0,
	maxHeight: "auto",
	duration: 0.2,
};
