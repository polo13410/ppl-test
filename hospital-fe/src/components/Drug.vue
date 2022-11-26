<template>
  <v-responsive>
    <span> </span>
    <span class="ma-2" v-for="drug in drugsProp">{{ drug }}</span>
  </v-responsive>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

export interface Props {
  drugsProp: Array<string>;
}
const props = defineProps<Props>();

</script>
