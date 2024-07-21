<script>
    import {onDestroy, onMount} from 'svelte'
    import {imgCanvas} from "../../routes/store/PertStore.js";
    import {Button, Toggle} from "flowbite-svelte";

    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;

    let width = innerWidth;
    let height = innerHeight
    let color = '#000'
    let background = '#fef'
    let eraserSize = 30;

    let canvas
    let context
    let isDrawing
    let start
    let eraserMode = false

    let t, l

    onMount(() => {
        context = canvas.getContext('2d')
        context.lineWidth = 3
        if ($imgCanvas !== undefined) {
            let image = new Image();
            image.src = $imgCanvas;
            image.onload = function () {
                context.drawImage(image, 0, 0)
            }
        }

        handleSize()
    })

    onDestroy(() => {
        $imgCanvas = canvas.toDataURL();
    })

    $: if (context) {
        context.strokeStyle = color
        context.lineWidth = eraserMode ? eraserSize : 3;
    }


    const handleStart = (({offsetX: x, offsetY: y}) => {

        if (eraserMode) {
            context.globalCompositeOperation = 'destination-out'
            context.lineWidth = eraserSize;
        }
        isDrawing = true
        start = {x, y}
    })

    const handleEnd = () => {
        isDrawing = false
        context.globalCompositeOperation = 'source-over'
        context.lineWidth = eraserMode ? eraserSize : 3; // Reset line width
    }

    const handleMove = (({offsetX: x1, offsetY: y1}) => {
        if (!isDrawing) return

        const {x, y} = start
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x1, y1)
        context.closePath()
        context.stroke()

        start = {x: x1, y: y1}
    })

    const handleSize = () => {
        const {top, left} = canvas.getBoundingClientRect()
        t = top
        l = left
    }

    const toggleEraserMode = () => {
        eraserMode = !eraserMode
        context.strokeStyle = color
        context.lineWidth = eraserMode ? eraserSize : 3;
    }

    function changeColor(color1) {
        color = color1
    }

    function deleteAll() {
        context.clearRect(0, 0, width, height); // Clear the entire canvas
        context.lineWidth = 3; // Reset line width
        handleSize()
    }
</script>

<svelte:window on:resize={handleSize}
               bind:innerWidth
               bind:innerHeight/>

<canvas
        {width}
        {height}

        bind:this={canvas}
        on:mousedown={handleStart}
        on:touchstart={e => {
					const { clientX, clientY } = e.touches[0]
					handleStart({
						offsetX: clientX - l,
						offsetY: clientY - t
					})
				}}
        on:mouseup={handleEnd}
        on:touchend={handleEnd}
        on:mouseleave={handleEnd}
        on:mousemove={handleMove}
        on:touchmove={e => {
					const { clientX, clientY } = e.touches[0]
					handleMove({
						offsetX: clientX - l,
						offsetY: clientY - t
					})
				}}></canvas>


<Button pill={true} class="bg-red-600 !p-2 absolute bottom-0 left-0 ml-5 mb-1.5 pr-4 w-7 h-7"
        on:click={() => changeColor('#d90f0f')}></Button>
<Button pill={true} class="bg-gray-950 !p-2 absolute bottom-0 left-10 ml-5 mb-1.5 pr-4 w-7 h-7"
        on:click={() => changeColor('#000')}></Button>
<Button pill={true} class="bg-green-700 !p-2 absolute bottom-0 left-20 ml-5 mb-1.5 pr-4 w-7 h-7"
        on:click={() => changeColor('#046c4e')}></Button>

<Toggle checked={eraserMode} class="!p-2 absolute bottom-0 left-20 ml-12 mb-1.5"
        on:click={toggleEraserMode}>Erase
</Toggle>
<Button class="!p-2 absolute bottom-0 left-60 ml-5 mb-1.5 pr-4" on:click={deleteAll}>Delete all</Button>