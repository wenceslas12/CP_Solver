<script>
    import {ButtonGroup, Button, Popover} from 'flowbite-svelte';
    import {changeCpmMode, pathsCPM, activityInTable, isCPM} from "../../routes/store/CpmStore.js";

    let placement;

    function changeToGanttChart() {
        changeCpmMode.set("GanttChart");
    }

    function changeToTableWithInformationAboutPath() {
        //Setting to the original value
        $activityInTable = [];

        //Copy path to activity in table
        for (let path of $pathsCPM) {
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
                durations: path.durations,
                previousActivities: previousActivities,
                index: path.index,
                start: path.start,
                earliestEnd: path.earliestEnd,
                latestEnd: path.latestEnd,
                timeReserve: path.timeReserve,
                freeReserve: path.circleTo.actualLeftValue - path.circleFrom.actualLeftValue - path.durations,
                independentReserve: Math.max(0, path.circleTo.actualLeftValue - path.circleFrom.actualRightValue - path.durations)
            }
            $activityInTable = $activityInTable.concat(newActivityInTable);
        }
        changeCpmMode.set("TableWithInformationAboutPath");
    }

    function changeToChartCPM() {
        changeCpmMode.set("ChartCPM");
    }

    function changeToMatrix() {
        changeCpmMode.set("Matrix")
    }

</script>


<div class="controls">
    <ButtonGroup class="mb-1.5">
        <Button on:click={changeToChartCPM}>Chart</Button>
        <Button on:click={changeToMatrix}>Matrix</Button>
        <Button on:click={changeToTableWithInformationAboutPath}>Table</Button>
        <Button on:click={changeToGanttChart} disabled={$isCPM} id="placement-bottom"
                on:mouseenter={() => (placement = 'bottom')}>Gant Chart
        </Button>
    </ButtonGroup>
    {#if $isCPM}
        <Popover triggeredBy="[id^='placement-']" {placement} class="w-64 text-sm font-light ">It is necessary to
            perform the CPM method.
        </Popover>
    {/if}
</div>

<style>
    .controls {
        position: absolute;
        max-width: 600px; /* Adjust the maximum width as needed */
        width: 100%;
        margin: 0 auto;
        left: 0;
        right: 0;
        text-align: center;
    }
</style>



