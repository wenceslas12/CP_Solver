<script>
    import {Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import {nodeCPM, pathsCPM, selectedPath, style} from "../../routes/store/CpmStore.js";
    import {modal} from "../../routes/store/ModalStore.js";

    let numberNode = 0;
    let size = Array.from({length: numberNode}, (_, index) => index);

    function increaseNumberNode() {
        const circle = {
            cx: 100,
            cy: 100,
            r: $style.sizeCircle,
            index: $nodeCPM.length === 0 ? 0 : $nodeCPM[$nodeCPM.length - 1].index + 1,
            actualLeftValue: 0,
            actualRightValue: null,
            pathsTo: [],
            pathsFrom: []
        };
        $nodeCPM = $nodeCPM.concat(circle);

        numberNode += 1;
        size = Array.from({length: numberNode}, (_, index) => index);
    }

    function decreaseNumberNode() {
        for (let path of $nodeCPM.find(x => x.index === $nodeCPM.length - 1).pathsFrom) {
            $nodeCPM.find(x => x.index === path.circleTo.index).pathsTo.splice($nodeCPM.find(x => x.index === path.circleTo.index).pathsTo.find(x => x.index === path.index), 1);
            $pathsCPM.splice($pathsCPM.findIndex(x => x.index === path.index), 1);
        }
        for (let path of $nodeCPM.find(x => x.index === $nodeCPM.length - 1).pathsTo) {
            $nodeCPM.find(x => x.index === path.circleFrom.index).pathsFrom.splice($nodeCPM.find(x => x.index === path.circleFrom.index).pathsFrom.find(x => x.index === path.index), 1);
            $pathsCPM.splice($pathsCPM.findIndex(x => x.index === path.index), 1);
        }
        $nodeCPM.splice($nodeCPM.findIndex(x => x.index === $nodeCPM.length - 1), 1);

        //reindex node
        $nodeCPM.forEach((circle, index) => {
            circle.index = index;
            circle.actualLeftValue = 0;
            circle.actualRightValue = null;

        })

        $pathsCPM.forEach(path => {
            path.leftValue = null;
            path.rightValue = null;
        })

        //value update
        $nodeCPM = $nodeCPM;
        $pathsCPM = $pathsCPM;
    }

    function addPath(row, column) {
        const path = {
            circleFrom: $nodeCPM.find(x => x.index === row),
            circleTo: $nodeCPM.find(x => x.index === column),
            index: $pathsCPM.length === 0 ? 0 : $pathsCPM[$pathsCPM.length - 1].index + 1,
            nameOfActivity: "",
            durations: null,
            start: null,
            earliestEnd: null,
            latestEnd: null,
            timeReserve: null,
            leftValue: null,
            rightValue: null
        };
        $pathsCPM = $pathsCPM.concat(path);

        //Add path to nodes
        $nodeCPM.find(x => x.index === row).pathsFrom = $nodeCPM.find(x => x.index === row).pathsFrom.concat($pathsCPM[$pathsCPM.length - 1]);
        $nodeCPM.find(x => x.index === column).pathsTo = $nodeCPM.find(x => x.index === column).pathsTo.concat($pathsCPM[$pathsCPM.length - 1]);


        //indexNodeFromMatrix.set({nodeFrom: row, nodeTo: column});
        modal.set({show: true, type: "set_size_matrix_cpm"});
    }

    function updatePath(indexNodeFrom, indexNodeTo) {
        let paths = $pathsCPM.find(function (v, i) {
            return v.circleTo.index === indexNodeTo && v.circleFrom.index === indexNodeFrom;
        })

        $selectedPath = paths;

        modal.set({show: true, type: "edit_path_cpm"})
    }

    function nodePlacement() {
        let xCoordinates = 100;
        let yCoordinates = 200;
        let unprocessedNode = [];


        for (let node of $nodeCPM) {
            if (node.index === 0) {
                //positions fist node
                $nodeCPM.find(x => x.index === 0).cx = xCoordinates;
                $nodeCPM.find(x => x.index === 0).cy = yCoordinates;
                xCoordinates += 200;

                let nextNodes = [];
                for (let path of node.pathsFrom) {
                    nextNodes.push(path.circleTo);
                }
                unprocessedNode.push(nextNodes)

            } else if (unprocessedNode.length !== 0) {
                //position next nodes
                let nextNodes = [];
                for (let nextNode of unprocessedNode[0]) {
                    $nodeCPM.find(x => x.index === nextNode.index).cx = xCoordinates;
                    $nodeCPM.find(x => x.index === nextNode.index).cy = yCoordinates;
                    yCoordinates += 125;

                    if (nextNode.pathsFrom.length !== 0) {
                        for (let path of nextNode.pathsFrom) {
                            if (nextNodes.find(x => x.index === path.circleTo.index) === undefined) {
                                nextNodes.push(path.circleTo)
                            }
                        }
                    }
                }
                yCoordinates = 200;
                xCoordinates += 200
                unprocessedNode.splice(0, 1);
                unprocessedNode.push(nextNodes)
            }

        }
    }

</script>
<div class="table">
    <Table hoverable={true}>
        <TableHead>
            <TableHeadCell class="bg-blue-100 border-2 border-r-blue-500 border-b-blue-500">

            </TableHeadCell>
            {#each $nodeCPM as column}
                <TableHeadCell class="bg-blue-100  border-2 border-r-blue-500 border-b-blue-500">
                    {column.index}
                </TableHeadCell>
            {/each}
        </TableHead>
        <TableBody class="divide-y">
            {#each $nodeCPM as row}
                <TableBodyRow>
                    <TableBodyCell class="border-solid border-2 border-sky-100">{row.index}</TableBodyCell>
                    {#each $nodeCPM as cell}
                        {#if row.index === cell.index || row.index > cell.index}
                            <TableBodyCell class="bg-blue-100 border-solid border-2 border-sky-100"></TableBodyCell>
                        {:else if $pathsCPM.filter((e) => e.circleFrom.index === row.index && e.circleTo.index === cell.index).length === 1}
                            <TableBodyCell on:click={() => updatePath(row.index,cell.index)}
                                           class=" border-solid border-2 border-sky-100 text-center">{$pathsCPM.filter((e) => e.circleFrom.index === row.index && e.circleTo.index === cell.index)[0].durations}</TableBodyCell>
                        {:else}
                            <TableBodyCell on:click={() => addPath(row.index,cell.index)}
                                           class="border-solid border-2 border-sky-100"></TableBodyCell>
                        {/if}
                    {/each}
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <Button on:click={nodePlacement} class="mt-14">
        Placement node
    </Button>

    <Button on:click={increaseNumberNode}>
        Increase Rows
    </Button>
    <Button on:click={decreaseNumberNode}>
        Decrease Rows
    </Button>
</div>

<style>
    .table {
        position: relative;
        top: 80px; /* Adjust to match the height of controls */
        left: 0;
        width: 100%;
        height: calc(100% - 40px); /* Adjust the height to leave space for controls */
        z-index: 0; /* Place SVG behind controls */
    }

</style>