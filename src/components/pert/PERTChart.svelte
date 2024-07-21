<script>
    import {Button, ButtonGroup} from 'flowbite-svelte';
    import IoIosArrowRoundForward from 'svelte-icons/io/IoIosArrowRoundForward.svelte'
    import IoIosCloseCircleOutline from 'svelte-icons/io/IoIosCloseCircleOutline.svelte'
    import TiEdit from 'svelte-icons/ti/TiEdit.svelte'
    import FaPlusCircle from 'svelte-icons/fa/FaPlusCircle.svelte'
    import IoMdSkipForward from 'svelte-icons/io/IoMdSkipForward.svelte'
    import IoMdPlay from 'svelte-icons/io/IoMdPlay.svelte'
    import IoMdSkipBackward from 'svelte-icons/io/IoMdSkipBackward.svelte'

    import PERTChartRollup from "./PERTChartRollup.svelte";


    import {
        pathsPERT,
        nodePert,
        selectedNode,
        selectedPath,
        changePertMode,
        isPert,
        style, isCanvas
    } from "../../routes/store/PertStore.js";
    import {modal} from "../../routes/store/ModalStore.js";
    import Canvas from "./Canvas.svelte";

    let selectNode;
    let selectPath;
    let adjusting = false;
    let isDragging = false;
    let isOnPERT = false;

    function addNode() {
        //Disable GantChart
        isPert.set(true);

        const node = {
            cx: 100,
            cy: 200,
            r: $style.sizeCircle,
            index: $nodePert.length === 0 ? 0 : $nodePert[$nodePert.length - 1].index + 1,
            actualLeftValue: 0,
            actualRightValue: null,
            actualDispersion: null,
            pathsTo: [],
            pathsFrom: []
        };


        $nodePert = $nodePert.concat(node);

        resetPath();
        resetNode();

        $nodePert = $nodePert;
        $pathsPERT = $pathsPERT;

        $selectedNode = null;
        selectNode = false;

        isPert.set(true)
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
        $nodePert.forEach(function (node) {
            node.actualLeftValue = 0;
            node.actualRightValue = null;
            node.actualDispersion = null;
        });
    }

    function resetPath() {
        $pathsPERT.forEach(function (path) {
            path.leftValue = null;
            path.rightValue = null;
            path.timeReserve = null;
        })
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

    function testExistOneFirstNodeAndOneLastNode() {
        return ($nodePert.filter(x => x.pathsFrom.length === 0).length === 1 && $nodePert.filter(x => x.pathsTo.length === 0).length === 1 && $pathsPERT.length > 0 && $nodePert.length > 1);
    }

    function calculateMeanValue() {
        $pathsPERT.forEach(function (path) {
            path.meanValue = (path.optimisticEstimate + 4 * path.mostLikelyEstimate + path.pessimisticEstimate) / 6;
            path.meanValue = Math.round(path.meanValue * 100) / 100
            // path.meanValue = Number(path.meanValue.toFixed(2))
            path.dispersion = Math.pow((path.pessimisticEstimate - path.optimisticEstimate) / 6, 2);
            path.dispersion = Math.round(path.dispersion * 100) / 100
            // path.dispersion = Number(path.dispersion.toFixed(2))
        });
        $pathsPERT = $pathsPERT
        $nodePert = $nodePert
    }

    let firstPass = [];
    let secondPass = [];

    let actualNode = -1;
    let actualPath = -1;
    let actualStep = 0;

    function onPERT() {
        calculateMeanValue();
        firstPass = cloneWithoutCircularReferences($nodePert);
        secondPass = cloneWithoutCircularReferences($nodePert).reverse();

        isOnPERT = true;
    }

    function backStep() {
        resetPath();
        resetNode();

        onPERT();

        let stepForFor = actualStep;
        actualStep = 0;

        for (let i = 0; i < stepForFor - 1; i++) {
            stepByStep();
        }

    }

    function stepByStep() {
        if (actualStep === 0) {
            resetPath();
            resetNode();

            onPERT();
        }
        if (testExistOneFirstNodeAndOneLastNode()) {

            if (firstPass.length > 1) {
                let nodeWhereNotHavePathTo = firstPass.find(x => x.pathsTo.length === 0);
                actualNode = nodeWhereNotHavePathTo.index;
                let path = nodeWhereNotHavePathTo.pathsFrom[0];
                actualPath = path.index;

                if ($nodePert.find(x => x.index === path.circleTo.index).actualLeftValue < path.meanValue + $nodePert.find(x => x.index === path.circleFrom.index).actualLeftValue) {
                    $nodePert.find(x => x.index === path.circleTo.index).actualLeftValue = path.meanValue + $nodePert.find(x => x.index === path.circleFrom.index).actualLeftValue;
                    $nodePert.find(x => x.index === path.circleTo.index).actualDispersion = path.dispersion + $nodePert.find(x => x.index === path.circleFrom.index).actualDispersion;
                    $nodePert.find(x => x.index === path.circleTo.index).actualDispersion = Number($nodePert.find(x => x.index === path.circleTo.index).actualDispersion.toFixed(2))
                }
                $pathsPERT.find(x => x.index === path.index).rightValue = $pathsPERT.find(x => x.index === path.index).circleFrom.actualLeftValue + path.meanValue;
                firstPass.find(x => x.index === path.circleTo.index).pathsTo.splice(firstPass.find(x => x.index === path.circleTo.index).pathsTo.indexOf(path), 1);
                nodeWhereNotHavePathTo.pathsFrom.splice(0, 1);

                if (nodeWhereNotHavePathTo.pathsFrom.length === 0) {
                    firstPass.splice(firstPass.indexOf(nodeWhereNotHavePathTo), 1);
                }
            } else if (secondPass.length > 1) {
                let nodeWhereNotHavePathFrom = secondPass.find(x => x.pathsFrom.length === 0);
                actualNode = nodeWhereNotHavePathFrom.index;

                if ((nodeWhereNotHavePathFrom.index === $nodePert.length - 1) && $nodePert.find(x => x.index === nodeWhereNotHavePathFrom.index).actualRightValue !== $nodePert.find(x => x.index === nodeWhereNotHavePathFrom.index).actualLeftValue) {
                    $nodePert.find(x => x.index === nodeWhereNotHavePathFrom.index).actualRightValue = $nodePert.find(x => x.index === nodeWhereNotHavePathFrom.index).actualLeftValue;
                } else {
                    let path = nodeWhereNotHavePathFrom.pathsTo[0];
                    actualPath = path.index;
                    if ($nodePert.find(x => x.index === path.circleFrom.index).actualRightValue > $nodePert.find(x => x.index === path.circleTo.index).actualRightValue - path.meanValue
                        || $nodePert.find(x => x.index === path.circleFrom.index).actualRightValue === null) {
                        $nodePert.find(x => x.index === path.circleFrom.index).actualRightValue = $nodePert.find(x => x.index === path.circleTo.index).actualRightValue - path.meanValue;
                    }
                    $pathsPERT.find(x => x.index === path.index).leftValue = $pathsPERT.find(x => x.index === path.index).circleTo.actualRightValue - path.meanValue;
                    secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.splice(secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.indexOf(path), 1);
                    nodeWhereNotHavePathFrom.pathsTo.splice(0, 1);
                }
                if (nodeWhereNotHavePathFrom.pathsTo.length === 0) {
                    secondPass.splice(secondPass.indexOf(nodeWhereNotHavePathFrom), 1);
                }
            } else {
                for (let path of $pathsPERT) {
                    path.timeReserve = Math.abs(path.circleTo.actualRightValue - path.circleFrom.actualLeftValue - path.meanValue);
                    if (path.timeReserve === 0) {
                        // if (path.circleFrom.actualRightValue === path.leftValue && path.circleTo.actualLeftValue === path.rightValue) {
                        path.start = path.circleFrom.actualRightValue;
                        path.earliestEnd = path.circleTo.actualRightValue;
                        path.latestEnd = path.circleTo.actualRightValue;
                    } else {
                        path.start = path.circleFrom.actualLeftValue;
                        path.earliestEnd = path.circleFrom.actualLeftValue + path.meanValue;
                        path.latestEnd = path.circleTo.actualRightValue;
                    }
                    // path.timeReserve =Math.abs(path.circleTo.actualRightValue - path.circleFrom.actualLeftValue - path.meanValue);
                    actualNode = -1;
                    actualPath = -1;
                    isPert.set(false);
                }
            }

            $nodePert = $nodePert;
            $pathsPERT = $pathsPERT;

        } else {
            modal.set({show: true, type: "cannot_perform_CPM_method"})
        }

        actualStep++;
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
            $nodePert = $nodePert;
            $pathsPERT = $pathsPERT;
        }
    }

    function changeSVG() {
        changePertMode.set("DrawPath");
    }


    function PERT() {
        if (testExistOneFirstNodeAndOneLastNode()) {
            resetNode();
            onPERT();

            //From first node to last node
            for (let i = 0; i < $nodePert.length; i++) {
                let nodeWhereNotHavePathTo = firstPass.find(x => x.pathsTo.length === 0);

                let path;
                for (path of nodeWhereNotHavePathTo.pathsFrom) {
                    if ($nodePert.find(x => x.index === path.circleTo.index).actualLeftValue < path.meanValue + $nodePert.find(x => x.index === path.circleFrom.index).actualLeftValue) {
                        $nodePert.find(x => x.index === path.circleTo.index).actualLeftValue = path.meanValue + $nodePert.find(x => x.index === path.circleFrom.index).actualLeftValue;
                        $nodePert.find(x => x.index === path.circleTo.index).actualDispersion = path.dispersion + $nodePert.find(x => x.index === path.circleFrom.index).actualDispersion;
                        $nodePert.find(x => x.index === path.circleTo.index).actualDispersion = Number($nodePert.find(x => x.index === path.circleTo.index).actualDispersion.toFixed(2))
                    }
                    $pathsPERT.find(x => x.index === path.index).rightValue = $pathsPERT.find(x => x.index === path.index).circleFrom.actualLeftValue + path.meanValue;
                    firstPass.find(x => x.index === path.circleTo.index).pathsTo.splice(firstPass.find(x => x.index === path.circleTo.index).pathsTo.indexOf(path), 1);

                }
                firstPass.splice(firstPass.indexOf(nodeWhereNotHavePathTo), 1);
            }

            //From last node to fist node
            for (let i = 0; i < $nodePert.length; i++) {
                let nodeWhereNotHavePathFrom = secondPass.find(x => x.pathsFrom.length === 0);
                //Set last node right value to left value
                if (i === 0) {
                    $nodePert.find(x => x.index === nodeWhereNotHavePathFrom.index).actualRightValue = $nodePert.find(x => x.index === nodeWhereNotHavePathFrom.index).actualLeftValue;
                }
                let path;
                for (path of nodeWhereNotHavePathFrom.pathsTo) {
                    if ($nodePert.find(x => x.index === path.circleFrom.index).actualRightValue > $nodePert.find(x => x.index === path.circleTo.index).actualRightValue - path.meanValue
                        || $nodePert.find(x => x.index === path.circleFrom.index).actualRightValue === null) {
                        $nodePert.find(x => x.index === path.circleFrom.index).actualRightValue = $nodePert.find(x => x.index === path.circleTo.index).actualRightValue - path.meanValue;
                    }
                    $pathsPERT.find(x => x.index === path.index).leftValue = $pathsPERT.find(x => x.index === path.index).circleTo.actualRightValue - path.meanValue;
                    secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.splice(secondPass.find(x => x.index === path.circleFrom.index).pathsFrom.indexOf(path), 1);
                }
                secondPass.splice(secondPass.indexOf(nodeWhereNotHavePathFrom), 1);
            }


            // Set start and ends activity
            for (let path of $pathsPERT) {
                path.timeReserve = Math.round(Math.abs(path.circleTo.actualRightValue - path.circleFrom.actualLeftValue - path.meanValue) * 100) / 100;
                if (path.timeReserve === 0) {
                    path.start = path.circleFrom.actualRightValue;
                    path.earliestEnd = path.circleTo.actualRightValue;
                    path.latestEnd = path.circleTo.actualRightValue;
                } else {
                    path.start = path.circleFrom.actualLeftValue;
                    path.earliestEnd = path.circleFrom.actualLeftValue + path.meanValue;
                    path.latestEnd = path.circleTo.actualRightValue;
                }

                actualNode = -1;
                actualPath = -1;
            }

            //Actualization of values
            $nodePert = $nodePert;
            $pathsPERT = $pathsPERT;

            //Enable GanttChart
            isPert.set(false);
        } else {
            modal.set({show: true, type: "cannot_perform_CPM_method"})
        }
    }

    function deleteNode() {
        //remove all paths that are connected with node
        for (let path of $nodePert.find(x => x.index === selectNode.index).pathsFrom) {
            $nodePert.find(x => x.index === path.circleTo.index).pathsTo.splice($nodePert.find(x => x.index === path.circleTo.index).pathsTo.findIndex(x => x.index === path.index), 1);
            $pathsPERT.splice($pathsPERT.findIndex(x => x.index === path.index), 1);
        }
        for (let path of $nodePert.find(x => x.index === selectNode.index).pathsTo) {
            $nodePert.find(x => x.index === path.circleFrom.index).pathsFrom.splice($nodePert.find(x => x.index === path.circleFrom.index).pathsFrom.findIndex(x => x.index === path.index), 1);
            $pathsPERT.splice($pathsPERT.findIndex(x => x.index === path.index), 1);
        }

        //remove node
        $nodePert.splice($nodePert.findIndex(x => x.index === selectNode.index), 1);
        resetPath();
        resetNode();


        //value update
        $nodePert = $nodePert
        $pathsPERT = $pathsPERT

        //set null to select node
        $selectedNode = null;
        selectNode = false;
    }

    function deletePath() {
        //remove path from node
        $nodePert.find(x => x.index === selectPath.circleFrom.index).pathsFrom.splice($nodePert.find(x => x.index === selectPath.circleFrom.index).pathsFrom.findIndex(x => x.index === selectPath.index), 1);
        $nodePert.find(x => x.index === selectPath.circleTo.index).pathsTo.splice($nodePert.find(x => x.index === selectPath.circleTo.index).pathsTo.findIndex(x => x.index === selectPath.index), 1);

        //remove path
        $pathsPERT.splice($pathsPERT.findIndex(x => x.index === selectPath.index), 1);

        resetNode();
        resetPath();

        //value update
        $nodePert = $nodePert;
        $pathsPERT = $pathsPERT;


        //set null to select path
        selectPath = null;
        $selectedPath = null;
    }

    function removeSelect() {
        selectPath = null;

        selectNode = null;
        $selectedNode = null;
    }

