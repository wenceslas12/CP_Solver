<script>

    import {Button} from "flowbite-svelte";
    import { pathsCPM, activityInTable, nodeCPM, selectedNode} from "../../routes/store/CpmStore.js";
    import {modal} from "../../routes/store/ModalStore.js";


    function cloneWithoutCircularReferences(obj, map = new WeakMap()) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (map.has(obj)) return map.get(obj);

        const result = Array.isArray(obj) ? [] : {};

        map.set(obj, result);

        for (const key in obj) {
            result[key] = cloneWithoutCircularReferences(obj[key], map);
        }

        return result;
    }


    function drawGraft() {

        let indexPathWithODurations = $activityInTable.reduce((max, current) => (current.index > max.index) ? current : max).index + 1;

        //Set default value to store
        $pathsCPM = [];
        $nodeCPM = [];

        //Add first node
        let firstNode = {
            cx: 100,
            cy: 100,
            r: 50,
            index: 0,
            actualLeftValue: 0,
            actualRightValue: 100000000,
            pathsTo: [],
            pathsFrom: []
        };
        $nodeCPM = $nodeCPM.concat(firstNode);

        //Add paths that have no predecessor
        let pathsWithoutPreviousActivity = $activityInTable.filter(function (obj) {
            return obj.previousActivities.length === 0;
        });

        let activitiesProcessed = [];
        for (let path of pathsWithoutPreviousActivity) {
            let newNode = {
                cx: 100,
                cy: 100,
                r: 50,
                index: $nodeCPM.reduce((max, current) => (current.index > max.index) ? current : max).index + 1,
                actualLeftValue: 0,
                actualRightValue: 100000000,
                pathsTo: [],
                pathsFrom: []
            };
            $nodeCPM = $nodeCPM.concat(newNode);

            let newPath = {
                circleFrom: $nodeCPM.find(x => x.index === 0),
                circleTo: $nodeCPM.find(x => x.index === newNode.index),
                index: path.index,
                nameOfActivity: path.nameOfActivity,
                durations: path.durations,
                start: null,
                earliestEnd: null,
                latestEnd: null
            }
            $pathsCPM = $pathsCPM.concat(newPath);

            //Add path to nodes
            $nodeCPM.find(x => x.index === 0).pathsFrom = $nodeCPM.find(x => x.index === 0).pathsFrom.concat($pathsCPM[$pathsCPM.length - 1]);
            $nodeCPM.find(x => x.index === newNode.index).pathsTo = $nodeCPM.find(x => x.index === newNode.index).pathsTo.concat($pathsCPM[$pathsCPM.length - 1]);

            activitiesProcessed = activitiesProcessed.concat(path);

            //Remove from activity in table
            $activityInTable.splice($activityInTable.findIndex(x => x.index === path.index), 1);
        }

        // Finding all activities that have multiple predecessors
        let activitiesWithMultiplePredecessors = cloneWithoutCircularReferences($activityInTable).filter(function (obj) {
            if (obj.previousActivities.length > 1) {
                return obj.previousActivities;
            }
        });

        let i = 0;
        while ($activityInTable.length !== 0) {

            let followingActivitiesWithOnePrevious = cloneWithoutCircularReferences($activityInTable).filter(function (obj) {
                if (obj.previousActivities.length === 1) {
                    return obj.previousActivities[0] === activitiesProcessed[0].index;
                }
            });

            for (let followActivity of followingActivitiesWithOnePrevious) {
                let newNode = {
                    cx: 100,
                    cy: 100,
                    r: 50,
                    index: $nodeCPM.reduce((max, current) => (current.index > max.index) ? current : max).index + 1,
                    actualLeftValue: 0,
                    actualRightValue: 100000000,
                    pathsTo: [],
                    pathsFrom: []
                };
                $nodeCPM = $nodeCPM.concat(newNode);

                let newPath = {
                    circleFrom: $pathsCPM.find(x => x.index === activitiesProcessed[0].index).circleTo,
                    circleTo: $nodeCPM.find(x => x.index === newNode.index),
                    index: followActivity.index,
                    nameOfActivity: followActivity.nameOfActivity,
                    durations: followActivity.durations,
                    start: null,
                    earliestEnd: null,
                    latestEnd: null
                }

                $pathsCPM = $pathsCPM.concat(newPath);

                $nodeCPM.find(x => x.index === $pathsCPM.find(x => x.index === activitiesProcessed[0].index).circleTo.index).pathsFrom = $nodeCPM.find(x => x.index === $pathsCPM.find(x => x.index === activitiesProcessed[0].index).circleTo.index).pathsFrom.concat($pathsCPM[$pathsCPM.length - 1]);
                $nodeCPM.find(x => x.index === newNode.index).pathsTo = $nodeCPM.find(x => x.index === newNode.index).pathsTo.concat($pathsCPM[$pathsCPM.length - 1]);

                activitiesProcessed = activitiesProcessed.concat(followActivity);
                $activityInTable.splice($activityInTable.findIndex(x => x.index === followActivity.index), 1);

            }


            for (let activity of activitiesWithMultiplePredecessors) {

                if (activity.previousActivities.length === 1 && activity.previousActivities[0] === activitiesProcessed[0].index) {
                    let findIndexPreviousActivity = $activityInTable.find(x => x.index === activity.index).previousActivities;
                    //Finding node to previously activity
                    let nodeToOfPreviousActivity = [];
                    for (let indexPreviousActivity of findIndexPreviousActivity) {
                        nodeToOfPreviousActivity = nodeToOfPreviousActivity.concat($pathsCPM.find(x => x.index === indexPreviousActivity).circleTo);
                    }
                    //finding node which not have paths from
                    let nodeWithoutPathsFrom = null;
                    for (let node of nodeToOfPreviousActivity) {
                        if (node.pathsFrom.length === 0) {
                            nodeWithoutPathsFrom = $nodeCPM.find(x => x.index === node.index);
                        }
                    }

                    //Add new link
                    let newNode = {
                        cx: 250,
                        cy: 250,
                        r: 50,
                        index: $nodeCPM.reduce((max, current) => (current.index > max.index) ? current : max).index + 1,
                        actualLeftValue: 0,
                        actualRightValue: 100000000,
                        pathsTo: [],
                        pathsFrom: []
                    };
                    $nodeCPM = $nodeCPM.concat(newNode);

                    let nodeWithDuration0To = [];
                    if (nodeWithoutPathsFrom === null){
                        for (let preActivity of $activityInTable.find(x => x.index === activity.index).previousActivities ){
                            nodeWithDuration0To = nodeWithDuration0To.concat($pathsCPM.find(x =>x.index === preActivity))
                        }

                    }

                    let newPath = {
                        circleFrom: nodeWithoutPathsFrom === null ? $nodeCPM.find(x => x.index === nodeToOfPreviousActivity.find(x => x.pathsTo.durations === 0).index) : $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index),
                        circleTo: $nodeCPM.find(x => x.index === newNode.index),
                        index: activity.index,
                        nameOfActivity: activity.nameOfActivity,
                        durations: activity.durations,
                        start: null,
                        earliestEnd: null,
                        latestEnd: null
                    }

                    $pathsCPM = $pathsCPM.concat(newPath);

                    $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index).pathsFrom = $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index).pathsFrom.concat($pathsCPM[$pathsCPM.length - 1]);
                    $nodeCPM.find(x => x.index === newNode.index).pathsTo = $nodeCPM.find(x => x.index === newNode.index).pathsTo.concat($pathsCPM[$pathsCPM.length - 1]);

                    for (let a of $activityInTable.find(x => x.index === activity.index).previousActivities) {
                        if ($pathsCPM.find(x => x.index === a).circleTo !== $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index)) {

                            let pathWith0Durations = {
                                circleFrom: $pathsCPM.find(x => x.index === a).circleTo,
                                circleTo: $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index),
                                index: indexPathWithODurations,
                                nameOfActivity: "x",
                                durations: 0,
                                start: null,
                                earliestEnd: null,
                                latestEnd: null
                            }
                            indexPathWithODurations++;
                            $pathsCPM = $pathsCPM.concat(pathWith0Durations);
                            $nodeCPM.find(x => x.index === $pathsCPM.find(x => x.index === a).circleTo.index).pathsFrom = $nodeCPM.find(x => x.index === $pathsCPM.find(x => x.index === a).circleTo.index).pathsFrom.concat($pathsCPM[$pathsCPM.length - 1]);
                            $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index).pathsTo = $nodeCPM.find(x => x.index === nodeWithoutPathsFrom.index).pathsTo.concat($pathsCPM[$pathsCPM.length - 1]);
)
                        }
                    }


                    activitiesProcessed = activitiesProcessed.concat(activity);
                    $activityInTable.splice($activityInTable.findIndex(x => x.index === activity.index), 1);
                } else {
                    for (let previousActivity of activity.previousActivities) {
                        if (previousActivity === activitiesProcessed[0].index) {
                            activitiesWithMultiplePredecessors.find(x => x.index === activity.index).previousActivities.splice(activitiesWithMultiplePredecessors.find(x => x.index === activity.index).previousActivities.indexOf(activitiesProcessed[0].index), 1);
                        }
                    }

                }
            }
            activitiesProcessed.splice(0, 1);
            i = i + 1;

        }

        //  Re-indexing node
        $nodeCPM.sort((a, b) => a.index - b.index);
        $nodeCPM.forEach((obj, newIndex) => {
            obj.index = newIndex;
        });
    }

</script>

<div class="button_table">
    <Button on:click={() => modal.set({show: true, type: "add_activity_cpm"})}>
        Add Activity
    </Button>
    <Button on:click={drawGraft}>
        Save
    </Button>
    <Button>
        CPM
    </Button>
</div>
<style>
    .button_table {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>