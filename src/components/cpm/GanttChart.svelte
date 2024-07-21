<script>
    import {pathsCPM, nodeCPM} from "../../routes/store/CpmStore.js";
    import {onMount} from "svelte";
    import {Button} from "flowbite-svelte";
    import domtoimage from 'dom-to-image';
    import IoMdDownload from 'svelte-icons/io/IoMdDownload.svelte'


    let numOfTicks = $nodeCPM.find(x => x.pathsFrom.length === 0).actualRightValue + 1;
    let axisStart;
    let rectElements = [];

    //Find the longest name of activity and set axisStart
    const longestPathElement = $pathsCPM.reduce((prev, current) => {
        return (prev.nameOfActivity.length > current.nameOfActivity.length) ? prev : current;
    }, $pathsCPM[0]);
    axisStart = longestPathElement.nameOfActivity.length * 11.9;
    let svgWidth = 1900 - axisStart;

    const sortedPaths = $pathsCPM.sort((a, b) => {
        if (a.earliestEnd === a.latestEnd && b.earliestEnd !== b.latestEnd) {
            return -1;
        } else if (a.earliestEnd !== a.latestEnd && b.earliestEnd === b.latestEnd) {
            return 1;
        } else if (a.earliestEnd === a.latestEnd && b.earliestEnd === b.latestEnd) {
            return a.start - b.start;
        } else {
            return a.start - b.start;
        }
    });

    const sortedPathsWithout0DurationsPath = sortedPaths.filter(x => x.durations !==0);

    function downloadPNG() {
        const svg = document.getElementById("iamsvg");

        domtoimage.toPng(svg)
            .then(function (dataUrl) {
                const img = new Image();
                img.src = dataUrl;

                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'my_image.png';
                a.click()

            })
            .catch(function (error) {
                console.error('Chyba při konverzi SVG na PNG:', error);
            });
    }


    let dialog; // Reference to the dialog tag
    onMount(() => {
        dialog = document.getElementById('confirmation-dialog');
    })

    let dialogNameOfActivity = null;
    let dialogDurationOfActivity = null;
    let dialogTotalTimeReserve = null;
    let dialogFreeTimeReserve = null;
    let dialogIndependentTimeReserve = null;

    function showDialogMouseOver(i, path) {
        try {
            dialogNameOfActivity = path.nameOfActivity;
            dialogDurationOfActivity = path.durations;
            dialogTotalTimeReserve = path.timeReserve;
            dialogFreeTimeReserve = path.circleTo.actualLeftValue - path.circleFrom.actualLeftValue - path.durations;
            dialogIndependentTimeReserve = Math.max(0,path.circleTo.actualLeftValue - path.circleFrom.actualRightValue-path.durations);

            const top = (32 + i * 30) + 80;

            dialog.style.position = 'fixed';
            dialog.style.left = `0px`;
            dialog.style.top = `${top}px`;

            dialog.show()
            //dialog['show']();
        } catch (e) {
            console.error(e);
        }
    }



</script>


<Button  pill={true} outline={true} class="!p-2 absolute top-30 right-10  ml-10 mb-1.5 pr-10 w-18 h-12" on:click={() => downloadPNG()} >

<div class="pert_control">
    <IoMdDownload/>
</div>
</Button>

