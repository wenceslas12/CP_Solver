<script>
    import {DropdownItem} from "flowbite-svelte";
    import {nodeCPM, pathsCPM} from "../../../routes/store/CpmStore.js";

    let nodesAndPathsToDownload = {
        nodes: [],
        paths: []
    };

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

    function modifyStoreArray() {
        //Clone from store
        let modifyNode =  cloneWithoutCircularReferences($nodeCPM);
        let modifyPath =  cloneWithoutCircularReferences($pathsCPM);
        //Change from array to index for paths on node
        for (let node of modifyNode) {
            let arrayWithIndexPathsFrom = []
            for (let pathFrom of node.pathsFrom) {
                arrayWithIndexPathsFrom = arrayWithIndexPathsFrom.concat(modifyNode.find(x => x.index === node.index).pathsFrom.find(x => x.index === pathFrom.index).index);
            }
            modifyNode.find(x => x.index === node.index).pathsFrom = arrayWithIndexPathsFrom;
            let arrayWithIndexPathsTo = []
            for (let pathTo of node.pathsTo) {
                arrayWithIndexPathsTo = arrayWithIndexPathsTo.concat(modifyNode.find(x => x.index === node.index).pathsTo.find(x => x.index === pathTo.index).index);
            }
            modifyNode.find(x => x.index === node.index).pathsTo = arrayWithIndexPathsTo;
        }

        //Change from object to index for node on paths
        for (let path of modifyPath) {
            modifyPath.find(x => x.index === path.index).circleFrom = modifyNode.find(x => x.index === path.circleFrom.index).index;
            modifyPath.find(x => x.index === path.index).circleTo = modifyNode.find(x => x.index === path.circleTo.index).index;
        }

        //Add arrays to final array
        nodesAndPathsToDownload.nodes = nodesAndPathsToDownload.nodes.concat(modifyNode);
        nodesAndPathsToDownload.paths = nodesAndPathsToDownload.paths.concat(modifyPath);
    }

    const downloadFile = () => {
        modifyStoreArray();
        const json = JSON.stringify(nodesAndPathsToDownload);
        const file = new Blob([json], {type: 'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'sample.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };

</script>

<DropdownItem on:click={downloadFile}>
    Export data
</DropdownItem>

