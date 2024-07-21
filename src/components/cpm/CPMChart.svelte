<script>
    import {Button, ButtonGroup} from 'flowbite-svelte';
    import IoIosArrowRoundForward from 'svelte-icons/io/IoIosArrowRoundForward.svelte'
    import IoIosCloseCircleOutline from 'svelte-icons/io/IoIosCloseCircleOutline.svelte'
    import TiEdit from 'svelte-icons/ti/TiEdit.svelte'
    import FaPlusCircle from 'svelte-icons/fa/FaPlusCircle.svelte'
    import IoMdSkipForward from 'svelte-icons/io/IoMdSkipForward.svelte'
    import IoMdPlay from 'svelte-icons/io/IoMdPlay.svelte'
    import IoMdSkipBackward from 'svelte-icons/io/IoMdSkipBackward.svelte'
    import CPMChartRollup from "./CPMChartRollup.svelte";
    import Canvas from "./Canvas.svelte";

    import {
        pathsCPM,
        nodeCPM,
        changeCpmMode,
        selectedNode,
        selectedPath,
        isCPM,
        style, isCanvas
    } from "../../routes/store/CpmStore.js";
    import {modal} from "../../routes/store/ModalStore.js";



    let selectNode;
    let selectPath;
    let adjusting = false;
    let circleElements = [];
    let nameOfActivity = "A", durations = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    let isDragging = false;
    let isOnCPM = false;

    let innerWidth = typeof window !== 'undefined' ? window.innerWidth : 0;


    function addNode() {
        //Disable GantChart
        isCPM.set(true);

        //Add node to store
        const circle = {
            cx: 100,
            cy: 200,
            r: $style.sizeCircle,
            index: $nodeCPM.length === 0 ? 0 : $nodeCPM[$nodeCPM.length - 1].index + 1,
            actualLeftValue: 0,
            actualRightValue: null,
            pathsTo: [],
            pathsFrom: []
        };

        $nodeCPM = $nodeCPM.concat(circle);

        resetPath();
        resetNode();


        //value update
        $nodeCPM = $nodeCPM
        $pathsCPM = $pathsCPM

        //set null to select node
        $selectedNode = null;
        selectNode = false;

        isCPM.set(true);
    }


    function cloneWithoutCircularReferences(obj, map = new WeakMap()) {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (map.has(obj)) return map.get(obj);

        const result = Array.isArray(obj) ? [] : {};

        map.set(obj, result);

        for (const key in obj) {
            result[key] = cloneWithoutCircularReferences(obj[key], map);
        }

        return result;
    }

    function resetNode() {
        $nodeCPM.forEach(function (node) {
            node.actualLeftValue = 0;
            node.actualRightValue = null;
        });
    }

    function resetPath() {
        $pathsCPM.forEach(function (path) {
            path.leftValue = null;
            path.rightValue = null;
            path.timeReserve = null;
        })
    }

    function testExistOneFirstNodeAndOneLastNode() {
        return ($nodeCPM.filter(x => x.pathsFrom.length === 0).length === 1 && $nodeCPM.filter(x => x.pathsTo.length === 0).length === 1 && $nodeCPM.length > 1 && $pathsCPM.length > 0);
    }


    let firstPass = [];
    let secondPass = [];

    let actualNode = -1;
    let actualPath = -1;
    let actualStep = 0;

    function onCPM() {
        firstPass = cloneWithoutCircularReferences($nodeCPM);
        secondPass = cloneWithoutCircularReferences($nodeCPM).reverse();

        isOnCPM = true;
    }

    function backStep() {
        resetNode();
        resetPath();

        onCPM();

        let stepForFor = actualStep;
        actualStep = 0;

        for (let i = 0; i < stepForFor - 1; i++) {
            stepByStep();
        }

    }

    function stepByStep() {
        if (testExistOneFirstNodeAndOneLastNode()) {
            if (firstPass.length > 1) {
                let nodeWhereNotHavePathTo = firstPass.find(x => x.pathsTo.length === 0);
                actualNode = nodeWhereNotHavePathTo.index;

                let path = nodeWhereNotHavePathTo.pathsFrom[0];
                actualPath = path.index;
                if ($nodeCPM.find(x => x.index === path.circleTo.index).actualLeftValue < path.durations + $nodeCPM.find(x => x.index === path.circleFrom.index).actualLeftValue) {
                    $nodeCPM.find(x => x.index === path.circleTo.index).actualLeftValue = path.durations + $nodeCPM.find(x => x.index === path.circleFrom.index).actualLeftValue;
                }
                $pathsCPM.find(x => x.index === path.index).rightValue = $pathsCPM.find(x => x.index === path.index).circleFrom.actualLeftValue + path.durations;
                firstPass.find(x => x.index === path.circleTo.index).pathsTo.splice(firstPass.find(x => x.index === path.circleTo.index).pathsTo.indexOf(path), 1);
                nodeWhereNotHavePathTo.pathsFrom.splice(0, 1);

                if (nodeWhereNotHavePathTo.pathsFrom.length === 0) {
                    firstPass.splice(firstPass.indexOf(nodeWhereNotHavePathTo), 1);
                }
            } else if (secondPass.length > 1) {
                let nodeWhereNotHavePathFrom = secondPass.find(x => x.pathsFrom.length === 0);
                actualNode = nodeWhereNotHavePathFrom.index;

                if ((nodeWhereNotHavePathFrom.index === $nodeCPM.length - 1) && $nodeCPM.find(x => x.index === nodeWhereNotHavePathFrom.index).actualRightValue !== $nodeCPM.find(x => x.index === nodeWhereNotHavePathFrom.index).actualLeftValue) {
                    $nodeCPM.find(x => x.index === nodeWhereNotHavePathFrom.index).actualRightValue = $nodeCPM.find(x => x.index === nodeWhereNotHavePathFrom.index).actualLeftValue;
                } else {

                    let path = nodeWhereNotHavePathFrom.pathsTo[0];
                    actualPath = path.index;
                    if ($nodeCPM.find(x => x.index === path.circleFrom.index).actualRightValue > $nodeCPM.find(x => x.index === path.circleTo.index).actualRightValue - path.durations
                        || $nodeCPM.find(x => x.index === path.circleFrom.index).actualRightValue === null) {
                        $nodeCPM.find(x => x.index === path.circleFrom.index).actualRightValue = $nodeCPM.find(x => x.index === path.circleTo.index).actualRightValue - path.durations;
                    }
                    $pathsCPM.find(x => x.index === path.index).leftValue = $pathsCPM.find(x => x.index === path.index).circleTo.actualRightValue - path.durations;
                    secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.splice(secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.indexOf(path), 1);
                    nodeWhereNotHavePathFrom.pathsTo.splice(0, 1);
                }
                if (nodeWhereNotHavePathFrom.pathsTo.length === 0) {
                    secondPass.splice(secondPass.indexOf(nodeWhereNotHavePathFrom), 1);
                }
            } else {
                let path;
                for (path of $pathsCPM) {
                    path.timeReserve = Math.abs(path.circleTo.actualRightValue - path.circleFrom.actualLeftValue - path.durations);
                    if (path.timeReserve === 0) {
                        path.start = path.circleFrom.actualRightValue;
                        path.earliestEnd = path.circleTo.actualRightValue;
                        path.latestEnd = path.circleTo.actualRightValue;
                    } else {
                        path.start = path.circleFrom.actualLeftValue;
                        path.earliestEnd = path.circleFrom.actualLeftValue + path.durations;
                        path.latestEnd = path.circleTo.actualRightValue;
                    }
                    actualNode = -1;
                    actualPath = -1;
                    isCPM.set(false);
                }
            }

            $nodeCPM = $nodeCPM;
            $pathsCPM = $pathsCPM;

        } else {
            modal.set({show: true, type: "cannot_perform_CPM_method"})
        }

        actualStep++;
    }


    function CPM() {
        onCPM();

        if (testExistOneFirstNodeAndOneLastNode()) {
            //Reset nodes and paths
            resetNode();
            resetPath();

            //From first node to last node
            for (let i = 0; i < $nodeCPM.length; i++) {
                let nodeWhereNotHavePathTo = firstPass.find(x => x.pathsTo.length === 0);
                let path;
                for (path of nodeWhereNotHavePathTo.pathsFrom) {
                    if ($nodeCPM.find(x => x.index === path.circleTo.index).actualLeftValue < path.durations + $nodeCPM.find(x => x.index === path.circleFrom.index).actualLeftValue) {
                        $nodeCPM.find(x => x.index === path.circleTo.index).actualLeftValue = path.durations + $nodeCPM.find(x => x.index === path.circleFrom.index).actualLeftValue;
                    }
                    $pathsCPM.find(x => x.index === path.index).rightValue = $pathsCPM.find(x => x.index === path.index).circleFrom.actualLeftValue + path.durations;
                    firstPass.find(x => x.index === path.circleTo.index).pathsTo.splice(firstPass.find(x => x.index === path.circleTo.index).pathsTo.indexOf(path), 1);

                }

                firstPass.splice(firstPass.indexOf(nodeWhereNotHavePathTo), 1);
            }


            //From last node to fist node
            for (let i = 0; i < $nodeCPM.length; i++) {
                let nodeWhereNotHavePathFrom = secondPass.find(x => x.pathsFrom.length === 0);
                //Set last node right value to left value
                if (i === 0) {
                    $nodeCPM.find(x => x.index === nodeWhereNotHavePathFrom.index).actualRightValue = $nodeCPM.find(x => x.index === nodeWhereNotHavePathFrom.index).actualLeftValue;
                }
                let path;
                for (path of nodeWhereNotHavePathFrom.pathsTo) {
                    if ($nodeCPM.find(x => x.index === path.circleFrom.index).actualRightValue > $nodeCPM.find(x => x.index === path.circleTo.index).actualRightValue - path.durations
                        || $nodeCPM.find(x => x.index === path.circleFrom.index).actualRightValue === null) {
                        $nodeCPM.find(x => x.index === path.circleFrom.index).actualRightValue = $nodeCPM.find(x => x.index === path.circleTo.index).actualRightValue - path.durations;
                    }

                    $pathsCPM.find(x => x.index === path.index).leftValue = $pathsCPM.find(x => x.index === path.index).circleTo.actualRightValue - path.durations;
                    secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.splice(secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.indexOf(path), 1);

                }
                secondPass.splice(secondPass.indexOf(nodeWhereNotHavePathFrom), 1);
            }

            // Set start and ends activity
            let path;
            for (path of $pathsCPM) {
                path.timeReserve = Math.abs(path.circleTo.actualRightValue - path.circleFrom.actualLeftValue - path.durations);
                if (path.timeReserve === 0) {
                    path.start = path.circleFrom.actualRightValue;
                    path.earliestEnd = path.circleTo.actualRightValue;
                    path.latestEnd = path.circleTo.actualRightValue;
                } else {
                    path.start = path.circleFrom.actualLeftValue;
                    path.earliestEnd = path.circleFrom.actualLeftValue + path.durations;
                    path.latestEnd = path.circleTo.actualRightValue;
                }
            }


            //Actualization of values
            $pathsCPM = $pathsCPM;
            $nodeCPM = $nodeCPM;

            //Enable GanttChart
            isCPM.set(false);
        } else {
            modal.set({show: true, type: "cannot_perform_CPM_method"})
        }
    }

    function selectingNode(circle, event) {
        if (!adjusting) {
            event.stopPropagation();
            selectNode = circle;
            selectedNode.set(selectNode);

        }
    }

    function selectingPath(path, event) {
        if (!adjusting) {
            event.stopPropagation();
            selectPath = path;
            selectedPath.set(selectPath);
        }
    }

    function startDrag() {
        isDragging = true;
    }

    function stopDrag() {
        isDragging = false;
    }

    function move(event) {
        if (isDragging && selectNode) {
            selectNode.cx = event.clientX;
            selectNode.cy = event.clientY;
            $nodeCPM = $nodeCPM;
            $pathsCPM = $pathsCPM;
        }
    }

    function changeSVG() {
        changeCpmMode.set("DrawPath");
    }

    function deleteNode() {
        //remove all paths that are connected with node
        for (let path of $nodeCPM.find(x => x.index === selectNode.index).pathsFrom) {
            $nodeCPM.find(x => x.index === path.circleTo.index).pathsTo.splice($nodeCPM.find(x => x.index === path.circleTo.index).pathsTo.findIndex(x => x.index === path.index), 1);
            $pathsCPM.splice($pathsCPM.findIndex(x => x.index === path.index), 1);
        }
        for (let path of $nodeCPM.find(x => x.index === selectNode.index).pathsTo) {
            $nodeCPM.find(x => x.index === path.circleFrom.index).pathsFrom.splice($nodeCPM.find(x => x.index === path.circleFrom.index).pathsFrom.findIndex(x => x.index === path.index), 1);
            $pathsCPM.splice($pathsCPM.findIndex(x => x.index === path.index), 1);
        }

        //remove node
        $nodeCPM.splice($nodeCPM.findIndex(x => x.index === selectNode.index), 1);

        //reindex node
        $nodeCPM.forEach((circle, index) => {
            circle.index = index;
            circle.actualLeftValue = 0;
            circle.actualRightValue = null;

        })

        resetPath();
        resetNode();


        //value update
        $nodeCPM = $nodeCPM
        $pathsCPM = $pathsCPM

        //set null to select node
        $selectedNode = null;
        selectNode = false;

        isCPM.set(true);
    }

    function deletePath() {
        //remove path from node
        $nodeCPM.find(x => x.index === selectPath.circleFrom.index).pathsFrom.splice($nodeCPM.find(x => x.index === selectPath.circleFrom.index).pathsFrom.findIndex(x => x.index === selectPath.index), 1);
        $nodeCPM.find(x => x.index === selectPath.circleTo.index).pathsTo.splice($nodeCPM.find(x => x.index === selectPath.circleTo.index).pathsTo.findIndex(x => x.index === selectPath.index), 1);

        //remove path
        $pathsCPM.splice($pathsCPM.findIndex(x => x.index === selectPath.index), 1);

        resetPath();
        resetNode();

        //value update
        $nodeCPM = $nodeCPM;
        $pathsCPM = $pathsCPM;

        //set null to select path
        selectPath = null;
        $selectedPath = null;

        isCPM.set(true);
    }

    function removeSelect() {
        selectPath = null;
        selectNode = null;
        $selectedNode = null;
    }

    let isDisabled = true;

