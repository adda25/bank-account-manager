<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
let coms = require('./custom/coms')

export default {
  name: 'App',
  methods: {
  	fetch () {
  		coms.send('initOnce', null, function (res) {}.bind(this))
  		coms.send('getMvnTypes', null, function (res) {
  			this.$store.commit('setMvnType', res)
  		}.bind(this))
  		coms.send('getAccountUnits', null, function (res) {
  			this.$store.commit('setAccountUnits', res)
  		}.bind(this))
  		coms.send('getAccountTypes', null, function (res) {
  			this.$store.commit('setAccountTypes', res)
  		}.bind(this))
  	}
  },
  mounted () {
  	this.fetch()
  }
}
</script>
<style lang="scss">
$navbar_color: #343434 !important;
$sidebar_color: #383838 !important;
$view_color: #303030 !important;
$card_color: #383838 !important;
$pink: #D73965;

.pink {
	color: $pink !important;	
}

.navbar {
	background-color: $navbar_color;
}

.sidebar {
	background-color: $sidebar_color;	
	min-height: 100vh;
	color: white;
}

.view {
	background-color: $view_color;	
}

.card {
	background-color: $card_color;
	color: white;
	//border: 1px solid $pink;
}

.caption {
	color: lightgray !important;	
}
</style>
