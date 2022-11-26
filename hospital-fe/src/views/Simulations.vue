<template>
  <div class="d-flex flex-row justify-space mb-6">
    <v-app-bar color="secondary" elevation="0" density="prominent">
      <v-app-bar-title> Inputs </v-app-bar-title>
      <v-container fluid>
        <v-row>
          <PatientSlider name-prop="Fever" style="width: 30px"></PatientSlider>
          <v-autocomplete
            clearable
            closable-chips
            label="Autocomplete"
            density="compact"
            :items="['Antibiotics', 'Aspirin', 'Insulin', 'Paracetamol']"
            multiple
            variant="underlined"
          ></v-autocomplete>
        </v-row>
      </v-container>
      <v-btn @click="refresh"
        ><v-icon icon="mdi-reload" class="ma-1"></v-icon>Randomize</v-btn
      >
      <v-btn @click="runQuarantine"
        ><v-icon icon="mdi-check" class="ma-1"></v-icon>Go!</v-btn
      >
    </v-app-bar>
    <!-- v-model="autoUpdate" -->
    <v-container fluid>
      <v-row>
        <v-switch
          color="green-lighten-2"
          hide-details
          label="Auto Update"
        ></v-switch>
        <v-btn @click="clearHistory"
          ><v-icon icon="mdi-close" class="ma-1"></v-icon>Clear history ({{
            resultsCount
          }}/10)</v-btn
        >
      </v-row>
    </v-container>
    <!-- <v-card max-width="500">
      <v-card-title> Patients: </v-card-title>
      <Patient :patients-prop="patients" />
      <v-card-title> Drugs: </v-card-title>
      <Drug :drugs-prop="drugs" />
      <v-card-actions> </v-card-actions>
    </v-card> -->
  </div>
  <v-container fluid>
    <v-row>
      <v-col v-for="simulation in results.slice().reverse()" cols="auto">
        <v-card
          ><v-card-title> Patients before simulation: </v-card-title>
          <Patient :patients-prop="simulation.patientsBefore" />
          <v-card-title> Drugs: </v-card-title>
          <Drug :drugs-prop="simulation.drugs" />
          <v-card-title> Patients after simulation: </v-card-title>
          <Patient :patients-prop="simulation.patientsAfter"
        /></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Patient from "@/components/Patient.vue";
import PatientSlider from "@/components/PatientSlider.vue";
import Drug from "@/components/Drug.vue";
import * as us from "@/services/UserService";
import { reactive, ref, watchEffect } from "vue";
import { PatientsRegister } from "hospital-lib";
import { Quarantine } from "hospital-lib";

let drugs = ref<Array<string>>([""]);
let patients = ref<PatientsRegister>({ F: 0, H: 0, D: 0, T: 0, X: 0 });

let resultsCount = ref(0);
let results = ref<
  {
    patientsBefore: PatientsRegister;
    drugs: Array<string>;
    patientsAfter: PatientsRegister;
  }[]
>([]);

let polling: string | number | NodeJS.Timer | undefined;

function interval() {
  polling = setInterval(() => {
    refresh();
    runQuarantine();
  }, 3000);
}

function beforeDestroy() {
  clearInterval(polling);
}

function created() {
  interval();
}

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

  results.value.push({
    patientsBefore: patients.value,
    drugs: drugs.value,
    patientsAfter: experiment.report(),
  });
  if (resultsCount.value > 9) {
    results.value.shift();
  } else {
    resultsCount.value++;
  }
}

function clearHistory() {
  results.value = [];
  resultsCount.value = 0;
}
</script>
