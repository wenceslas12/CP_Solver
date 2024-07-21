<script>
    import {pathsCPM, nodeCPM, selectedNode, changeCpmMode, style} from "../../routes/store/CpmStore.js";
    import {modal} from "../../routes/store/ModalStore.js";

    let pathBetweenNodeAndMouse;

    function dragPathFromCirclesToMouse(event) {
        pathBetweenNodeAndMouse = "M " + ($selectedNode.cx) + " " + ($selectedNode.cy) + " L" + (event.clientX) + " " + (event.clientY);
    }

    function changeSVG() {
        changeCpmMode.set("ChartCPM");
    }


    function testExistPathBetweenNode(node){
        let pathsWithSelectedNode = $pathsCPM.filter(x => x.circleFrom === $selectedNode);
        let existPath = pathsWithSelectedNode.find(x => x.circleTo === node);

        return existPath !== undefined;
    }


    function addPath(node) {
        const path = {
            circleFrom: $nodeCPM.find(x => x.index === $selectedNode.index),
            circleTo: $nodeCPM.find(x => x.index === node.index),
            index: $pathsCPM.length === 0 ? 0 : $pathsCPM[$pathsCPM.length - 1].index + 1,
            nameOfActivity: "",
            durations: null,
            start: null,
            earliestEnd: null,
            latestEnd: null,
            timeReserve:null,
            leftValue: null,
            rightValue:null,
        };

        $pathsCPM = $pathsCPM.concat(path);

        //Add path to nodes
        $nodeCPM.find(x => x.index === $selectedNode.index).pathsFrom = $nodeCPM.find(x => x.index === $selectedNode.index).pathsFrom.concat($pathsCPM[$pathsCPM.length - 1]);
        $nodeCPM.find(x => x.index === node.index).pathsTo = $nodeCPM.find(x => x.index === node.index).pathsTo.concat($pathsCPM[$pathsCPM.length - 1]);

        changeSVG();
    }

    function onKeyDown(e){
        if(e.key === "Escape"){
            changeSVG();
        }
    }

</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

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
    {#each $pathsCPM as path}
        <line x1={path.circleFrom.cx}
              y1={path.circleFrom.cy}
              x2={path.circleTo.cx}
              y2={path.circleTo.cy}
              stroke="black"
              stroke-width={$style.strokeWidth}
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
    <path id="to" d={pathBetweenNodeAndMouse} stroke="red" stroke-width={$style.strokeWidth} fill="none"
          marker-end="url(#arrowToMouse)"/>
    <!-- Nodes -->
    {#each $nodeCPM as node, index}
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
                    font-size={$style.fontSize}
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
                    stroke="black"
                    stroke-width={$style.gridWidth}
                    fill={node === $selectedNode ? '#ccc' : 'white'}
                    on:click={() => modal.set({show: true, type: "add_path_cpm"})}
                    on:click={() => addPath(node)}
            />
            <text
                    x={node.cx}
                    y={node.cy}
                    font-size={$style.fontSize}
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