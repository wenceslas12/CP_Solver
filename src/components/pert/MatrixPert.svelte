<script>
    import {Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import {nodePert, pathsPERT, selectedPath, style} from "../../routes/store/PertStore.js";
    import {modal} from "../../routes/store/ModalStore.js";

    let numberNode = 0;
    let size = Array.from({length: numberNode}, (_, index) => index);

    function increaseNumberNode() {
        const circle = {
            cx: 100,
            cy: 100,
            r: $style.sizeCircle,
            index: $nodePert.length === 0 ? 0 : $nodePert[$nodePert.length - 1].index + 1,
            actualLeftValue: 0,
            actualRightValue: null,
            actualDispersion: null,
            pathsTo: [],
            pathsFrom: []
        };
        $nodePert = $nodePert.concat(circle);

        numberNode += 1;
        size = Array.from({length: numberNode}, (_, index) => index);
    }

    function decreaseNumberNode() {
        for (let path of $nodePert.find(x => x.index === $nodePert.length - 1).pathsFrom) {
            $nodePert.find(x => x.index === path.circleTo.index).pathsTo.splice($nodePert.find(x => x.index === path.circleTo.index).pathsTo.find(x => x.index === path.index), 1);
            $pathsPERT.splice($pathsPERT.findIndex(x => x.index === path.index), 1);
        }
        for (let path of $nodePert.find(x => x.index === $nodePert.length - 1).pathsTo) {
            $nodePert.find(x => x.index === path.circleFrom.index).pathsFrom.splice($nodePert.find(x => x.index === path.circleFrom.index).pathsFrom.find(x => x.index === path.index), 1);
            $pathsPERT.splice($pathsPERT.findIndex(x => x.index === path.index), 1);
        }
        $nodePert.splice($nodePert.findIndex(x => x.index === $nodePert.length - 1), 1);

        //reindex node
        $nodePert.forEach((circle, index) => {
            circle.index = index;
            circle.actualLeftValue = 0;
            circle.actualRightValue = null;

        })

        $pathsPERT.forEach(path => {
            path.leftValue = null;
            path.rightValue = null;
        })

        //value update
        $nodePert = $nodePert;
        $pathsPERT = $pathsPERT;
    }

    function addPath(row, column) {
        const path = {
            circleFrom: $nodePert.find(x => x.index === row),
            circleTo: $nodePert.find(x => x.index === column),
            index: $pathsPERT.length === 0 ? 0 : $pathsPERT[$pathsPERT.length - 1].index + 1,
            nameOfActivity: "",
            optimisticEstimate: null,
            mostLikelyEstimate: null,
            pessimisticEstimate: null,
            meanValue: null,
            start: null,
            earliestEnd: null,
            latestEnd: null,
            timeReserve: null,
            leftValue: null,
            rightValue: null,
            dispersion: null
        };
        $pathsPERT = $pathsPERT.concat(path);

        //Add path to nodes
        $nodePert.find(x => x.index === row).pathsFrom = $nodePert.find(x => x.index === row).pathsFrom.concat($pathsPERT[$pathsPERT.length - 1]);
        $nodePert.find(x => x.index === column).pathsTo = $nodePert.find(x => x.index === column).pathsTo.concat($pathsPERT[$pathsPERT.length - 1]);


        modal.set({show: true, type: "add_path_pert"});
    }

    function updatePath(indexNodeFrom, indexNodeTo) {
        let paths = $pathsPERT.find(function (v, i) {
            return v.circleTo.index === indexNodeTo && v.circleFrom.index === indexNodeFrom;
        })

        $selectedPath = paths;

        modal.set({show: true, type: "edit_path_pert"})
    }

    function nodePlacement() {
        let xCoordinates = 100;
        let yCoordinates = 200;
        let unprocessedNode = [];


        for (let node of $nodePert) {
            if (node.index === 0) {
                //positions fist node
                $nodePert.find(x => x.index === 0).cx = xCoordinates;
                $nodePert.find(x => x.index === 0).cy = yCoordinates;
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
                    $nodePert.find(x => x.index === nextNode.index).cx = xCoordinates;
                    $nodePert.find(x => x.index === nextNode.index).cy = yCoordinates;
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
            {#each $nodePert as column}
                <TableHeadCell class="bg-blue-100  border-2 border-r-blue-500 border-b-blue-500">
                    {column.index}
                </TableHeadCell>
            {/each}
        </TableHead>
        <TableBody class="divide-y">
            {#each $nodePert as row}
                <TableBodyRow>
                    <TableBodyCell class="border-solid border-2 border-sky-100">{row.index}</TableBodyCell>
                    {#each $nodePert as cell}
                        {#if row.index === cell.index || row.index > cell.index}
                            <TableBodyCell class="bg-blue-100 border-solid border-2 border-sky-100"></TableBodyCell>
                        {:else if $pathsPERT.filter((e) => e.circleFrom.index === row.index && e.circleTo.index === cell.index).length === 1}
                            <TableBodyCell on:click={() => updatePath(row.index,cell.index)}
                                           class=" border-solid border-2 border-sky-100 text-center">{Number((($pathsPERT.filter((e) => e.circleFrom.index === row.index && e.circleTo.index === cell.index)[0].optimisticEstimate +
                                4 * $pathsPERT.filter((e) => e.circleFrom.index === row.index && e.circleTo.index === cell.index)[0].mostLikelyEstimate
                                + $pathsPERT.filter((e) => e.circleFrom.index === row.index && e.circleTo.index === cell.index)[0].pessimisticEstimate) / 6).toFixed(2))}
                            </TableBodyCell>
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
        top: 80px;
        left: 0;
        width: 100%;
        height: calc(100% - 40px);
        z-index: 0;
    }

</style>