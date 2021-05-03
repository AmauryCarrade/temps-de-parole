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

    reset_time (state, uuid) {
      Vue.set(state.participants[uuid], 'elapsed', 0)
    },

    talk (state, { uuid, talking }) {
      Vue.set(state.participants[uuid], 'talking', talking)
    },

    tick (state, { uuid, timeSinceLastTick }) {
      Vue.set(state.participants[uuid], 'elapsed', state.participants[uuid].elapsed + timeSinceLastTick)
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

    reset_times (context) {
      context.dispatch('stop_talking')
      for (const uuid of Object.keys(context.state.participants)) {
        context.commit('reset_time', uuid)
      }
      context.dispatch('save')
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
      const wasTalking = context.state.participants[uuid].talking
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
      for (const uuid of Object.keys(context.state.participants)) {
        context.commit('talk', {
          uuid,
          talking: false
        })
      }
      context.dispatch('save')
    },

    tick (context, timeSinceLastTick) {
      for (const uuid of Object.keys(context.state.participants)) {
        if (context.state.participants[uuid].talking) {
          context.commit('tick', { uuid, timeSinceLastTick })
        }
      }
      context.dispatch('save')
    }
  }
})
