<script>
    import {Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button, P} from 'flowbite-svelte';
    import {activityInTable} from "../../routes/store/CpmStore.js";

    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';

    // Function to convert the table data to a PDF
    async function convertToPDF() {
        const tableElement = document.querySelector('.table');

        if (!tableElement) {
            console.error('Table element not found.');
            return;
        }

        // Use html2canvas to convert the HTML content to an image
        const canvas = await html2canvas(tableElement);

        // Create a PDF document
        const pdf = new jsPDF('l', 'mm', 'a4');

        // Add the image of the table to the PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 280, 0);

        // Save or open the PDF
        pdf.save('table_data.pdf');
    }

</script>
<Button on:click={convertToPDF}>Download Table as PDF</Button>
<div class="table">
    <Table hoverable={true}>
        <TableHead>
            <TableHeadCell>Name of activity</TableHeadCell>
            <TableHeadCell>Durations</TableHeadCell>
            <TableHeadCell>Previous activities</TableHeadCell>
            <TableHeadCell>Start activities</TableHeadCell>
            <TableHeadCell>Earliest end activities</TableHeadCell>
            <TableHeadCell>Latest end activities</TableHeadCell>
            <TableHeadCell>Total time reserve</TableHeadCell>
            <TableHeadCell>Free time reserve</TableHeadCell>
            <TableHeadCell>Independent time reserve</TableHeadCell>

        </TableHead>
        <TableBody class="divide-y">
            {#each $activityInTable as path}
                <TableBodyRow>
                    <TableBodyCell>
                        {path.nameOfActivity}
                    </TableBodyCell>
                    <TableBodyCell>
                        <P size="2xl" align="center">
                            {path.durations}
                        </P>
                    </TableBodyCell>
                    <TableBodyCell>
                        {#each path.previousActivities as previousPath, i}
                            {#if path.previousActivities.length - 1 === i && $activityInTable.find(x => x.index === previousPath).durations !==0 }
                                {$activityInTable.find(x => x.index === previousPath).nameOfActivity}
                            {:else if $activityInTable.find(x => x.index === previousPath).durations !==0 }
                                {$activityInTable.find(x => x.index === previousPath).nameOfActivity + ", "}
                            {/if}
                        {/each}
                    </TableBodyCell>
                    <TableBodyCell>
                        {path.start === null ? "" : path.start}
                    </TableBodyCell>
                    <TableBodyCell>
                        {path.earliestEnd === null ? "" : path.earliestEnd}
                    </TableBodyCell>
                    <TableBodyCell>
                        {path.latestEnd === null ? "" : path.latestEnd}
                    </TableBodyCell>
                    <TableBodyCell>
                        {path.timeReserve === null ? "" : path.timeReserve}
                    </TableBodyCell>
                    <TableBodyCell>
                        {path.timeReserve === null ? "" : path.freeReserve}
                    </TableBodyCell>
                    <TableBodyCell>
                        {path.timeReserve === null ? "" : path.independentReserve}
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>

<style>
    .table {
        position: relative;
        top: 80px;
        left: 0;
        width: 100%;
        height: calc(100% - 40px);
        z-index: 0;
    }

</style>