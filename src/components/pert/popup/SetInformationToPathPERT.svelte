<script>
    import {Label, Input, Button, NumberInput, P} from 'flowbite-svelte';
    import {pathsPERT, informationAboutPath, nodePert} from "../../../routes/store/PertStore.js";
    import {modal} from "../../../routes/store/ModalStore.js";

    let errorMessage = "";

    function addInformationToPath() {
        //Test input required
        if ($informationAboutPath.optimisticEstimate === null || $informationAboutPath.mostLikelyEstimate === null || $informationAboutPath.pessimisticEstimate === null) {
            errorMessage = "Not all parameters are set"
            return;
        }

        //Test min value input
        if ($informationAboutPath.pessimisticEstimate < $informationAboutPath.mostLikelyEstimate || $informationAboutPath.mostLikelyEstimate < $informationAboutPath.optimisticEstimate) {
            errorMessage = "Invalid value"
            return;
        }

        //Set information to current path
        $pathsPERT[$pathsPERT.length - 1].nameOfActivity = $informationAboutPath.nameOfActivity;
        $pathsPERT[$pathsPERT.length - 1].optimisticEstimate = $informationAboutPath.optimisticEstimate;
        $pathsPERT[$pathsPERT.length - 1].mostLikelyEstimate = $informationAboutPath.mostLikelyEstimate;
        $pathsPERT[$pathsPERT.length - 1].pessimisticEstimate = $informationAboutPath.pessimisticEstimate;

        //Set default value
        $informationAboutPath.nameOfActivity = "";
        $informationAboutPath.optimisticEstimate = null;
        $informationAboutPath.mostLikelyEstimate = null;
        $informationAboutPath.pessimisticEstimate = null;

        modal.set({show: false, type: ""});
    }

    function setMinValueMostLikeEstimate() {
        if ($informationAboutPath.mostLikelyEstimate < $informationAboutPath.optimisticEstimate) {
            $informationAboutPath.mostLikelyEstimate = $informationAboutPath.optimisticEstimate;
            $informationAboutPath = $informationAboutPath;
            setMinValuePessimisticEstimate();
        }
    }

    function setMinValuePessimisticEstimate() {
        if ($informationAboutPath.pessimisticEstimate < $informationAboutPath.mostLikelyEstimate) {
            $informationAboutPath.pessimisticEstimate = $informationAboutPath.mostLikelyEstimate;
            $informationAboutPath = $informationAboutPath;
        }
    }

    function cancel() {
        //delete reference at the node
        $nodePert.find(x => x.index === $pathsPERT[$pathsPERT.length - 1].circleFrom.index).pathsFrom.splice($nodePert.find(x => x.index === $pathsPERT[$pathsPERT.length - 1].circleFrom.index).pathsFrom.indexOf(x => x.index === $pathsPERT[$pathsPERT.length - 1].index), 1);
        $nodePert.find(x => x.index === $pathsPERT[$pathsPERT.length - 1].circleTo.index).pathsTo.splice($nodePert.find(x => x.index === $pathsPERT[$pathsPERT.length - 1].circleTo.index).pathsTo.indexOf(x => x.index === $pathsPERT[$pathsPERT.length - 1].index), 1);

        //delete last path
        $pathsPERT.splice($pathsPERT.length - 1, 1);

        //refresh values
        $pathsPERT = $pathsPERT;
        $nodePert = $nodePert;

        //close modal
        modal.set({show: false, type: ""});
    }

</script>


<div class="absolute w-1/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <h2>Set information's of a path</h2>
    {#if errorMessage}
        <P color="text-red-700" align="center">{errorMessage}</P>
    {/if}
    <Label for="activityName">Name of activity:</Label>
    <Input bind:value={$informationAboutPath.nameOfActivity} type="text" id="activityName" name="activityName"
           required="required"/>

    <Label for="optimisticEstimate">Optimistic estimate:</Label>
    <NumberInput bind:value={$informationAboutPath.optimisticEstimate} id="optimisticEstimate"
                 name="optimisticEstimate" min="0" on:input={setMinValueMostLikeEstimate }
                 required="required"/>

    <Label for="mostLikelyEstimate">Most Likely Estimate:</Label>
    <NumberInput bind:value={$informationAboutPath.mostLikelyEstimate} id="mostLikelyEstimate"
                 name="mostLikelyEstimate" min={$informationAboutPath.optimisticEstimate}
                 on:input={setMinValuePessimisticEstimate}
                 disabled={$informationAboutPath.optimisticEstimate === null ? "disabled" : "" }
                 required="required"/>

    <Label for="pessimisticEstimate">Pessimistic Estimate:</Label>
    <NumberInput class="mb-2"
                 bind:value={$informationAboutPath.pessimisticEstimate} id="pessimisticEstimate"
                 name="pessimisticEstimate" min={$informationAboutPath.mostLikelyEstimate}
                 disabled={$informationAboutPath.mostLikelyEstimate === null ? "disabled" : "" }
                 required="required"/>


    <Button on:click={addInformationToPath}>Add</Button>
    <Button on:click={cancel} class="bg-red-900">Cancel</Button>

</div>