</script>

{#if $isCanvas}
    <Canvas/>
{:else }

    <Button pill={true} outline={true} class="!p-2 absolute bottom-0 left-0 ml-2.5 mb-1.5" on:click={addNode}>
        <div class="rollup_button">
            <FaPlusCircle/>
        </div>
    </Button>
    <Button pill={true} outline={true} class="!p-2 absolute bottom-0 left-10 ml-10 mb-1.5 pr-4 w-14 h-14"
            on:click={onCPM}>
        CPM
    </Button>
    {#if isOnCPM}
        <ButtonGroup
                class="flex items-center justify-center fixed bottom-0 left-1/2 transform -translate-x-1/2 ml-10 mb-1.5 pr-4 w-14 h-14">
            <Button on:click={backStep} disabled={!$isCPM}>
                <div class="pert_control">
                    <IoMdSkipBackward/>
                </div>
            </Button>
            <Button on:click={CPM} disabled={!$isCPM}>
                <div class="pert_control">
                    <IoMdPlay/>
                </div>
            </Button>
            <Button on:click={stepByStep} disabled={!$isCPM}>
                <div class="pert_control">
                    <IoMdSkipForward/>
                </div>
            </Button>
        </ButtonGroup>
    {/if}
{/if}

<CPMChartRollup/>

<svelte:window
        bind:innerWidth
/>

<svg overflow="scroll" id='iamsvg'
     on:mousedown={startDrag} on:mouseup={stopDrag} on:mousemove={move} on:click={removeSelect}>

    <!-- A marker to be used as an arrowhead -->

    <defs>
        <marker
                id="arrowRed"
                viewBox="0 0 10 10"
                refX={$style.sizeCircle-26 + (5*(Math.abs(100-$style.sizeCircle)/10))-15+(1.7*(($style.sizeCircle-10)/10))}
                refY="5"
                markerUnits="userSpaceOnUse"
                markerWidth="15"
                markerHeight="15"
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="red"/>
        </marker>
    </defs>
    <defs>
        <marker
                id="arrowBlack"
                viewBox="0 0 10 10"
                refX={$style.sizeCircle-26 + (5*(Math.abs(100-$style.sizeCircle)/10))-15+(1.7*(($style.sizeCircle-10)/10))}
                refY="5"
                markerUnits="userSpaceOnUse"
                markerWidth="15"
                markerHeight="15"
                orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
        </marker>
    </defs>


    {#each $pathsCPM as path}
        <!-- Dotted line when durations is 0 -->
        {#if path.durations === 0}
            {#if path.circleFrom.actualRightValue === path.circleFrom.actualLeftValue && path.circleTo.actualRightValue === path.circleTo.actualLeftValue}
                <line x1={path.circleFrom.cx}
                      y1={path.circleFrom.cy}
                      x2={path.circleTo.cx}
                      y2={path.circleTo.cy}
                      stroke="red"
                      stroke-width={$style.strokeWidth}
                      marker-end="url(#arrowRed)"
                      stroke-dasharray="5,5"
                      on:click={(event) => selectingPath(path, event)}
                      on:contextmenu|stopPropagation|preventDefault={() => {
				adjusting = !adjusting;
			}
			}
                />
            {:else}
                <line x1={path.circleFrom.cx}
                      y1={path.circleFrom.cy}
                      x2={path.circleTo.cx}
                      y2={path.circleTo.cy}
                      stroke={path.index === actualPath ? 'blue' : 'black'}
                      stroke-width={$style.strokeWidth}
                      marker-end="url(#arrowBlack)"
                      stroke-dasharray="5,5"
                      on:click={(event) => selectingPath(path, event)}
                      on:contextmenu|stopPropagation|preventDefault={() => {
				adjusting = !adjusting;
			}
			}
                />
            {/if}
        {:else }
            <!--{#if path.circleFrom.actualRightValue === path.circleFrom.actualLeftValue && path.circleTo.actualRightValue === path.circleTo.actualLeftValue}-->
            {#if path.timeReserve === 0}
                <line x1={path.circleFrom.cx}
                      y1={path.circleFrom.cy}
                      x2={path.circleTo.cx}
                      y2={path.circleTo.cy}
                      stroke="red"
                      stroke-width={$style.strokeWidth}
                      marker-end="url(#arrowRed)"
                      on:click={(event) => selectingPath(path, event)}
                      on:contextmenu|stopPropagation|preventDefault={() => {
				adjusting = !adjusting;
			}
			}
                />
            {:else}
                <line x1={path.circleFrom.cx}
                      y1={path.circleFrom.cy}
                      x2={path.circleTo.cx}
                      y2={path.circleTo.cy}
                      stroke={path === selectPath || path.index === actualPath ? "blue" : "black"}
                      stroke-width={$style.strokeWidth}
                      marker-end="url(#arrowBlack)"
                      on:click={(event) => selectingPath(path, event)}
                      on:contextmenu|stopPropagation|preventDefault={() => {
				adjusting = !adjusting;
			}
			}
                />
            {/if}
        {/if}
        {#if $style.onActivityDurations}
            <!--Path durations-->
            <text
                    x={(parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2}
                    y={((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2) - 15}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    font-weight="bold"
                    alignment-baseline="middle"
            >
                {path.durations} {path.timeReserve === null ? "" : ("(" + path.timeReserve + ")")}
            </text>
        {/if}
        {#if $style.onEdgeValuesOnTheLine}
            <!--Path left value-->
            <text
                    x={path.circleFrom.cx < path.circleTo.cx ? ((parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2 - (path.circleTo.cx - path.circleFrom.cx)/4 ) : ((parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2 + (path.circleFrom.cx - path.circleTo.cx)/4 )}
                    y={path.circleFrom.cy < path.circleTo.cy ?((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2 - (path.circleTo.cy - path.circleFrom.cy)/6) :((parseFloat(path.circleFrom.cy ) + parseFloat(path.circleTo.cy)) / 2 +  (path.circleFrom.cy - path.circleTo.cy)/6)}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {path.leftValue === null ? "" : path.leftValue}
            </text>
            <!--Path right value-->
            <text
                    x={path.circleFrom.cx > path.circleTo.cx ? ((parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2 - (path.circleFrom.cx - path.circleTo.cx)/4) : ((parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2 + (path.circleTo.cx - path.circleFrom.cx)/4)}
                    y={path.circleFrom.cy > path.circleTo.cy ? ((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2 - (path.circleFrom.cy - path.circleTo.cy)/6):((parseFloat(path.circleFrom.cy ) + parseFloat(path.circleTo.cy)) / 2 +  (path.circleTo.cy - path.circleFrom.cy)/6)}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {path.rightValue === null ? "" : path.rightValue}
            </text>
        {/if}
        {#if $style.onNameActivity}
            <!--Name of activity-->
            <text
                    x={(parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2}
                    y={((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2) - 45}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {path.nameOfActivity}
            </text>
        {/if}
        {#if selectPath === path}
            <foreignObject x={((parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2)+15}
                           y={((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2) + 5}
                           width="60" height="30">
                <div class="adjust-button">
                    <button on:click={() => modal.set({show: true, type: "edit_path_cpm"})}>
                        <div class="button-icon">
                            <TiEdit/>
                        </div>
                    </button>
                </div>
            </foreignObject>
            <foreignObject x={((parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2) - 40}
                           y={((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2) + 5}
                           width="60" height="30">
                <div class="adjust-button">
                    <button on:click={deletePath}>
                        <div class="button-icon">
                            <IoIosCloseCircleOutline/>
                        </div>
                    </button>
                </div>
            </foreignObject>
        {/if}
    {/each}
    {#each $nodeCPM as circle, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <circle id={circle.index}
                cx={circle.cx }
                cy={circle.cy}
                r={circle.r}
                bind:this={circleElements[index]}
                on:click={(event) => selectingNode(circle, event)}
                on:contextmenu|stopPropagation|preventDefault={() => {
				adjusting = !adjusting;
			}
			}
                fill={circle === selectNode ? '#ccc' : 'white'}
                stroke={circle.index === actualNode ? 'blue' : 'black'}
                stroke-width={$style.gridWidth}
        />
        {#if $style.onIndexNode}
            <!-- Index circle -->
            <text
                    x={circle.cx}
                    y={circle.cy - $style.sizeCircle/2}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {circle.index}
            </text>
        {/if}
        {#if $style.onValueInNode}
            <!-- Left value -->
            <text
                    x={circle.cx - $style.sizeCircle/2}
                    y={circle.cy + $style.sizeCircle/2}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {circle.actualLeftValue}
            </text>

            <!-- Right value -->
            <text
                    x={circle.cx + $style.sizeCircle/2}
                    y={circle.cy + $style.sizeCircle/2}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {circle.actualRightValue === null ? "0" : circle.actualRightValue }
            </text>
        {/if}
        <!-- Inner grid in circle -->
        <line
                x1={circle.cx - $style.sizeCircle}
                y1={circle.cy}
                x2={circle.cx + $style.sizeCircle}
                y2={circle.cy}
                stroke="black"
                stroke-width={$style.gridWidth}
        />
        <line
                x1={circle.cx}
                y1={circle.cy}
                x2={circle.cx}
                y2={circle.cy + $style.sizeCircle}
                stroke="black"
                stroke-width={$style.gridWidth}
        />

        {#if selectNode}
            <!-- Button for adjusting the selected circle -->
            <!--            <foreignObject x={selected.cx + selected.r} y={selected.cy - selected.r} width="60" height="30" on:click={(event) => createPathBetweenCircles(event)}>-->
            <foreignObject x={selectNode.cx + selectNode.r - 2} y={selectNode.cy - selectNode.r} width="60" height="30"
                           on:click={changeSVG}>
                <div class="adjust-button">
                    <button on:click={adjusting = !adjusting}>
                        <div class="button-icon">
                            <IoIosArrowRoundForward/>
                        </div>
                    </button>
                </div>
            </foreignObject>
            <foreignObject x={selectNode.cx - selectNode.r - 15} y={selectNode.cy - selectNode.r} width="60" height="30"
                           on:click={deleteNode}>
                <div class="adjust-button">
                    <button on:click={adjusting = !adjusting}>
                        <div class="button-icon">
                            <IoIosCloseCircleOutline/>
                        </div>
                    </button>
                </div>
            </foreignObject>
        {/if}
    {/each}

</svg>


<style>
    .rollup_button, .pert_control {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        /*border: 2px solid red;*/
    }


    /* Styl pro labely (popisky) vstupních polí */
    label {
        display: block;
        margin-bottom: 5px;
    }


    input[type="text"],
    input[type="number"] {
        width: 80%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    input[type="submit"] {
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    input[type="submit"]:hover {
        background-color: #0056b3;
    }

    form {
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
    }

    .adjust-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }


    .adjust-button button {
        padding: 0;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .adjust-button button:hover {
        color: #007bff;
    }

    .button-icon {
        margin-right: 5px;
    }
</style>
