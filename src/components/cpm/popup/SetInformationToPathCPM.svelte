<script>
    import {Heading, P, NumberInput, Input, Label, Button} from "flowbite-svelte";
    import {informationAboutPath, nodeCPM, pathsCPM} from "../../../routes/store/CpmStore.js";
    import {modal} from "../../../routes/store/ModalStore.js";

    let errorMessage = "";

    function addInformationToPath() {
        if ($informationAboutPath.durations < 0 || $informationAboutPath.durations === null){
            errorMessage = "Invalid duration"
            return;
        }

        //Set information to current path
        $pathsCPM[$pathsCPM.length - 1].nameOfActivity = $informationAboutPath.nameOfActivity;
        $pathsCPM[$pathsCPM.length - 1].durations = $informationAboutPath.durations;

        //Set default value
        $informationAboutPath.nameOfActivity = "";
        $informationAboutPath.durations = null;

        modal.set({show: false, type: ""});
    }

    function cancel(){
        //delete reference at the node
        $nodeCPM.find(x => x.index === $pathsCPM[$pathsCPM.length - 1].circleFrom.index).pathsFrom.splice($nodeCPM.find(x => x.index === $pathsCPM[$pathsCPM.length - 1].circleFrom.index).pathsFrom.indexOf(x => x.index === $pathsCPM[$pathsCPM.length - 1].index), 1);
        $nodeCPM.find(x => x.index === $pathsCPM[$pathsCPM.length - 1].circleTo.index).pathsTo.splice($nodeCPM.find(x => x.index === $pathsCPM[$pathsCPM.length - 1].circleTo.index).pathsTo.indexOf(x => x.index === $pathsCPM[$pathsCPM.length - 1].index), 1);

        //delete last path
        $pathsCPM.splice($pathsCPM.length - 1, 1);

        //refresh values
        $pathsCPM = $pathsCPM;
        $nodeCPM = $nodeCPM;

        //close modal
        modal.set({show: false, type: ""})
    }
</script>


<div class="absolute w-1/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <Heading tag="h2" class="pb-4">Set information's of a path1</Heading>
    {#if errorMessage}
        <P color="text-red-700" align="center">{errorMessage}</P>
    {/if}
        <Label for="activityName">Name of activity:</Label>
        <Input bind:value={$informationAboutPath.nameOfActivity} type="text" id="activityName" name="activityName"
              />

        <Label for="duration">Duration:</Label>
        <NumberInput class="mb-4" bind:value={$informationAboutPath.durations}  id="duration" name="duration" min="0"
                required="required"/>

        <Button on:click={addInformationToPath}>Add</Button>
        <Button on:click={cancel} class="bg-red-900">Cancel</Button>
</div>

