<script>
    import CPMChart from "../../components/cpm/CPMChart.svelte";
    import {changeCpmMode} from "../store/CpmStore.js";
    import DrawPath from "../../components/cpm/DrawPath.svelte";
    import GanttChart from "../../components/cpm/GanttChart.svelte";
    import TableWithInformationAboutPath from "../../components/cpm/TableWithInformationAboutPath.svelte";
    import NavInCpm from "../../components/cpm/NavInCpm.svelte";
    import Matrix from "../../components/cpm/Matrix.svelte";
</script>

<NavInCpm/>

{#if $changeCpmMode === "ChartCPM"}
    <CPMChart/>
{:else if $changeCpmMode === "DrawPath"}
    <DrawPath/>
{:else if $changeCpmMode === "GanttChart"}
    <GanttChart/>
{:else if ($changeCpmMode === "TableWithInformationAboutPath")}
    <TableWithInformationAboutPath/>
{:else if ($changeCpmMode === "Matrix")}
    <Matrix/>
{/if}