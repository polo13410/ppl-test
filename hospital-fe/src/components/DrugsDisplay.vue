<template>
  <v-responsive>
    <v-row class="mx-3">
      <v-col v-for="drug in drugsProp" cols="auto" class="">
        <p class="font-weight-regular body-1 mx-2">
          {{ dicDrugsName[drug] }}
        </p>
      </v-col>
      <v-col v-if="drugsProp.length === 0"><p>None</p></v-col>
    </v-row>
  </v-responsive>
</template>

<script setup lang="ts">
import { dicDrugsName } from "hospital-lib"
export interface Props {
  drugsProp: Array<string>;
}
const props = defineProps<Props>();
</script>
