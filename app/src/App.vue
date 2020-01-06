<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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
