<script>
    import {modal} from "../../../routes/store/ModalStore.js";
    import {Button, P} from "flowbite-svelte";
    import {isPert, nodePert, pathsPERT, selectedNode, selectedPath, activityInTable} from "../../../routes/store/PertStore.js";

    function closeModal() {
        modal.set({show: false, type: ""});
    }

    function deleteAll(){
        $nodePert = [];
        $pathsPERT = [];
        $selectedNode = null;
        $selectedPath = null;
        $activityInTable = [];
        $isPert = true;

        modal.set({show: false, type: ""});
    }
</script>

<div class="absolute w-1/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <P class="text-black text-[25px] text-center pb-[10px] font-bold">Do you want delete graph</P>
    <Button on:click={deleteAll}>
        Yes
    </Button>
    <Button class ="bg-red-900" on:click={closeModal}>
        No
    </Button>
</div>