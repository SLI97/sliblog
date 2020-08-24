import Vuex from 'vuex'
import Vue from 'vue'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex);

export function createStore() {
	return new Vuex.Store({
		state: {
			id: '',
			account: '',
			name: '',
			avatar: '',
			// token: getToken(),
		},
		getters,
		mutations,
		actions
	})
}

