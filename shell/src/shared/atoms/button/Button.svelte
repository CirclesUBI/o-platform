<script lang="ts">
    export let label: string;
    export let onClick: () => void;
</script>

<button class="btn btn-primary" on:click={onClick}>{label}</button>