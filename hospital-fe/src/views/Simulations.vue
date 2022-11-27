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
          color="secondary"
        ></v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto"
        ><v-btn @click="btnRandomizeClick">
          <v-icon icon="mdi-reload" color="warning" class="ma-1"></v-icon>
          Randomize
        </v-btn>
      </v-col>
      <v-col cols="auto"
        ><v-btn @click="btnGoClick" color="success">
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
          color="secondary"
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
          ><v-card-title class="text-h6">
            Before simulation:
          </v-card-title>

          <v-card-text class="pa-0">
            <Patient
              :dic-diseases="diseasesDefine"
              :patients-prop="simulation.patientsBefore"
          /></v-card-text>
          <v-card-title class="text-h6"> Drugs: </v-card-title>
          <v-card-text class="pa-0">
            <Drug :dic-drugs="drugsDefine" :drugs-prop="simulation.drugs"
          /></v-card-text>
          <v-card-title class="text-h6">
            After simulation:
          </v-card-title>
          <v-card-text class="px-0 pt-0">
            <Patient
              :dic-diseases="diseasesDefine"
              :patients-prop="simulation.patientsAfter" /></v-card-text
        ></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Patient from "@/components/Patient.vue";
import PatientSlider from "@/components/PatientSlider.vue";
import Drug from "@/components/Drug.vue";
import * as us from "@/services/UserService";
import { ref } from "vue";
import { PatientsRegister } from "hospital-lib";
import { Quarantine } from "hospital-lib";

//cache from API and variables for experiments
let drugs = ref<Array<string>>([]);
let patients = ref<PatientsRegister>({});

//Const from lib
let experiment = new Quarantine(patients.value); //init instance
let diseasesDefine = experiment.dicDiseasesName;
let drugsDefine = experiment.dicDrugsName;

//Props for inputs
let patientsSliders = ref<{ key: string; name: string; value: number }[]>([]);
let selectedDrugs = ref<Array<string>>([]);

//Input: Autocomplete list
let drugsList: string[] = [];

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
let intervalAutoRun = ref(1); //in seconds

//Inits inputs with every possible diseases
Object.keys(diseasesDefine).forEach((key) => {
  //fill with every diseases key, name, and value
  patientsSliders.value.push({
    key: key,
    name: diseasesDefine[key],
    value: Math.floor(Math.random() * 10),
  });
});

//Inits inputs with every possible drugs
Object.keys(drugsDefine).forEach((key) => {
  drugsList.push(drugsDefine[key]);
});

//Catch the updSlider event
function handleUpdSlider(event: { key: string; value: number }) {
  let temp = patientsSliders.value.find((v) => v.key == event.key);
  if (temp != undefined) temp.value = event.value;
}

function btnRandomizeClick() {
  randomizeInputs();
}

async function randomizeInputs() {
  await getDataFromService();
  Object.keys(patients.value).forEach((key) => {
    let temp = patientsSliders.value.find((v) => v.key == key);
    if (temp != undefined) temp.value = patients.value[key];
  });
  selectedDrugs.value = [];
  drugs.value.forEach((drug) => {
    if (drug == "") return;
    selectedDrugs.value.push(drugsDefine[drug]);
  });
}

async function getDataFromService() {
  patients.value = await us.fetchPatients();
  drugs.value = await us.fetchDrugs();
}

function btnGoClick() {
  let tDrugsList: Array<string> = [];
  selectedDrugs.value.forEach((name) => {
    let temp = Object.keys(drugsDefine).find((key) => drugsDefine[key] == name);
    if (temp != undefined) tDrugsList.push(temp);
  });
  drugs.value = tDrugsList;
  patientsSliders.value.forEach((p) => {
    patients.value[p.key] = p.value;
  });
  runSimulation();
}

function runSimulation() {
  experiment = new Quarantine(patients.value); //init instance with patient register
  experiment.setDrugs(drugs.value);
  experiment.wait40Days(); //Doing the maths
  //Adding the iteration in the array
  simulations.value.push({
    patientsBefore: patients.value,
    drugs: drugs.value,
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
    getDataFromService(); //Init refresh
    timerAutoRun = setInterval(() => {
      runSimulation();
      getDataFromService();
    }, intervalAutoRun.value * 1000);
  } else {
    clearInterval(timerAutoRun);
  }
}
</script>