<svg width="100%" height="100%" viewBox="0 0 1928 {(sortedPathsWithout0DurationsPath.length + 1) * 30 + 80}" id="iamsvg">
    <!-- Osa s vyznačenými body a čísly -->
    <line x1={axisStart} y1="30" x2={axisStart + svgWidth} y2="30" stroke="black"/>
    <line x1="0" y1="30" x2="0" y2={(sortedPathsWithout0DurationsPath.length + 1) * 30} stroke="black" stroke-width="3"/>
    {#each Array.from({length: numOfTicks}, (_, i) => i) as tick}
        <line x1={axisStart + tick * (svgWidth / (numOfTicks - 1))} y1="30"
              x2={axisStart + tick * (svgWidth / (numOfTicks - 1))} y2={(sortedPathsWithout0DurationsPath.length + 1) * 30} stroke="black"/>
        <text
                x={axisStart + tick * (svgWidth / (numOfTicks - 1))}
                y="20"
                font-size="14"
                fill="black"
                text-anchor="middle"
                alignment-baseline="middle"
        >
            {tick}
        </text>
    {/each}

    {#each sortedPathsWithout0DurationsPath as path, i }
        {#if path.durations !== 0}
            <text
                    x="2"
                    y={55  + i * 30}
                    font-size="20"
                    fill="black"
                    text-anchor="start"
                    alignment-baseline="middle"
            >
                {path.nameOfActivity}
            </text>
            {#if path.timeReserve === 0}

                <rect bind:this={rectElements}
                      x="{axisStart + path.circleFrom.actualRightValue * (svgWidth / (numOfTicks - 1))}"
                      y="{32 + i * 30}"
                      width={(svgWidth/(numOfTicks-1)) * (path.circleTo.actualRightValue - path.circleFrom.actualRightValue)}
                      height="25"
                      style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.9;stroke-opacity:0.9"
                      id="rectangle"
                      on:mouseover={() => showDialogMouseOver(i, path)}
                      on:mouseleave={() => dialog.close()}
                />

            {:else }
                <rect bind:this={rectElements}
                      x="{axisStart + path.start * (svgWidth / (numOfTicks - 1))}"
                      y="{32 + i * 30}"
                      width={(svgWidth/(numOfTicks-1)) * (path.latestEnd - path.start)}
                      height="25"
                      style="fill:red;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"
                      id="rectangle"
                      on:mouseover={() => showDialogMouseOver(i, path)}
                      on:mouseleave={() => dialog.close()}
                />

                <rect bind:this={rectElements}
                      x="{axisStart + path.start * (svgWidth / (numOfTicks - 1))}"
                      y="{32 + i * 30}"
                      width={(svgWidth/(numOfTicks-1)) * (path.earliestEnd - path.start)}
                      height="25"
                      style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9"
                      id="rectangle"
                      on:mouseover={() => showDialogMouseOver(i, path)}
                      on:mouseleave={() => dialog.close()}
                />

            {/if}
            <!--                vodorovne line-->
            <line x1="0" y1={30 + i * 30} x2={(axisStart) + svgWidth} y2={30 + i * 30}
                  stroke="black"/>
        {/if}
    {/each}

    <!--        Last line -->
    <line x1="0" y1={(sortedPathsWithout0DurationsPath.length + 1) * 30} x2={(axisStart) + svgWidth} y2={(sortedPathsWithout0DurationsPath.length + 1) * 30}
          stroke="black"/>

</svg>
<dialog id="confirmation-dialog">
    <h1><b>{dialogNameOfActivity}</b></h1>
    <p>Durations: <b>{dialogDurationOfActivity}</b></p>
    <p>Total time reserve: <b>{dialogTotalTimeReserve}</b></p>
    <p>Free time reserve: <b>{dialogFreeTimeReserve}</b></p>
    <p>Independent time reserve: <b>{dialogIndependentTimeReserve}</b></p>
</dialog>
<style>

    .pert_control {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
    }

    h1 {
        text-align: center;
        color: rgb(55 70 91);
        font-size: 20px;
        text-decoration-line: underline;
        text-decoration-color: rgb(63, 131, 248);
        text-decoration-thickness: 3px;
        text-underline-offset: 4px;
    }

    dialog {
        background: rgb(225 239 254);
        padding: 5px;
        border: 2px solid rgb(63 131 248);
        border-radius: 5px;
    }

    p {
        color: rgb(55 70 91);
    }

    svg {
        margin-top: 60px;
        margin-left: 5px;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: visible;
        background: white;
    }
</style>