</script>

{#if $isCanvas}
    <Canvas/>
{:else}

    <Button pill={true} outline={true} class="!p-2 absolute bottom-0 left-0 ml-2.5 mb-1.5" on:click={addNode}>
        <div class="rollup_button">
            <FaPlusCircle/>
        </div>
    </Button>
    <Button pill={true} outline={true} class="!p-2 absolute bottom-0 left-10 ml-10 mb-1.5 pr-4 w-14 h-14"
            on:click={onPERT}>
        PERT
    </Button>
    {#if isOnPERT}
        <ButtonGroup
                class="flex items-center justify-center fixed bottom-0 left-1/2 transform -translate-x-1/2 ml-10 mb-1.5 pr-4 w-14 h-14">
            <Button on:click={backStep} disabled={!$isPert}>
                <div class="pert_control">
                    <IoMdSkipBackward/>
                </div>
            </Button>
            <Button on:click={PERT} disabled={!$isPert}>
                <div class="pert_control">
                    <IoMdPlay/>
                </div>
            </Button>
            <Button on:click={stepByStep} disabled={!$isPert}>
                <div class="pert_control">
                    <IoMdSkipForward/>
                </div>
            </Button>
        </ButtonGroup>
    {/if}
{/if}

<PERTChartRollup/>

<svg on:mousedown={startDrag} on:mouseup={stopDrag} on:mousemove={move} on:click={removeSelect} id="iamsvg">

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

    {#each $pathsPERT as path}
        <!-- Dotted line when durations is 0 -->
        {#if path.optimisticEstimate === 0}
            {#if path.circleFrom.actualRightValue === path.circleFrom.actualLeftValue && path.circleTo.actualRightValue === path.circleTo.actualLeftValue}
                <line x1={path.circleFrom.cx}
                      y1={path.circleFrom.cy}
                      x2={path.circleTo.cx}
                      y2={path.circleTo.cy}
                      stroke="red"
                      stroke-width={$style.strokeWidth}
                      marker-end="url(#arrowRed)"
                      stroke-dasharray="5,5"
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
                />
            {/if}
        {:else }
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
			}}
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
                      role="button"
                />
            {/if}
        {/if}
        {#if $style.onMeanValueActivity}
            <text
                    x={(parseFloat(path.circleFrom.cx) + parseFloat(path.circleTo.cx)) / 2}
                    y={((parseFloat(path.circleFrom.cy) + parseFloat(path.circleTo.cy)) / 2) - 15}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {Number(((path.optimisticEstimate + 4 * path.mostLikelyEstimate + path.pessimisticEstimate) / 6).toFixed(2))} {path.timeReserve === null ? "" : ("(" + path.timeReserve + ")")}
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
                    <button on:click={() => modal.set({show: true, type: "edit_path_pert"})}>
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
    {#each $nodePert as circle, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <circle id={circle.index}
                cx={circle.cx }
                cy={circle.cy}
                r={circle.r}
                on:click={(event) => selectingNode(circle, event)}
                on:contextmenu|stopPropagation|preventDefault={() => {
				adjusting = !adjusting;
			}
			}
                fill={circle === selectNode ? '#ccc' : 'white'}
                stroke={circle.index === actualNode ? 'blue' : 'black'}
                stroke-width={$style.gridWidth}
                role="button"
                tabindex="0"
        />

        {#if $style.onIndexNode}
            <!-- Index circle -->
            <text
                    x={circle.cx - $style.sizeCircle/2}
                    y={circle.cy - $style.sizeCircle/3}
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {circle.index}
            </text>
        {/if}
        {#if $style.onValueInNode}
            <text
                    x={circle.cx + $style.sizeCircle/2}
                    y={circle.cy - $style.sizeCircle/3 }
                    font-size={$style.fontSize}
                    fill="black"
                    text-anchor="middle"
                    alignment-baseline="middle"
            >
                {circle.actualDispersion === null ? "0" : circle.actualDispersion }

            </text>
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
                y1={circle.cy - $style.sizeCircle}
                x2={circle.cx}
                y2={circle.cy + $style.sizeCircle}
                stroke="black"
                stroke-width={$style.gridWidth}
        />

        {#if selectNode}
            <!-- Button for adjusting the selected circle -->
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
        margin-right: 5px; /* Optional: Add some spacing between icon and text */
    }
</style>