<script>
    import {Heading, P, Label, Input, NumberInput, Button} from "flowbite-svelte";
    import {selectedPath, pathsCPM} from "../../../routes/store/CpmStore.js";
    import {modal} from "../../../routes/store/ModalStore.js";

    let errorMessage = "";

    function updatePath(){
        if ($selectedPath.durations < 0 || $selectedPath.durations === null) {
            errorMessage = "Invalid duration"
            return;
        }

        $pathsCPM.find(x => x.index === $selectedPath.index).nameOfActivity = $selectedPath.nameOfActivity;
        $pathsCPM.find(x => x.index === $selectedPath.index).durations = $selectedPath.durations;

        $pathsCPM = $pathsCPM;

        modal.set({show: false, type: ""});
    }

    function cancel(){
        modal.set({show: false, type: ""});
    }

</script>

<div class="absolute w-1/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <Heading tag="h4" class="pb-4">Set information's of a path</Heading>
    {#if errorMessage}
        <P color="text-red-700" align="center">{errorMessage}</P>
    {/if}
        <Label for="activityName">Name of activity:</Label>
        <Input bind:value={$selectedPath.nameOfActivity} type="text" id="activityName" name="activityName"
               />

        <Label for="duration">Duration:</Label>
        <NumberInput class="mb-4" bind:value={$selectedPath.durations}  id="duration" name="duration" min="0"
               required="required"/>

    <Button on:click={updatePath}>Change</Button>
    <Button on:click={cancel} class="bg-red-900">Cancel</Button>
</div>


