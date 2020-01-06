<template>
  <div class="flex flex-center q-pa-md">
    <q-card class="q-pa-md card" style="width: 100%;">
    	<p><i>Add account to registry</i></p>
    	<div class="row">
        <div class="col-6 col-md-6 q-pa-md">
            <q-select
              filled
              dark
              dense
              color="pink"
              v-model="account.at_id"
              use-input
              input-debounce="0"
              label="Account Type"
              :options="accountTypes.model"
              @filter="filterAccountType"
              
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
        </div>
        <div class="col-6 col-md-6 q-pa-md">
            <q-select
              filled
              dark
              dense
              color="pink"
              v-model="account.au_id"
              use-input
              input-debounce="0"
              label="Account Unit"
              :options="accountUnits.model"
              @filter="filteraAccountUnit"
              
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-12 q-pa-md">
          <q-input filled dense dark color="pink" label="Account name" v-model="account.name"></q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-4 col-md-4 q-pa-md">
          <q-input
            dark
            filled
            dense
            color="orange"
            v-model.number="account.min_value"
            type="number"
            label="Min value (Opt)"
            style="width: 100%"
          />
        </div>
        <div class="col-4 col-md-4 q-pa-md">
          <q-input
            dark
            filled
            dense
            color="orange"
            v-model.number="account.max_value"
            type="number"
            label="Max value (Opt)"
            style="width: 100%"
          />
        </div>
        <div class="col-4 col-md-4 q-pa-md">
          <q-btn size="md" color="pink" label="Save" v-on:click="save" style="min-width: 100%"></q-btn>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
let coms = require('../custom/coms')

export default {
  name: 'AccountAdd',
  data: function () {
  	return {
  		errorMessage: undefined,
  		accountTypes: {
  			map: undefined,
  			options: undefined,
  			model: undefined
  		},
  		accountUnits: {
  			map: undefined,
  			options: undefined,
  			model: undefined
  		},
  		account: {
  			au_id: undefined,
  			at_id: undefined,
        name: undefined,
        min_value: undefined,
        max_value: undefined,
  		}
  	}
  },
  methods: {
  	filteraAccountUnit (val, update) {
  		this.filter('accountUnits', val, update)
  	},
  	filterAccountType (val, update) {
  		this.filter('accountTypes', val, update)
  	},
  	filter (type, val, update) {
      if (val === '') {
        update(() => {
          this[type].options = this[type].map
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this[type].model = this[type].options.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
  	},

  	save () {
  		let copy = JSON.parse(JSON.stringify(this.account))
      copy.au_id = parseInt(copy.au_id.split('#')[0])
      copy.at_id = parseInt(copy.at_id.split('#')[0])
      let accounts = coms.send('createAccount', JSON.stringify(copy), function (res) {
        console.log(res)
      }.bind(this))
  	}
  },
  mounted: function () {
  	
  },
  beforeMount: function () {
    console.log('--->', this.$store.getters['accountUnits'])
  	this.accountTypes.map = this.$store.getters['accountTypes'].map(function (x) { return x.at_id.toString() + ' # ' + x.name.toUpperCase() }.bind(this))
  	this.accountTypes.options = this.accountTypes.map
  	this.accountTypes.model = this.accountTypes.map
  	//// wUnit
  	this.accountUnits.map = this.$store.getters['accountUnits'].map(function (x) { return x.au_id.toString() + ' # ' + x.unit.toUpperCase() }.bind(this))
  	this.accountUnits.options = this.accountUnits.map
  	this.accountUnits.model = this.accountUnits.map
  }
}
</script>
