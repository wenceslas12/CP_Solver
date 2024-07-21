<script>
    import "../app.postcss";
    import Nav from "./header/Nav.svelte";
    import Modal from "../modal/Modal.svelte";
    import {modal} from "./store/ModalStore.js";

    //import cpm popup
    import AddNewActivityToTable from "../components/cpm/popup/AddNewActivityToTable.svelte";
    import EditPathCPM from "../components/cpm/popup/EditPathCPM.svelte";
    import NewMatrix from "../components/cpm/popup/NewMatrix.svelte";
    import IncorrectJsonData from "../components/cpm/popup/IncorrectJsonData.svelte";
    import ConfirmImportCPM from "../components/cpm/popup/ConfirmImport.svelte";
    import SetStyleCPM from "../components/cpm/popup/SetStyle.svelte";
    import CannotPerformCPMMethod from "../components/cpm/popup/CannotPerformCPMMethod.svelte";
    //import pert popup
    import SetInformationToPathPERT from "../components/pert/popup/SetInformationToPathPERT.svelte";
    import EditPathPERT from "../components/pert/popup/EditPathPERT.svelte";
    import ConfirmImportPERT from "../components/pert/popup/ConfirmImport.svelte";
    import SetStylePERT from "../components/pert/popup/SetStyle.svelte";
    import DeleteAllGraphCPM from "../components/cpm/popup/DeleteAllGraphCPM.svelte";
    import DeleteAllGraphPERT from "../components/pert/popup/DeleteAllGraphPERT.svelte";

</script>

<Nav></Nav>

<slot></slot>
<Modal bind:open={$modal.show}>
    {#if $modal.type === "add_path_cpm"}
        <NewMatrix/>
        <!--        <SetInformationToPathCPM/>-->
    {:else if $modal.type === "add_activity_cpm"}
        <AddNewActivityToTable/>
    {:else if $modal.type === "edit_path_cpm"}
        <EditPathCPM/>
    {:else if $modal.type === "add_path_pert"}
        <SetInformationToPathPERT/>
    {:else if $modal.type === "edit_path_pert" }
        <EditPathPERT/>
    {:else if $modal.type === "set_size_matrix_cpm"}
        <NewMatrix/>
    {:else if $modal.type === "invalid_json_file_cpm"}
        <IncorrectJsonData/>
    {:else if $modal.type === "confirm_import_json_cpm"}
        <ConfirmImportCPM/>
    {:else if $modal.type === "confirm_import_json_pert"}
        <ConfirmImportPERT/>
    {:else if $modal.type === "set_style_cpm"}
        <SetStyleCPM/>
    {:else if $modal.type === "set_style_pert"}
        <SetStylePERT/>
    {:else if $modal.type === "cannot_perform_CPM_method"}
        <CannotPerformCPMMethod/>
    {:else if $modal.type === "delete_all_CPM"}
        <DeleteAllGraphCPM/>
    {:else if $modal.type === "delete_all_PERT"}
        <DeleteAllGraphPERT/>
    {/if}

</Modal>


