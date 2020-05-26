<template>
	<div class="Identicon__wrapper">
		<div :style="{ height: `${size}px`, width: `${size}px` }" class="Identicon select-none">
			<svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" :viewBox="`0 0 100 100`">
				<defs>
					<mask :id="maskId">
						<circle v-if="shape === 'circle'" fill="white" cx="50%" cy="50%" r="50%" />
						<rect v-if="shape === 'square'" fill="white" width="100%" height="100%" />
						<circle v-if="showNetworkSymbol" fill="black" cx="70%" cy="78%" r="25%" />
					</mask>
				</defs>
				<g v-if="showNetworkSymbol">
					<circle :style="{ fill: 'var(--theme-transaction-sent)' }" cx="70%" cy="78%" r="20%" />
					<text :style="{ fill: 'var(--theme-transaction-sent-arrow)' }" x="62%" y="88%" font-size="28">
						{{ networkSymbol }}
					</text>
				</g>
				<rect :fill="backgroundColor" width="100%" height="100%" :mask="`url(#${maskId})`" />
				<g :mask="`url(#${maskId})`">
					<rect
						v-for="rectangle in rectangles"
						:key="rectangle.id"
						:width="rectangle.width"
						:height="rectangle.height"
						:transform="rectangle.transform"
						:fill="rectangle.fill"
						x="0"
						y="0"
					/>
					<path
						:width="logo.width"
						:height="logo.height"
						:transform="logo.transform"
						:fill="logo.fill"
						fill-rule="evenodd"
						d="M178.645,100.996 L-0.004,289.000 L178.645,-0.001 L355.995,289.000 L178.645,100.996 ZM209.789,177.509 L147.068,177.509 L178.645,145.155 L209.789,177.509 ZM230.120,198.496 L258.669,228.664 L98.188,228.664 L126.737,198.496 L230.120,198.496 Z"
					/>
				</g>
			</svg>
		</div>
	</div>
</template>

<script>
import Color from "color";
import crypto from "crypto";
import MersenneTwister from "mersenne-twister";
import { Component, Prop,Vue } from "vue-property-decorator";

import colors from "@/components/utils/IdenticonColors";

@Component({
    name: "Identicon",

    watch: {
		value() {
			this.generate(this.value);
		},
	}
})
export default class Identicon extends Vue {
    @Prop({
        type: String,
        required: true,
    })
    value;

    @Prop({
        type: Number,
        required: true,
    })
    size;

    @Prop({
        type: String,
        required: false,
        default: () => "circle",
    })
    shape;

    @Prop({
        type: Number,
        required: false,
        default: 3,
    })
    shapeCount;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isDark;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    showNetworkSymbol;

    rectangles = [];
    logo = null;
    backgroundColor = "";

    get networkSymbol() {
        return this.session_network && this.session_network.symbol.length ? this.session_network.symbol[0] : "";
    }

    get maskId() {
        return Math.random().toString(36).substring(9);
    }

    created() {
		this.generate(this.value);
	}

    generate(value) {
        this.rectangles = [];

        // Change string to a hash
        const hash = crypto.createHash("sha1").update(Buffer.from(value, "utf8")).digest("binary");
        // Change hash into a 32 bit int for our seed
        const seed =
            (hash.charCodeAt(0) << 24) |
            (hash.charCodeAt(1) << 16) |
            (hash.charCodeAt(2) << 8) |
            hash.charCodeAt(3);
        const generator = new MersenneTwister(seed);
        const remainingColors = this.hueShift(colors.slice(), generator);
        this.backgroundColor = this.genColor(remainingColors, generator);

        for (let i = 0; i < this.shapeCount; i++) {
            this.rectangles.push(this.genShape(generator, remainingColors, 100, i, this.shapeCount));
        }
        this.logo = this.genShape(generator, remainingColors, 100, 1, this.shapeCount);
    }

    genShape(generator, remainingColors, diameter, i, total) {
        const center = diameter / 2;
        const width = diameter;
        const height = diameter;

        const firstRot = generator.random();
        const angle = Math.PI * 2 * firstRot;
        const velocity = (diameter / total) * generator.random() + (i * diameter) / total;

        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        const translate = "translate(" + tx + " " + ty + ")";

        // Third random is a shape rotation on top of all of that.
        const secondRot = generator.random();
        const rot = firstRot * 360 + secondRot * 180;
        const rotate = "rotate(" + rot.toFixed(1) + " " + center + " " + center + ")";
        const transform = translate + " " + rotate;

        const fill = this.genColor(remainingColors, generator);

        return {
            id: i,
            width,
            height,
            transform,
            fill,
        };
    }

    genColor(colors, generator) {
        const idx = Math.floor(colors.length * generator.random());
        const color = colors.splice(idx, 1)[0];
        return color;
    }

    hueShift(colors, generator) {
        const wobble = 30;
        const amount = generator.random() * 30 - wobble / 2;
        return colors.map(function (hex) {
            const color = Color(hex);
            color.rotate(amount);
            return color.hex();
        });
    }
}
</script>

<style>
.Identicon__wrapper {
	@apply relative;
	font-size: 0;
}

.Identicon {
	overflow: hidden;
	padding: 0px;
	margin: 0px;
	display: inline-block;
}
</style>
