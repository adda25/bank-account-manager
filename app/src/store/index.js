import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
  	state: {
  		mvnType: [],
  		accountUnits: [],
  		accountTypes: [],
  	},
  	mutations: {
  		setMvnType (state, mvnType) {
  			state.mvnType = mvnType
  		},
  		setAccountUnits (state, accountUnits) {
  			state.accountUnits = accountUnits
  		},
  		setAccountTypes (state, accountTypes) {
  			state.accountTypes = accountTypes
  		}
  	},
  	getters: {
  		mvnType: state => {
  			return state.mvnType
  		},
  		accountUnits: state => {
  			return state.accountUnits
  		},
  		accountTypes: state => {
  			return state.accountTypes	
  		}

  	},
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
