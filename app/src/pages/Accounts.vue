<template>
  <div class="flex flex-center q-pa-md">
    <div class="row card q-pa-md" style="width: 100%; border-radius: 5px;">
      <div class="col-11 col-md-11 q-pa-md">
        <!--<Search :data="data" v-model="dataFiltered"/>-->
      </div>
      <div class="col-1 col-md-1 q-pa-md">
        <q-btn  size="md"  filled dark color="pink" label="Add" v-on:click="addAccount" style="min-width: 100%"></q-btn>
      </div>
    	</div>
   		<q-dialog full-width v-model="additemview">
   		  <q-card class="view" style="width: 700px; max-width: 80vw;">
   		  <AccountAdd  v-model="additemview"></AccountAdd>
   		  </q-card>
   		</q-dialog>
   		 <q-table
   		   dark
   		   dense
   		   color="pink"
   		   title="Accounts"
   		   :data="dataFiltered"
   		   :columns="columns"
   		   row-key="name"
   		   class="card"
   		   style="width: 100%; margin-top: 15px;"
   		   :pagination.sync="pagination"
   		 >
   		    <template v-slot:body="props">
   		       	<q-tr :props="props" class="cursor-pointer" @click.native="selectRow(props.row)">
   		      	<q-td key="a_id" :props="props" > {{ props.row.a_id }} </q-td>
   		       	<q-td key="name" :props="props" > {{ props.row.name }} </q-td>
   		       	<q-td key="type" :props="props" > {{ props.row.type }} </q-td>
   		      	<q-td key="unit" :props="props" > {{ props.row.unit }} </q-td>
   		      	</q-tr>
   		    </template>
   		</q-table>
  	</div>
  </div>
</template>

<script>
let coms = require('../custom/coms')
import AccountAdd from './AccountAdd'

export default {
  name: 'Accounts',
  data () {
  	return {
      	additemview: false,
      	pagination: {
      	  rowsPerPage: 15
      	},
  		columns: [
  		   	{ name: 'a_id', align: 'left', label: 'Account ID', field: 'a_id', sortable: true, headerClasses: 'pink text-white', classes: 'pink ellipsis', },
          	{ name: 'name', align: 'left', label: 'Name', 	field: 'name', sortable: true },
          	{ name: 'type', align: 'left', label: 'Type', 	field: 'type', sortable: true },
          	{ name: 'unit', align: 'left', label: 'Unit', 	field: 'unit', sortable: true },
  		],
  		data: undefined,
      	dataFiltered: undefined
  	}
  },
  components: {
  	AccountAdd
  },
  watch: {
    additemview: function (newVal, oldVal) {
      if (newVal === false) {
        this.fetch()
      }
    }
  },
  methods: {
    addAccount () {
      this.additemview = !this.additemview
      // this.$router.push({name: 'mvnadd', params: {warehouse_id: this.warehouse_id}})
    },
  	fetch () {
      	coms.send('getAccounts', null, function (res) {
      		console.log(res)
  			this.data = res
  			this.dataFiltered = this.data
  		}.bind(this))
  	},
    selectRow(row) {
    	this.$router.push({name: 'stockitem', params: {warehouse_id: row.warehouse_id}})
   	}
  },
  mounted () {
  	this.fetch()
  }
}
</script>
