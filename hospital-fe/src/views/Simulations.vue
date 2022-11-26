<template>
  <div class="d-flex flex-column justify-center mb-6">
    <div class="mt-4 text-title">Input</div>
    <v-card max-width="500">
      <v-card-title> Patients: </v-card-title>
      <Patient :patients-prop="patients" />
      <v-card-title> Drugs: </v-card-title>
      <Drug :drugs-prop="drugs" />
      <v-card-actions>
        <v-btn @click="refresh">Refresh</v-btn>
        <v-btn @click="runQuarantine">Launch simulation</v-btn>
      </v-card-actions>
    </v-card>
  </div>
  <div>
    <div class="mt-4 text-title">History ({{ resultsCount }}/10 results)</div>
    <v-card
      max-width="500"
      class="ma-10"
      v-for="simulation in results.slice().reverse()"
    >
      <v-card-title> Patients before simulation: </v-card-title>
      <Patient :patients-prop="simulation.patientsBefore" />
      <v-card-title> Drugs: </v-card-title>
      <Drug :drugs-prop="simulation.drugs" />
      <v-card-title> Patients after simulation: </v-card-title>
      <Patient :patients-prop="simulation.patientsBefore" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Patient from "@/components/Patient.vue";
import Drug from "@/components/Drug.vue";
import * as us from "@/services/UserService";
import { ref } from "vue";
import { PatientsRegister } from "hospital-lib";
import { Quarantine } from "hospital-lib";

let drugs = ref<Array<string>>(["None"]);
let patients = ref<PatientsRegister>({ F: 0, H: 0, D: 0, T: 0, X: 0 });

let results = ref<
  {
    patientsBefore: PatientsRegister;
    drugs: Array<string>;
    patientsAfter: PatientsRegister;
  }[]
>([]);

let resultsCount = 0;

function refresh() {
  getDrugs();
  getPatients();
}

async function getDrugs() {
  drugs.value = await us.fetchDrugs();
}

async function getPatients() {
  patients.value = await us.fetchPatients();
}

function runQuarantine() {
  let experiment = new Quarantine(patients.value);
  experiment.setDrugs(drugs.value);
  experiment.wait40Days();
  experiment.report();
  results.value.push({
    patientsBefore: patients.value,
    drugs: drugs.value,
    patientsAfter: experiment.report(),
  });
  if (resultsCount > 9) {
    results.value.shift();
  } else {
    resultsCount++;
  }
}
</script>
