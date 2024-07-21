<script>
    import {DropdownItem} from 'flowbite-svelte';
    import domtoimage from 'dom-to-image';

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
                URL.revokeObjectURL(a.href);
            })
            .catch(function (error) {
                console.error('Chyba při konverzi SVG na PNG:', error);
            });
    }
</script>

<DropdownItem on:click={downloadPNG}>
    Download png
</DropdownItem>