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
		visible: { height: maxHeight, opacity: 1, overflow: "auto" },
		hidden: { height: minHeight, opacity: 0, overflow: "hidden" },
	};

	return (
		<motion.div
			data-testid="Collapse"
			aria-hidden={!isOpen}
			variants={variants}
			transition={{ ease: "easeOut", duration }}
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
