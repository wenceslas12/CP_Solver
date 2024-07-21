<script>
    import {selectedPath, pathsPERT, informationAboutPath} from "../../../routes/store/PertStore.js";
    import {modal} from "../../../routes/store/ModalStore.js";
    import {Button, Input, Label, NumberInput, P} from "flowbite-svelte";

    let errorMessage = "";

    function updatePath(){
        //Test input required
        if ($selectedPath.optimisticEstimate === null || $selectedPath.mostLikelyEstimate === null || $selectedPath.pessimisticEstimate === null) {
            errorMessage = "Not all parameters are set"
            return;
        }

        //Test min value input
        if ($selectedPath.pessimisticEstimate < $selectedPath.mostLikelyEstimate || $selectedPath.mostLikelyEstimate < $selectedPath.optimisticEstimate) {
            errorMessage = "Invalid value"
            return;
        }


        $pathsPERT.find(x => x.index === $selectedPath.index).nameOfActivity = $selectedPath.nameOfActivity;
        $pathsPERT.find(x => x.index === $selectedPath.index).optimisticEstimate = $selectedPath.optimisticEstimate;
        $pathsPERT.find(x => x.index === $selectedPath.index).mostLikelyEstimate = $selectedPath.mostLikelyEstimate;
        $pathsPERT.find(x => x.index === $selectedPath.index).pessimisticEstimate = $selectedPath.pessimisticEstimate;

        $pathsPERT = $pathsPERT;

        modal.set({show: false, type: ""});
    }

    function setMinValueMostLikeEstimate() {
        if ($selectedPath.mostLikelyEstimate < $selectedPath.optimisticEstimate) {
            $selectedPath.mostLikelyEstimate = $selectedPath.optimisticEstimate;
            $selectedPath = $selectedPath;
            setMinValuePessimisticEstimate();
        }
    }

    function setMinValuePessimisticEstimate() {
        if ($selectedPath.pessimisticEstimate < $selectedPath.mostLikelyEstimate) {
            $selectedPath.pessimisticEstimate = $selectedPath.mostLikelyEstimate;
            $selectedPath = $selectedPath;
        }
    }

    function cancel(){
        modal.set({show: false, type: ""});
    }

</script>

<div class="absolute w-1/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <h2>Set information's of a path</h2>
    {#if errorMessage}
        <P color="text-red-700" align="center">{errorMessage}</P>
    {/if}
    <Label for="activityName">Name of activity:</Label>
    <Input bind:value={$selectedPath.nameOfActivity} type="text" id="activityName" name="activityName"
           required="required"/>

    <Label for="optimisticEstimate">Optimistic estimate:</Label>
    <NumberInput bind:value={$selectedPath.optimisticEstimate} id="optimisticEstimate"
                 name="optimisticEstimate" min="0" on:input={setMinValueMostLikeEstimate }
                 required="required"/>

    <Label for="mostLikelyEstimate">Most Likely Estimate:</Label>
    <NumberInput bind:value={$selectedPath.mostLikelyEstimate} id="mostLikelyEstimate"
                 name="mostLikelyEstimate" min={$selectedPath.optimisticEstimate}
                 on:input={setMinValuePessimisticEstimate}
                 disabled={$selectedPath.optimisticEstimate === null ? "disabled" : "" }
                 required="required"/>

    <Label for="pessimisticEstimate">Pessimistic Estimate:</Label>
    <NumberInput class="mb-2"
                 bind:value={$selectedPath.pessimisticEstimate} id="pessimisticEstimate"
                 name="pessimisticEstimate" min={$selectedPath.mostLikelyEstimate}
                 disabled={$selectedPath.mostLikelyEstimate === null ? "disabled" : "" }
                 required="required"/>


    <Button on:click={updatePath}>Update</Button>
    <Button on:click={cancel} class="bg-red-900">Cancel</Button>

</div>
