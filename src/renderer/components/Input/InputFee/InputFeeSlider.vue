<template>
  <div class="relative mt-4">
    <div
      :style="gradientWidthStyle"
      class="gradient-background absolute h-full w-full"
    />
    <p
      class="absolute"
      style="left: 0%; top: -50%;"
    >
      {{ fee / 100000000 }} &#1127;
    </p>
    <input
      :value="fee"
      :max="max"
      :min="min"
      type="range"
      class="w-full m-0 py-2"
      name="fee"
      @input="$emit('fee-select', $event.target.value)"
    >
    <p
      class="absolute"
      style="right: 0%; top: -50%;"
    >
      <span @click="$emit('fee-select', min)">Min</span> | <span @click="$emit('fee-select', avg)">Average</span> | <span @click="$emit('fee-select', max)">Max</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'InputFeeSlider',

  model: {
    prop: 'fee',
    event: 'fee-select'
  },

  props: {
    fee: {
      type: Number,
      required: true
    },

    max: {
      type: Number,
      required: false,
      default: 100
    },

    min: {
      type: Number,
      required: false,
      default: 1
    },

    avg: {
      type: Number,
      required: false,
      default: 50
    }
  },

  computed: {
    gradientWidthStyle () {
      let percent = this.fee / this.max * 100

      if (percent > 100) {
        percent = 100
      }

      return {
        width: `${percent}%`
      }
    }
  }
}
</script>

<style scoped>

.fee-slider-container {
  width: 50%;
  margin: 0 auto;
}

.gradient-background {
  top: -50%;
  left: 0;
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3b9be5+0,c9cce2+100&0.01+1,1+99 */
  background: -moz-linear-gradient(top, rgba(59,155,229,0.01) 0%, rgba(60,155,229,0.01) 1%, rgba(200,204,226,1) 99%, rgba(201,204,226,1) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, rgba(59,155,229,0.01) 0%,rgba(60,155,229,0.01) 1%,rgba(200,204,226,1) 99%,rgba(201,204,226,1) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, rgba(59,155,229,0.01) 0%,rgba(60,155,229,0.01) 1%,rgba(200,204,226,1) 99%,rgba(201,204,226,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#033b9be5', endColorstr='#c9cce2',GradientType=0 ); /* IE6-9 */
}

input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-webkit-slider-thumb {
   height: 1.2rem;
  width: 1.2rem;
  border-radius: 40%;
  border: 0px transparent;
  background: blue;
  cursor: pointer;
  position: relative;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 50%;
  height: 5px;
  color: black;
  cursor: pointer;
  border-radius: 1.3px;
  border: black 2px;
}

input[type=range]::-moz-range-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  border: black 2px;
  border-radius: 1.3px;
}

</style>
