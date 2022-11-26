<template>
    <v-app>
      <v-main >
        <v-container class="fill-height">
          <Header />
          <Simulations />
        </v-container>
      </v-main>
    </v-app>
</template>

<script setup lang="ts">
import Simulations from "@/views/Simulations.vue";
import Header from "@/components/Header.vue";
</script>
