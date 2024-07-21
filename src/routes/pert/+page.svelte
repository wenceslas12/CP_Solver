<script>
    import {changePertMode} from "../store/PertStore.js";
    import PERTChart from "../../components/pert/PERTChart.svelte";
    import DrawPath from "../../components/pert/DrawPath.svelte";
    import GanttChart from "../../components/pert/GanttChart.svelte";
    import TableWithInformationAboutPath from "../../components/pert/TableWithInformationAboutPath.svelte";
    import Matrix from "../../components/pert/MatrixPert.svelte";
    import NavInPert from "../../components/pert/NavInPert.svelte";
</script>

<NavInPert/>

{#if $changePertMode === "ChartPERT"}
    <PERTChart/>
{:else if $changePertMode === "DrawPath"}
    <DrawPath/>
{:else if $changePertMode === "GanttChart"}
    <GanttChart/>
{:else if $changePertMode === "TableWithInformationAboutPath"}
    <TableWithInformationAboutPath/>
{:else if $changePertMode === "Matrix"}
    <Matrix/>
{/if}