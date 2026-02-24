<template>
    <div class="extension-container">
        <h1>Cluster Events</h1>
        
        <!-- Loading State -->
        <div v-if="isLoading">Loading events from cluster...</div>
        
        <!-- Error State -->
        <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>

        <!-- Table -->
        <table v-else class="event-table">
            <thead>
                <tr>
                    <th @click="sortBy('name')" style="cursor: pointer">
                        Resource Name 
                        <span class="sort-icon" :class="{ active: sortKey === 'name' }">
                            {{ sortKey === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅' }}
                        </span>
                    </th>
                    <th @click="sortBy('description')" style="cursor: pointer">
                        Message
                        <span class="sort-icon" :class="{ active: sortKey === 'description' }">
                            {{ sortKey === 'description' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅' }}
                        </span>
                    </th>
                    <th @click="sortBy('date')" style="cursor: pointer">
                        Last Seen
                        <span class="sort-icon" :class="{ active: sortKey === 'date' }">
                            {{ sortKey === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅' }}
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(event, index) in sortedEvents" :key="event.id || index">
                    <td>
                        <b>{{ event.kind }}</b>: {{ event.name }}
                    </td>
                    <td>
                        <span :class="{'text-danger': event.type === 'Warning'}">
                            [{{ event.reason }}]
                        </span> 
                        {{ event.description }}
                    </td>
                    <td>{{ event.date }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { getCurrentScope } from 'vue';

export default {
    data() {
        return {
            isLoading: false,
            errorMessage: '',
            sortKey: 'date',
            sortOrder: 'desc',
            events: [] // Starts empty, fills up from API
        };
    },
    
    // Trigger fetch when component loads
    async mounted() {
        await this.fetchEvents();
    },

    computed: {
        sortedEvents() {
            return this.events.slice().sort((a, b) => {
                let modifier = 1;
                if (this.sortOrder === 'desc') modifier = -1;

                if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                return 0;
            });
        }
    },
    methods: {
        async fetchEvents() {
            this.isLoading = true;
            this.errorMessage = '';
            
            try {
                // 1. Fetch from Rancher Store (Steve API)
                // 'cluster/findAll' is the standard way to get resources in Rancher Extensions
                const allEvents = await this.$store.dispatch('cluster/findAll', { type: 'event' });

                // 2. Map Kubernetes object structure to our simple table structure
                this.events = allEvents.map(evt => {
                    return {
                        id: evt.id,
                        // Get the name of the pod/node/service involved
                        name: evt.involvedObject?.name || 'Unknown', 
                        kind: evt.involvedObject?.kind || 'Resource',
                        // Create a clean description
                        description: evt.message || '',
                        reason: evt.reason || 'Info',
                        type: evt.type || 'Normal',
                        // Format date (or keep raw string)
                        date: evt.lastTimestamp || evt.firstTimestamp
                    };
                });

            } catch (err) {
                this.errorMessage = `Error loading events: ${err.message}`;
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        sortBy(key) {
            // If clicking the same column, toggle order. Otherwise set to that column ascending.
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
        },

        }
    }
};
</script>

<style scoped>
.extension-container {
    padding: 20px;
    font-family: sans-serif;
}

.error {
    color: #dc3545;
    padding: 10px;
    background: #ffe6e6;
    border-radius: 4px;
}

.text-danger {
    color: #dc3545; /* Red color for Warnings */
    font-weight: bold;
}

.event-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.event-table th, .event-table td {
    border: 1px solid #f5f7fa;
    padding: 8px;
    text-align: left;
}

.event-table th {
    background-color: #f5f7fa;
    color: #333;
}

.sort-icon {
    float: right;
    margin-left: 5px;
    color: #aeadad; /* Faint color for inactive */
    font-size: 0.8em;
}

.sort-icon.active {
    color: #333;
    font-weight: bold;
}
</style>