<script>
    import {Button, Dropdown, DropdownItem, Toggle} from 'flowbite-svelte';
    import IoIosArrowDropupCircle from 'svelte-icons/io/IoIosArrowDropupCircle.svelte'
    import ExportButton from "./buttonToRollup/ExportButton.svelte";
    import ImportButton from "./buttonToRollup/ImportButton.svelte";
    import DownloadPNG from "./buttonToRollup/DownloadPNG.svelte";
    import {modal} from "../../routes/store/ModalStore.js";
    import {isCanvas} from "../../routes/store/CpmStore.js";

    let placement = 'top'

</script>

<Button pill={true} outline={true} class="!p-2 absolute bottom-0 right-4 ml-2.5 mb-1.5">
    <div class="rollup_button">
        <IoIosArrowDropupCircle/>
    </div>
</Button>
<Dropdown {placement}>
    <DownloadPNG/>
    <ExportButton/>
    <ImportButton/>
    <DropdownItem>
        <Toggle checked={$isCanvas} on:click={$isCanvas === false ? isCanvas.set(true) : isCanvas.set(false)}>
            On/Off draw
        </Toggle>
    </DropdownItem>
    <DropdownItem on:click={() => modal.set({show: true, type: "delete_all_CPM"})}>Delete graph</DropdownItem>
    <DropdownItem on:click={() => modal.set({show: true, type: "set_style_cpm"})}>Settings</DropdownItem>
</Dropdown>

<style>
    .rollup_button {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
    }
</style>