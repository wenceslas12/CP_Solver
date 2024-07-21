<script>
    import {pathsPERT, nodePert, selectedNode, changePertMode, style} from "../../routes/store/PertStore.js";
    import {modal} from "../../routes/store/ModalStore.js";

    let pathBetweenNodeAndMouse;

    function dragPathFromCirclesToMouse(event) {
        pathBetweenNodeAndMouse = "M " + ($selectedNode.cx) + " " + ($selectedNode.cy) + " L" + (event.clientX) + " " + (event.clientY);
    }

    function changeSVG() {

        changePertMode.set("ChartPERT");
    }

    function testExistPathBetweenNode(node) {
        let pathsWithSelectedNode = $pathsPERT.filter(x => x.circleFrom === $selectedNode);
        let existPath = pathsWithSelectedNode.find(x => x.circleTo === node);

        return existPath !== undefined;
    }

    function addPath(node) {
        const path = {
            circleFrom: $nodePert.find(x => x.index === $selectedNode.index),
            circleTo: $nodePert.find(x => x.index === node.index),
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
        $nodePert.find(x => x.index === $selectedNode.index).pathsFrom = $nodePert.find(x => x.index === $selectedNode.index).pathsFrom.concat($pathsPERT[$pathsPERT.length - 1]);
        $nodePert.find(x => x.index === node.index).pathsTo = $nodePert.find(x => x.index === node.index).pathsTo.concat($pathsPERT[$pathsPERT.length - 1]);

        changeSVG();
    }

    function onKeyDown(e) {
        if (e.key === "Escape") {
            changeSVG();
        }
    }

</script>

<svelte:window on:keydown|preventDefault={onKeyDown}/>


<svg on:mousemove={(event) => dragPathFromCirclesToMouse(event)}>
    <!-- Paths between nodes -->
    <defs>
        <!-- A marker to be used as an arrowhead -->
        <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="50"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z"/>
        </marker>
    </defs>
    {#each $pathsPERT as path}
        <line x1={path.circleFrom.cx}
              y1={path.circleFrom.cy}
              x2={path.circleTo.cx}
              y2={path.circleTo.cy}
              stroke="black"
              stroke-width="2"
              marker-end="url(#arrow)"/>
    {/each}

    <!-- Paths between node and mouse -->
    <defs>
        <!-- A marker to be used as an arrowhead -->
        <marker
                id="arrowToMouse"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z"/>
        </marker>
    </defs>
    <path id="to" d={pathBetweenNodeAndMouse} stroke="red" stroke-width="3" fill="none"
          marker-end="url(#arrowToMouse)"/>

    <!-- Nodes -->
    {#each $nodePert as node, index}
        {#if (node.index <= $selectedNode.index || testExistPathBetweenNode(node))}
            <circle id={node.index}
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r}
                    stroke="#ccc"
                    stroke-width={$style.gridWidth}
                    fill={node === $selectedNode ? '#ccc' : 'white'}
            />
            <text
                    x={node.cx}
                    y={node.cy}
                    font-size="12"
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {node.index}
            </text>
        {:else }
            <circle id={node.index}
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r}
                    fill={node === $selectedNode ? '#ccc' : 'white'}
                    stroke="black"
                    stroke-width={$style.gridWidth}
                    on:click={() => modal.set({show: true, type: "add_path_pert"})}
                    on:click={() => addPath(node)}
            />
            <text
                    x={node.cx}
                    y={node.cy}
                    font-size="12"
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {node.index}
            </text>
        {/if}
    {/each}
</svg>

<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
</style>