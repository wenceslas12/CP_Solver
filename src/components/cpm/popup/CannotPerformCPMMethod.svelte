<script>
    import {Button, P} from "flowbite-svelte";
    import {modal} from "../../../routes/store/ModalStore.js";

    function closeModal() {
        modal.set({show: false, type: ""});
    }
</script>

<div class="absolute w-1/5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <P class="text-primary-700 text-center text-[25px] mb-2">Cannot perform CPM method.</P>
    <Button on:click={closeModal}>
        OK
    </Button>
</div>