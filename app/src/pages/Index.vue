<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
  </q-page>
</template>

<script>
const {ipcRenderer} = require('electron')

export default {
  name: 'PageIndex',
  mounted: function () {
	console.log(ipcRenderer.sendSync('synchronous-message', 'initOnce')) 
	console.log(ipcRenderer.sendSync('synchronous-message', 'getMvnTypes'))
  }
}
</script>
