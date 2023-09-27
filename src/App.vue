<template>
  <div id="app">
    <main class="participants" :class="{ 'is-empty': no_participants }">
      <ParticipantTile :uuid="participant.uuid" v-for="(participant, i) in participants" :key="i" />
      <div class="no-participants" v-if="no_participants">
        <p><strong>Commencez par ajouter un ou une participant(e) en cliquant sur le bouton en bas à gauche.</strong></p>
        <p>
          Ensuite, tapotez la tuile de quelqu'un lors qu'il ou elle commence à parler, et tapez à nouveau s'iel
          cesse.
        </p>
      </div>
    </main>
    <footer>
      <div class="actions">
        <button @click="add">
          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus-square" class="svg-inline--fa fa-plus-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path></svg>
          <span>Participant&middot;e</span>
        </button>
        <button @click="reset_times_confirm">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="history" class="svg-inline--fa fa-history fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z"></path></svg>
          <span>Compteurs à zéro</span>
        </button>
        <button @click="reset_confirm">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-slash" class="svg-inline--fa fa-user-slash fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M633.8 458.1L362.3 248.3C412.1 230.7 448 183.8 448 128 448 57.3 390.7 0 320 0c-67.1 0-121.5 51.8-126.9 117.4L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3zM96 422.4V464c0 26.5 21.5 48 48 48h350.2L207.4 290.3C144.2 301.3 96 356 96 422.4z"></path></svg>
          <span>Réinitialiser</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ParticipantTile from './components/ParticipantTile.vue'

export default {
  name: 'App',

  components: {
    ParticipantTile
  },

  data () {
    return {
      updateTask: null,
      lastTick: null
    }
  },

  computed: {
    ...mapState(['participants']),

    no_participants () {
      return Object.keys(this.participants).length === 0
    }
  },

  methods: {
    ...mapActions(['add_participant', 'add_participants', 'reset', 'reset_times', 'tick']),

    add (e) {
      const name = prompt('Comment doit-on l\'appeler ?')
      if (name) {
        this.add_participant(name)
      }
      e.target.blur()
    },

    reset_confirm (e) {
      if (confirm('Voulez-vous vraiment supprimer l\'intégralité des participant(e)s ?')) {
        this.reset()
      }
      e.target.blur()
    },

    reset_times_confirm (e) {
      if (confirm('Voulez-vous vraiment réinitialiser le temps de parole de l\'intégralité des participant(e)s ?')) {
        this.reset_times()
      }
      e.target.blur()
    },

    setup_update_task () {
      this.updateTask = setInterval(() => {
        if (this.lastTick !== null) {
          const now = Date.now()
          this.tick((now - this.lastTick) / 1000)
          this.lastTick = now
        } else {
          this.tick(0.5)
          this.lastTick = Date.now()
        }
      }, 500)
    }
  },

  mounted () {
    // Load participants from local storage
    const rawParticipants = localStorage.getItem('participants')
    if (!rawParticipants) return

    try {
      this.add_participants(JSON.parse(rawParticipants))
    } catch (e) {
      console.error('Unable to load saved participants', e)
    }

    // Tick twice a second
    this.setup_update_task()
  },

  beforeUpdate () {
    if (this.updateTask === null) {
      this.setup_update_task()
    }
  },

  beforeDestroy () {
    clearInterval(this.updateTask)
  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300&family=Fira+Sans:wght@300;400&display=swap')

html, body
  min-height: 100%
  height: 100%
  margin: 0
  padding: 0

%container
  @media screen and (min-width: 1024px)
    margin-left: auto
    margin-right: auto
    width: 1024px
    max-width: 1024px

#app
  font-family: 'Fira Sans', Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

  color: hsl(210, 24%, 16%)
  background-color: hsl(216, 33%, 97%)

  min-height: 100%

  display: flex
  flex-direction: column

  main.participants
    @extend %container

    &:not(.is-empty)
      display: grid
      grid-template-columns: repeat(2, 1fr)
      grid-gap: .4rem

    padding: .4rem
    flex: 4

    .no-participants
      margin: 16vh 1rem 1rem
      font-size: 1.2rem
      text-align: center
      color: hsl(276, 91%, 23%)

  footer
    background-color: hsl(262, 90%, 96%)

    .actions
      @extend %container

      display: grid
      grid-template-columns: repeat(3, 1fr)

      padding: 0

      button
        padding: .4rem 0 .2rem
        border: none
        display: flex
        flex-direction: column
        align-content: center
        align-items: center  // Safari alignment

        background-color: hsl(262, 90%, 96%)
        cursor: pointer

        transition: background-color .05s ease-in-out, color .1s ease-in-out

        &:hover
          background-color: hsl(262, 100%, 88%)

          svg, span
            color: hsl(276, 91%, 23%)

        svg
          display: block
          height: 24px

          color: hsl(274, 87%, 37%)

        span
          display: block
          margin-top: .2rem
          color: hsl(276, 91%, 23%)
          font-size: .87rem
</style>
