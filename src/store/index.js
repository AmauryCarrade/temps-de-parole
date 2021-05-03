import Vue from 'vue'
import Vuex from 'vuex'

import { v4 as uuidv4 } from 'uuid'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    participants: {}
  },
  mutations: {
    add_participants (state, participants) {
      state.participants = participants
    },

    add_participant (state, name) {
      const uuid = uuidv4()

      Vue.set(state.participants, uuid, {
        uuid,
        name,
        elapsed: 0,
        talking: false
      })
    },

    remove_participant (state, uuid) {
      Vue.set(state.participants, uuid, undefined)
    },

    reset (state) {
      state.participants = {}
    },

    talk (state, { uuid, talking }) {
      Vue.set(this.state.participants[uuid], 'talking', talking)
    },

    tick_one_second (date, uuid) {
      Vue.set(this.state.participants[uuid], 'elapsed', this.state.participants[uuid].elapsed + 1)
    }
  },

  actions: {
    save (context) {
      localStorage.setItem('participants', JSON.stringify(context.state.participants))
    },

    reset (context) {
      context.commit('reset')
      localStorage.removeItem('participants')
    },

    add_participants (context, participants) {
      context.commit('add_participants', participants)
    },

    add_participant (context, name) {
      context.commit('add_participant', name || 'Sans nom')
      context.dispatch('save')
    },

    remove_participant (context) {
      context.commit('remove_participant')
      context.dispatch('save')
    },

    toggle_talk (context, uuid) {
      const wasTalking = this.state.participants[uuid].talking
      context.dispatch('stop_talking')

      if (!wasTalking) {
        context.commit('talk', {
          uuid,
          talking: true
        })
      }
      context.dispatch('save')
    },

    stop_talking (context) {
      for (const uuid of Object.keys(this.state.participants)) {
        context.commit('talk', {
          uuid,
          talking: false
        })
      }
      context.dispatch('save')
    },

    tick_every_second (context) {
      for (const uuid of Object.keys(this.state.participants)) {
        if (this.state.participants[uuid].talking) {
          context.commit('tick_one_second', uuid)
        }
      }
      context.dispatch('save')
    }
  }
})
