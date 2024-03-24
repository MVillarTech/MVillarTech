<script setup> // Consola
  import {ref, computed, watch} from 'vue'
  import Header from './components/Header.vue'
  import Button from './components/Button.vue'
  import {calcularTotalPagar} from './helpers'

  const cantidad = ref(10000);
  const meses = ref(6);
  const total = ref(0);
  const MIN = 0;
  const MAX = 20000;
  const STEP = 100;

  const formatearDinero = (valor) => {
    const formatter = new Intl.NumberFormat('de-EU',{
      style: 'currency',
      currency: 'EUR'
    });

    return formatter.format(valor);
  };

  watch([cantidad, meses], () => {
    total.value = calcularTotalPagar(cantidad.value, meses.value)
  });

  const pagoMensual = computed(() => {
    return total.value / meses.value
  });

  const formatearDinero2 = () => {
    const formatter = new Intl.NumberFormat('de-EU',{
      style: 'currency',
      currency: 'EUR'
    });

    return formatter.format(total.value);
  };

  const handleChangeDecremento = () => {
    const valor = cantidad.value - STEP;
    if(valor < MIN) {
      alert('La cantidad no es valida');
      return;
    }
    cantidad.value = valor;
  }

  const handleChangeIncremento = () => {
    const valor = cantidad.value + STEP;
    if(valor > MAX) {
      alert('La cantidad no es valida');
      return;
    }
    cantidad.value = valor;
  }


</script>

<template>  <!-- Pantalla  -->
  <div class="my-20 max-w-lg mx-auto bg-white shadow p-10">
    <Header />

    <div class="flex justify-between mt-10">
    
      <Button 
        :operador="'-'"
        @fn="handleChangeDecremento"
      />
      <Button 
      :operador="'+'"
      @fn="handleChangeIncremento"
      />

    </div>

    <div class="my-5 ">
      <input 
        type="range"
        class="w-full bg-white accent-orange-500 hover:accent-orange-600"
        :min="MIN" 
        :max="MAX"
        :step="STEP"
        v-model.number="cantidad"
      >   <!-- Los 2 puntos al inicio de las clases significan que son dinamicos, es decir, que pueden cambiar  -->


      <p class="text-center my-10 text-5xl font-extrabold text-orange-500"> 
        {{ formatearDinero(cantidad) }} 
      </p> <!-- Para imprimir una variable  -->

      <h2 class="text-2xl font-extrabold text-black text-center">
        Elige un <span class="text-orange-500">plazo</span> a pagar
      </h2>

      <select 
        class="w-full p-2 bg-orange-500 border border-black rounded-lg text-center text-xl font-bold text-black mt-5"
        :value="meses"
        v-model.number="meses"
      >
          <option value="6">6 meses</option>
          <option value="12">12 meses</option>
          <option value="24">24 meses</option>
      </select>
    </div>

    <div v-if="total > 0" class="my-5 space-y-3 bg-blue-500 p-5">
      <h2 class="text-2xl font-extrabold  text-blac-500 text-center">
        Resumen <span class="text-orange-500">de pagos</span>
      </h2>

      <p class="text-xl text-black text-center font-bold">{{meses}} Meses</p>
      <p class="text-xl text-black  text-center font-bold">Total a pagar: {{formatearDinero(total) }}</p>
      <p class="text-xl text-black  text-center font-bold">Mensualidades: {{formatearDinero(pagoMensual)}}</p>
    </div>

    <p v-else class="text-xl text-center font-bold">Añade una cantidad y un plazo a pagar</p>
  </div>
</template>

