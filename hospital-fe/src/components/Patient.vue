<template>
  <v-responsive>
    <span class="ma-2" v-if="patientsProp['F'] >0">Fever: {{ patientsProp["F"] }}</span>
    <span class="ma-2" v-if="patientsProp['D'] >0">Diabete: {{ patientsProp["D"] }}</span>
    <span class="ma-2" v-if="patientsProp['T'] >0">Tuberculosis: {{ patientsProp["T"] }}</span>
    <span class="ma-2" v-if="patientsProp['H'] >0">Healthy: {{ patientsProp["H"] }}</span>
    <span class="ma-2" v-if="patientsProp['X'] >0">Dead: {{ patientsProp["X"] }}</span>
  </v-responsive>
</template>

<script setup lang="ts">
import { PatientsRegister } from "hospital-lib";
import { computed } from "vue";

export interface Props {
  patientsProp: PatientsRegister;
}
const props = defineProps<Props>();

// const formatedPatients = computed(() => formatPatients(props.patientsProp));

// function formatPatients(list: string) {
//   let patients: PatientsRegister = { F: 0, H: 0, D: 0, T: 0, X: 0 };
//   list.split(",").forEach((patient) => {
//     console.log(formatedPatients);
//     console.log(props);
//     switch (patient) {
//       case "F":
//         patients["F"]++;
//         break;
//       case "D":
//         patients["D"]++;
//         break;
//       case "T":
//         patients["T"]++;
//         break;
//       case "H":
//         patients["H"]++;
//         break;
//       case "X":
//         patients["X"]++;
//         break;
//     }
//   });
//   return patients;
// }
</script>
