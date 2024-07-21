<script>
    import {DropdownItem} from "flowbite-svelte";
    import Ajv from "ajv";
    import schemaPERT from "../../../routes/schemaPERT.json";
    import {nodePert, pathsPERT, file} from "../../../routes/store/PertStore.js";
    import {modal} from "../../../routes/store/ModalStore.js";

    function testJson(data) {
        const ajv = new Ajv();
        const isValid = ajv.validate(schemaPERT, JSON.parse(data));

        if (isValid) {
            let parseData = JSON.parse(data);
            for (let path of parseData.paths){
                if (path.circleFrom > path.circleTo){
                    return false;
                }
            }
            return true;
        } else {
            console.log(ajv.errors);
            return false;
        }
    }

    function addDataFromJsonToStore(content) {
        //Replace original data from store
        $nodePert = [];
        $pathsPERT = [];
        let dataFromJson = JSON.parse(content);
        $nodePert = $nodePert.concat(dataFromJson.nodes);
        $pathsPERT = $pathsPERT.concat(dataFromJson.paths);

        //Set circles on the object
        for (let path of $pathsPERT) {
            $pathsPERT.find(y => y.index === path.index).circleFrom = $nodePert.find(x => x.index === path.circleFrom);
            $pathsPERT.find(x => x.index === path.index).circleTo = $nodePert.find(x => x.index === path.circleTo);
        }

        //Set paths on the object
        for (let node of $nodePert) {
            let pathsFrom = [];
            for (let path of node.pathsFrom) {
                pathsFrom = pathsFrom.concat($pathsPERT.find(x => x.index === path));
            }
            $nodePert.find(x => x.index === node.index).pathsFrom = pathsFrom;

            let pathsTo = [];
            for (let path of node.pathsTo) {
                pathsTo = pathsTo.concat($pathsPERT.find(x => x.index === path));
            }
            $nodePert.find(x => x.index === node.index).pathsTo = pathsTo;
        }
    }

    function processingJSONFIle (){

        if ($nodePert.length === 0 && $pathsPERT.length === 0) {
            // Handle the uploaded JSON file here
            const reader = new FileReader();
            reader.onload = function (event) {
                const content = event.target.result;
                // Process the JSON content as needed
                if (testJson(content)) {
                    addDataFromJsonToStore(content);
                } else {
                    modal.set({show: true, type: "invalid_json_file_cpm"});
                }
            };
            reader.readAsText($file);
        }else {
            modal.set({show: true, type: "confirm_import_json_pert"});
        }
    }

    const handleFileChange = event => {
        $file = event.target.files[0];
        if ($file && $file.type === "application/json") {
            processingJSONFIle()
        } else {
            alert("Please select a valid JSON file.");
        }
    };

</script>

<DropdownItem>
    <label>
        Import
        <input accept=".json" type="file" style="display:none;" on:change={handleFileChange}/>
    </label>
</DropdownItem>
