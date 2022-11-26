<template>
  <v-slider
    :label="nameProp"
    v-model="slider"
    class="align-center"
    dense
    :max="max"
    :min="min"
  >
    <template v-slot:append>
      <v-text-field
        v-model="slider"
        dense
        type="number"
        style="width: 70px"
      ></v-text-field>
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { ref } from "vue";

export interface Props {
  nameProp: string;
}
const props = defineProps<Props>();

let min: 0;
let max: 20;
let slider = ref(10);
</script>
