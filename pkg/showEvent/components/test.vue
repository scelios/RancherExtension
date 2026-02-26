<script>
export default {
  // 0. Props: Inputs from the parent. 
  //    "Show me events for THIS specific resource"
  props: {
    resourceKind: {
      type: String,
      required: true // e.g., "Pod"
    },
    resourceName: {
      type: String,
      required: true // e.g., "my-web-app"
    },
    resourceNamespace: {
      type: String,
      default: 'default'
    }
  },

  // 1. Data: The memory of your component.
  data() {
    return {
      filteredEvents: [],
      isLoading: false,
      errorMessage: ''
    };
  },

  async mounted() {
    await this.fetchEvents();
  },

  methods: {
    async fetchEvents() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // 1. Get ALL events first (simplest way in Rancher UI)
        const allEvents = await this.$store.dispatch('cluster/findAll', { type: 'event' });
        
        // 2. Filter them manually (The Logic of 'kubectl describe')
        //    We only keep events where the "involvedObject" matches our inputs.
        this.filteredEvents = allEvents.filter(event => {
          const involved = event.involvedObject;
          
          return involved.kind === this.resourceKind &&
                 involved.name === this.resourceName &&
                 involved.namespace === this.resourceNamespace;
        });

      } catch (err) {
        this.errorMessage = `Failed to fetch events: ${err.message}`;
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<template>
  <div class="event-viewer">
    <!-- Updated Title to reflect we are filtering -->
    <h1>Events for {{ resourceKind }}: {{ resourceName }}</h1>

    <div v-if="isLoading">
      <i>Loading...</i>
    </div>

    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-else-if="filteredEvents.length === 0">
      No events found for this resource.
    </div>

    <table v-else class="simple-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Reason</th>
          <th>Message</th>
          <th>Last Seen</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through our FILTERED list now -->
        <tr v-for="event in filteredEvents" :key="event.id">
          <td>{{ event.type }}</td>
          <td>{{ event.reason }}</td>
          <td>{{ event.message }}</td>
          <td>{{ event.lastTimestamp }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Simple CSS to make it look decent */
.event-viewer {
  padding: 20px;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.simple-table th, .simple-table td {
  /* border: 1px solid #ccc; */
  padding: 8px;
  text-align: left;
}

.simple-table th {
  /* background-color: #f4f4f4; */
}

.error {
  color: red;
  font-weight: bold;
}
</style>
