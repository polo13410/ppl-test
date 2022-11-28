<template>
  <v-container class="pt-6" fluid>
    <v-row>
      <div class="text-h5 mb-3">Inputs</div>
    </v-row>
    <v-row>
      <v-col cols="auto" v-for="slider in patientsSliders">
        <PatientSlider
          @updSlider="handleUpdSlider"
          :slider-prop="slider"
        ></PatientSlider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-autocomplete
          auto-select-first
          clearable
          chips
          closable-chips
          multiple
          variant="underlined"
          label="Drugs"
          density="comfortable"
          :items="drugsList"
          style="min-width: 300px"
          v-model="selectedDrugs"
          color="secondary-darken-1"
        ></v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto"
        ><v-btn @click="randomizeInputs">
          <v-icon icon="mdi-reload" color="warning" class="ma-1"></v-icon>
          Randomize
        </v-btn>
      </v-col>
      <v-col cols="auto"
        ><v-btn @click="runCustomSimulation" color="success">
          <v-icon icon="mdi-check" class="ma-1"></v-icon>
          Go!
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="mb-5"></v-divider>
    <v-row>
      <v-col cols="auto">
        <v-switch
          v-model="isAutoRun"
          @update:model-value="autoRunToggle"
          color="success"
          hide-details
          label="Auto run random"
        ></v-switch>
      </v-col>
      <v-col cols="auto">
        <v-autocomplete
          :disabled="isAutoRun"
          label="Interval"
          density="compact"
          :items="[1, 5, 10, 30, 60]"
          suffix="s"
          variant="underlined"
          style="min-width: 50px"
          color="secondary-darken-1"
          v-model="intervalAutoRun"
        ></v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn
          @click="
            {
              simulations = [];
              simulationsDisplayed = 0;
            }
          "
          ><v-icon icon="mdi-close" class="ma-1" color="error"></v-icon>Clear
          history ({{ simulationsDisplayed }}/10)</v-btn
        ></v-col
      >
    </v-row>
    <v-divider class="mb-5"></v-divider>
  </v-container>
  <v-container fluid>
    <v-row>
      <div class="text-h5 mb-3">Results</div>
    </v-row>
    <v-row>
      <v-col v-for="simulation in simulations.slice().reverse()" cols="auto">
        <v-card
          ><v-card-title class="text-h6"> Before simulation: </v-card-title>
          <v-card-text class="pa-0">
            <PatientsDisplay :patients="simulation.patientsBefore"
          /></v-card-text>
          <v-card-title class="text-h6"> Drugs: </v-card-title>
          <v-card-text class="pa-0">
            <DrugsDisplay
              :dic-drugs="dicDrugsName"
              :drugs-prop="simulation.drugs"
          /></v-card-text>
          <v-card-title class="text-h6"> After simulation: </v-card-title>
          <v-card-text class="px-0 pt-0">
            <PatientsDisplay
              :patients="simulation.patientsAfter" /></v-card-text
        ></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import PatientsDisplay from "@/components/PatientsDisplay.vue";
import PatientSlider from "@/components/PatientSlider.vue";
import DrugsDisplay from "@/components/DrugsDisplay.vue";
import * as us from "@/services/UserService";
import { onMounted, ref } from "vue";
import {
  PatientsRegister,
  Quarantine,
  dicDrugsName,
  dicStatusName,
} from "hospital-lib";

//cache from API and variables for experiments
// let drugs: Array<string> = [];
// let patients: PatientsRegister = {};

//Prop for sliders
let patientsSliders = ref<{ key: string; name: string; value: number }[]>([]);

//Input autocomplete list
let drugsList: string[] = [];
let selectedDrugs = ref<Array<string>>([]);

//Results
let maxSimulationsDisplayed = 10;
let simulationsDisplayed = ref(0);
let simulations = ref<
  {
    patientsBefore: PatientsRegister;
    drugs: Array<string>;
    patientsAfter: PatientsRegister;
  }[]
>([]);

//Autorun
let isAutoRun = ref(false);
let timerAutoRun: NodeJS.Timer;
let intervalAutoRun = ref(30); //in seconds

//Catch the updSlider event
function handleUpdSlider(event: { key: string; value: number }) {
  let temp = patientsSliders.value.find((v) => v.key === event.key);
  if (temp !== undefined) temp.value = event.value;
}

onMounted(() => {
  initInputs();
});

async function initInputs() {
  //Get data from api
  let apiData = await getDataFromService();
  //Inits inputs with every possible diseases
  Object.keys(dicStatusName).forEach((key) => {
    //fill with every patient key, name, and value (by API)
    patientsSliders.value.push({
      key: key,
      name: dicStatusName[key],
      value: apiData.patients[key],
    });
  });

  //Inits inputs with every possible drugs
  Object.keys(dicDrugsName).forEach((key) => {
    drugsList.push(dicDrugsName[key]);
  });

  //Select drugs given by the API
  selectedDrugs.value = [];
  apiData.drugs.forEach((drug) => {
    selectedDrugs.value.push(dicDrugsName[drug]);
  });
}

async function randomizeInputs() {
  let apiData = await getDataFromService();
  let temp = getDataFromService();

  patientsSliders.value.forEach((slider) => {
    slider.value =
      apiData.patients[slider.key] === undefined
        ? 0
        : apiData.patients[slider.key];
  });

  //Select drugs given by the API
  selectedDrugs.value = [];
  apiData.drugs.forEach((drug) => {
    selectedDrugs.value.push(dicDrugsName[drug]);
  });
}

async function getDataFromService() {
  let patients = await us.fetchPatients();
  let drugs = await us.fetchDrugs();
  return { patients, drugs };
}

function runCustomSimulation() {
  let patients: PatientsRegister = {};
  let drugs: Array<string> = [];

  patientsSliders.value.forEach((p) => {
    patients[p.key] = p.value;
  });

  selectedDrugs.value.forEach((name) => {
    let temp = Object.keys(dicDrugsName).find(
      (key) => dicDrugsName[key] === name
    );
    if (temp != undefined) drugs.push(temp);
  });
  runSimulation(patients, drugs);
}

function runSimulation(patients: PatientsRegister, drugs: Array<string>) {
  let experiment = new Quarantine(patients); //init instance with patient register
  experiment.setDrugs(drugs);
  experiment.wait40Days(); //Doing the maths
  //Adding the iteration in the array
  simulations.value.push({
    patientsBefore: patients,
    drugs: drugs,
    patientsAfter: experiment.report(),
  });

  //Checking max value of history
  if (simulationsDisplayed.value >= maxSimulationsDisplayed) {
    //Delete first item
    simulations.value.shift();
  } else {
    simulationsDisplayed.value++;
  }
}

function autoRunToggle() {
  if (isAutoRun.value) {
    timerAutoRun = setInterval(async () => {
      let dataApi = await getDataFromService();
      runSimulation(dataApi.patients, dataApi.drugs);
    }, intervalAutoRun.value * 1000);
  } else {
    clearInterval(timerAutoRun);
  }
}
</script>
