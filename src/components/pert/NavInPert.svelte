<script>
    import {ButtonGroup, Button, Popover} from 'flowbite-svelte';
    import {changePertMode, pathsPERT, isPert, activityInTable} from "../../routes/store/PertStore.js";

    let placement;

    function changeToGanttChart() {
        changePertMode.set("GanttChart");
    }

    function changeToTableWithInformationAboutPath() {
        $activityInTable = [];

        //Copy path to activity in table
        for (let path of $pathsPERT) {
            let previousActivities = [];
            for (let previousActivity of path.circleFrom.pathsTo) {
                if (previousActivity.duration === 0) {
                    for (let pathBefore0Durations of previousActivity.circleFrom.pathsTo) {
                        previousActivities = previousActivities.concat(pathBefore0Durations.index);
                    }
                } else {
                    previousActivities = previousActivities.concat(previousActivity.index);
                }
            }
            let newActivityInTable = {
                nameOfActivity: path.nameOfActivity,
                optimisticEstimate: path.optimisticEstimate,
                mostLikelyEstimate: path.mostLikelyEstimate,
                pessimisticEstimate: path.pessimisticEstimate,
                previousActivities: previousActivities,
                meanValue: path.meanValue,
                index: path.index,
                start: path.start,
                earliestEnd: path.earliestEnd,
                latestEnd: path.latestEnd,
                timeReserve: path.timeReserve,
                dispersion: path.dispersion
            }
            $activityInTable = $activityInTable.concat(newActivityInTable);
        }
        changePertMode.set("TableWithInformationAboutPath");
    }

    function changeToChartPERT() {
        changePertMode.set("ChartPERT");
    }

    function changeToMatrix() {
        changePertMode.set("Matrix")
    }
</script>

<div class="controls">
    <ButtonGroup class="mb-1.5">
        <Button on:click={changeToChartPERT}>Chart</Button>
        <Button on:click={changeToMatrix}>Matrix</Button>
        <Button on:click={changeToTableWithInformationAboutPath}>Table</Button>
        <Button on:click={changeToGanttChart} disabled={$isPert} id="placement-bottom"
                on:mouseenter={() => (placement = 'bottom')}>Gant Chart
        </Button>
    </ButtonGroup>
    {#if $isPert}
        <Popover triggeredBy="[id^='placement-']" {placement} class="w-64 text-sm font-light ">It is necessary to
            perform the PERT method.
        </Popover>
    {/if}
</div>

<style>
    .controls {
        position: absolute;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        left: 0;
        right: 0;
        text-align: center;
    }
</style>