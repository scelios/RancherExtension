<template>
    <div class="show-event">
        <h1>Events</h1>
        <div v-if="loading">Loading events...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="!events.length">No events found for this resource.</div>
        <table v-else class="events-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Whatever</th>
                    <th>Message</th>
                    <th>Last Seen</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in events" :key="event.id || event.metadata?.uid || `${ event.reason }-${ event.message }`">
                    <td>{{ event.type || '-' }}</td>
                    <td>{{ event.reason || '-' }}</td>
                    <td>Whatever</td>
                    <td>{{ event.message || '-' }}</td>
                    <td>{{ event.lastTimestamp || event.eventTime || event.metadata?.creationTimestamp || '-' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'showEvent',
    props: {
        resource: {
            type:     Object,
            required: false,
    }
    },
    data() {
        return {
            loading: true,
            error:   '',
            events:  []
        };
    },
    async mounted() {
        await this.loadEvents();
    },
    methods: {
        async loadEvents() {
            this.loading = true;
            this.error = '';

            try {
                const eventList = await this.fetchEvents();

                this.events = eventList.sort((a, b) => {
                    const aTime = new Date(a.lastTimestamp || a.eventTime || a.metadata?.creationTimestamp || 0).getTime();
                    const bTime = new Date(b.lastTimestamp || b.eventTime || b.metadata?.creationTimestamp || 0).getTime();

                    return bTime - aTime;
                });
            } catch (err) {
                this.error = err?.message || 'Failed to load events';
                this.events = [];
            } finally {
                this.loading = false;
            }
        },
        async fetchEvents() {
            const request = this.$store?.dispatch;

            if (!request) {
                throw new Error('Cluster request API is unavailable in this context.');
            }

            if (this.resource?.links?.events) {
                const response = await this.$store.dispatch('cluster/request', { url: this.resource.links.events });

                return this.normalizeEvents(response);
            }

            const kind = this.resource?.kind;
            const name = this.resource?.metadata?.name;
            const namespace = this.resource?.metadata?.namespace;

            if (!kind || !name) {
                return [];
            }

            const selectorParts = [
                `involvedObject.kind=${ encodeURIComponent(kind) }`,
                `involvedObject.name=${ encodeURIComponent(name) }`
            ];

            if (namespace) {
                selectorParts.push(`involvedObject.namespace=${ encodeURIComponent(namespace) }`);
            }

            const fieldSelector = selectorParts.join(',');
            const eventUrl = `/v1/events?fieldSelector=${ fieldSelector }`;
            const response = await this.$store.dispatch('cluster/request', { url: eventUrl });

            return this.normalizeEvents(response);
        },
        normalizeEvents(response) {
            if (Array.isArray(response)) {
                return response;
            }

            if (Array.isArray(response?.data)) {
                return response.data;
            }

            if (Array.isArray(response?.items)) {
                return response.items;
            }

            if (Array.isArray(response?.data?.items)) {
                return response.data.items;
            }

            return [];
        }
    }
}
</script>
<style lang="scss" scoped>
.events-table {
    width: 100%;
    border-collapse: collapse;
}

.events-table th,
.events-table td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid var(--border);
}
</style>