<script>
    import {Button, Range, Label, Toggle} from "flowbite-svelte";
    import {modal} from "../../../routes/store/ModalStore.js";
    import {nodeCPM, pathsCPM, selectedNode, style} from "../../../routes/store/CpmStore.js";

    let sizeCircle = $style.sizeCircle;
    let strokeWidth = $style.strokeWidth;
    let gridWidth = $style.gridWidth;
    let fontSize = $style.fontSize;

    let onIndexNode = $style.onIndexNode;
    let onValueInNode = $style.onValueInNode;
    let onNameActivity = $style.onNameActivity;
    let onEdgeValuesOnTheLine = $style.onEdgeValuesOnTheLine;
    let onActivityDurations = $style.onActivityDurations;

    function setStyle(){
        //Set r for all circle
        for (let i = 0; i < $nodeCPM.length; i++) {
            $nodeCPM[i].r =sizeCircle;
        }

        style.set({
            sizeCircle: sizeCircle,
            strokeWidth: strokeWidth,
            gridWidth: gridWidth,
            fontSize: fontSize,
            onIndexNode: onIndexNode,
            onValueInNode: onValueInNode,
            onNameActivity: onNameActivity,
            onEdgeValuesOnTheLine: onEdgeValuesOnTheLine,
            onActivityDurations: onActivityDurations
        })

        //value update
        $selectedNode = $selectedNode;
        $nodeCPM = $nodeCPM;
        $pathsCPM = $pathsCPM;

        modal.set({show: false, type: ""})
    }
</script>

<div class="absolute w-1/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-center bg-white bg-opacity-70 rounded-lg">
    <h1>Settings</h1>
    <svg viewBox="0 0 408 202">
        <defs>
            <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX={sizeCircle-26 + (5*(Math.abs(100-sizeCircle)/10))-15+(1.7*((sizeCircle-10)/10))}
                    refY="5"
                    markerUnits="userSpaceOnUse"
                    markerWidth="15"
                    markerHeight="15"
                    orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
            </marker>
        </defs>

        <line
                x1={400}
                y1={100}
                x2={sizeCircle}
                y2={100}
                stroke="black"
                marker-end="url(#arrow)"
                stroke-width={strokeWidth}
        />
        {#if onActivityDurations}
            <!--Path durations-->
            <text
                    x={(parseFloat("350") + parseFloat(sizeCircle.toString())) / 2 + 25}
                    y={((parseFloat("100") + parseFloat("100")) / 2) - 15}
                    font-size={fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                5
            </text>
        {/if}
        {#if onEdgeValuesOnTheLine}
            <!--Path left value-->
            <text
                    x={((parseFloat(350) + parseFloat(sizeCircle)) / 2  - 100 + sizeCircle)}
                    y={((parseFloat("100") + parseFloat("100")) / 2) - 15}
                    font-size={fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                3
            </text>
        {/if}
        {#if onNameActivity}
            <!--Path left value-->
            <text
                    x={(parseFloat("350") + parseFloat(sizeCircle.toString())) / 2 + 25}
                    y={((parseFloat("100") + parseFloat("100")) / 2) - 40}
                    font-size={fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                Activity name
            </text>
        {/if}
        <circle
                r={sizeCircle}
                cx={sizeCircle}
                cy={100}
                stroke="black"
                fill="white"
                stroke-width={gridWidth}
        />
        <!--horizontal line in a circle-->
        <line
                x1="0"
                y1="100"
                x2={sizeCircle + sizeCircle}
                y2="100"
                stroke="black"
                stroke-width={gridWidth}
        />
        <!--vertical line in a circle-->
        <line
                x1={sizeCircle}
                y1="100"
                x2={sizeCircle}
                y2={100 + sizeCircle}
                stroke="black"
                stroke-width={gridWidth}
        />
        <!-- Index circle -->
        {#if onIndexNode }
            <text
                    x={sizeCircle}
                    y={100 - sizeCircle/2}
                    font-size={fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                0
            </text>
        {/if}
        {#if onValueInNode}
            <!-- Left value -->
            <text
                    x={sizeCircle - sizeCircle/2}
                    y={100 +sizeCircle/2}
                    font-size={fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                12
            </text>
            <!-- Right value -->
            <text
                    x={sizeCircle + sizeCircle/2}
                    y={100 + sizeCircle/2}
                    font-size={fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                12
            </text>
        {/if}

    </svg>
    <Label for="size_circle">Size Node</Label>
    <Range id="size_circle" min="10" max="100" bind:value={sizeCircle} step="10"/>

    <Label for="stroke_width">Line thickness</Label>
    <Range id="stroke_width" min="1" max="5" bind:value={strokeWidth} step="1"/>

    <Label for="circle_grid_width">Circle thickness</Label>
    <Range id="circle_grid_width" min="1" max="5" bind:value={gridWidth} step="1"/>

    <Label for="font_size">Font size</Label>
    <Range id="font_size" min="6" max="30" bind:value={fontSize} step="2" class="mb-1"/>

    <div class="grid">
        <Toggle checked={onIndexNode} on:click={() => (onIndexNode = !onIndexNode)}>On/Off index node
        </Toggle>
        <Toggle checked={onValueInNode} on:click={() => (onValueInNode = !onValueInNode)}> On/Off value in
            node
        </Toggle>
        <Toggle checked={onNameActivity} on:click={() => (onNameActivity = !onNameActivity)}>On/Off name
            activity
        </Toggle>
        <Toggle checked={onEdgeValuesOnTheLine} on:click={() => (onEdgeValuesOnTheLine = !onEdgeValuesOnTheLine)}
        >On/Off edge values
        </Toggle>
        <Toggle checked={onActivityDurations} on:click={() => (onActivityDurations = !onActivityDurations)}
        > On/Off activity durations
        </Toggle>
    </div>

    <Button on:click={setStyle}>Ok</Button>
    <Button on:click={() => modal.set({show: false, type: ""}) } class ="bg-red-900">Cancel</Button>
</div>


<style>
    h1{
        font-size: large;
    }
    svg {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: white;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
</style>