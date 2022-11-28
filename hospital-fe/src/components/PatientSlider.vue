<template>
  <v-slider
    :label="sliderProp.name + ': ' + sliderProp.value"
    v-model="sliderProp.value"
    class="align-center"
    :max="max"
    :min="min"
    step="1"
    thumb-label
    style="min-width: 300px"
    color="secondary-darken-1"
    @update:model-value="updateSliderValue"
  >
  </v-slider>
</template>

<script lang="ts" setup>

export interface Props {
  sliderProp: {
    key: string;
    name: string;
    value: number;
  };
}
const props = defineProps<Props>();

const emit = defineEmits(["updSlider"]);

let min = 0;
let max = 10;

function updateSliderValue() {
  emit("updSlider", {key: props.sliderProp.key, value: props.sliderProp.value});
}
</script>
