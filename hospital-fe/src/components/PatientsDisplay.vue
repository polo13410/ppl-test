<template>
  <v-responsive>
    <v-row class="mx-3">
      <div v-for="key in Object.keys(dicStatusName)" class="pa-0">
      <v-col v-if="patients[key]" cols="auto">
        <p class="font-weight-regular body-1 mx-2" >
          {{ dicStatusName[key] }} : {{patients[key]}}
        </p>
      </v-col>
    </div>
    </v-row>
  </v-responsive>
</template>

<script setup lang="ts">
import { PatientsRegister, dicStatusName } from "hospital-lib";

export interface Props {
  patients: PatientsRegister;
}
const props = defineProps<Props>();

</script>
