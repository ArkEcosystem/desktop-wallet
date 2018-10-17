<template>
  <div
    :style="{ background: backgroundColor, height: `${size}px`, width: `${size}px` }"
    class="Identicon"
  >
    <svg
      :width="size"
      :height="size"
      x="0"
      y="0"
    >
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
    </svg>
  </div>
</template>

<script>
const MersenneTwister = require('mersenne-twister')
const Color = require('color')
const colors = require('@/components/utils/IdenticonColors')
const crypto = require('crypto')

export default {
  name: 'Identicon',

  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    shapeCount: {
      type: Number,
      required: false,
      default: 3
    }
  },

  data: () => ({
    rectangles: [],
    backgroundColor: ''
  }),

  created () {
    // Change string to a hash
    const hash = crypto.createHash('sha1').update(Buffer.from(this.value, 'utf8')).digest('binary')
    // Change hash into a 32 bit int for our seed
    const seed = (hash.charCodeAt(0) << 24) | (hash.charCodeAt(1) << 16) | (hash.charCodeAt(2) << 8) | hash.charCodeAt(3)
    const generator = new MersenneTwister(seed)
    const remainingColors = this.hueShift(colors.slice(), generator)
    this.backgroundColor = this.genColor(remainingColors, generator)
    for (var i = 0; i < this.shapeCount; i++) {
      this.rectangles.push(this.genShape(generator, remainingColors, this.size, i, this.shapeCount))
    }
  },

  methods: {
    genShape (generator, remainingColors, diameter, i, total) {
      const center = diameter / 2
      const width = diameter
      const height = diameter

      var firstRot = generator.random()
      var angle = Math.PI * 2 * firstRot
      var velocity = diameter / total * generator.random() + (i * diameter / total)

      const tx = (Math.cos(angle) * velocity)
      const ty = (Math.sin(angle) * velocity)

      const translate = 'translate(' + tx + ' ' + ty + ')'

      // Third random is a shape rotation on top of all of that.
      const secondRot = generator.random()
      const rot = (firstRot * 360) + secondRot * 180
      const rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
      const transform = translate + ' ' + rotate

      const fill = this.genColor(remainingColors, generator)

      return {
        id: i,
        width: width,
        height: height,
        transform: transform,
        fill: fill
      }
    },

    genColor (colors, generator) {
      const idx = Math.floor(colors.length * generator.random())
      const color = colors.splice(idx, 1)[0]
      return color
    },

    hueShift (colors, generator) {
      const wobble = 30
      const amount = (generator.random() * 30) - (wobble / 2)
      return colors.map(function (hex) {
        var color = Color(hex)
        color.rotate(amount)
        return color.hex()
      })
    }
  }
}

</script>

<style>
.Identicon {
  border-radius: 100%;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  display: inline-block;
}
</style>
