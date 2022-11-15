<script>
    import H from "@here/maps-api-for-javascript";
    import {onMount} from "svelte";
    import {Environment} from "src/shared/environment";

    let mapContainer;

    export let width = "100%";
    export let height = "400px";

    onMount(() => {
        let platform = new H.service.Platform({
            apikey: Environment.hereApiKey,
        });

        let maptypes = platform.createDefaultLayers();

        let map = new H.Map(
            mapContainer,
            maptypes.vector.normal.map,
            {
                zoom: 10,
                center: { lng: 13.4, lat: 52.51 },
            }
        );

        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    });

</script>
<div style="width:{width}; height: {height};" bind:this={mapContainer}></div>