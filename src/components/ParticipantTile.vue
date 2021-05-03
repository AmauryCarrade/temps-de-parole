<template>
  <div class="participant-tile" :class="{ 'is-talking': participant.talking }" @click="toggle_talk(uuid)">
    <h1>{{ participant.name }}</h1>
    <p class="timer" :class="{ 'has-hours': has_hours }">{{ duration }}</p>
    <p class="percentage">{{ percentage !== null ? percentage : '— ' }}%</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    uuid: String
  },
  computed: {
    ...mapState(['participants']),

    participant () {
      return this.participants[this.uuid]
    },

    duration () {
      const dateElapsed = new Date(this.participant.elapsed * 1000)
      const hours = dateElapsed.getUTCHours()
      const minutes = dateElapsed.getUTCMinutes()
      const seconds = dateElapsed.getUTCSeconds()

      const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${formatted}`
      } else {
        return formatted
      }
    },

    has_hours () {
      return this.participant.elapsed >= 3600
    },

    percentage () {
      const total = Object.keys(this.participants).map(uuid => this.participants[uuid].elapsed).reduce((sum, elapsed) => sum + elapsed, 0)
      if (total === 0) return null
      return Math.ceil((this.participant.elapsed / total) * 100)
    }
  },

  methods: mapActions(['toggle_talk'])
}
</script>

<style scoped lang="sass">
.participant-tile
  display: flex
  flex-direction: column
  justify-content: space-between

  padding: .4rem 0

  border-radius: 4px
  background-color: hsl(276, 91%, 23%)
  color: hsl(262, 90%, 96%)

  text-align: center
  cursor: pointer

  transition: background-color .1s ease-in-out

  &.is-talking
    background-color: hsl(274, 87%, 31%)

  h1, p
    margin: 0

  h1
    font-weight: 400

  .timer
    font-family: 'Fira Code', monospace
    font-weight: 300
    letter-spacing: -.051em
    font-size: 3.6rem

    &.has-hours
      font-size: 2.2rem

  .percentage
    font-size: 1.2rem
</style>
