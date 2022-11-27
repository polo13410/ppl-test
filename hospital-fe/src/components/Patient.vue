<template>
  <v-responsive>
    <v-row class="mx-3">
      <div v-for="key in Object.keys(dicDiseases)" class="pa-0">
      <v-col v-if="patientsProp[key]" cols="auto">
        <p class="font-weight-regular body-1 mx-2" >
          {{ dicDiseases[key] }} : {{patientsProp[key]}}
        </p>
      </v-col>
    </div>
    </v-row>
  </v-responsive>
</template>

<script setup lang="ts">
import { PatientsRegister } from "hospital-lib";

export interface Props {
  patientsProp: PatientsRegister;
  dicDiseases: { [key: string]: string };
}
const props = defineProps<Props>();
</script>
