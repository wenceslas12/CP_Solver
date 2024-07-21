<script>
    import {DropdownItem} from "flowbite-svelte";
    import Ajv from "ajv";
    import schemaCPM from "../../../routes/schemaCPM.json";
    import {nodeCPM, pathsCPM, file} from "../../../routes/store/CpmStore.js";
    import {modal} from "../../../routes/store/ModalStore.js";

    function testJson(data) {
        const ajv = new Ajv();
        const isValid = ajv.validate(schemaCPM, JSON.parse(data));

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
        $nodeCPM = [];
        $pathsCPM = [];
        let dataFromJson = JSON.parse(content);
        $nodeCPM = $nodeCPM.concat(dataFromJson.nodes);
        $pathsCPM = $pathsCPM.concat(dataFromJson.paths);

        //Set circles on the object
        for (let path of $pathsCPM) {
            $pathsCPM.find(y => y.index === path.index).circleFrom = $nodeCPM.find(x => x.index === path.circleFrom);
            $pathsCPM.find(x => x.index === path.index).circleTo = $nodeCPM.find(x => x.index === path.circleTo);
        }

        //Set paths on the object
        for (let node of $nodeCPM) {
            let pathsFrom = [];
            for (let path of node.pathsFrom) {
                pathsFrom = pathsFrom.concat($pathsCPM.find(x => x.index === path));
            }
            $nodeCPM.find(x => x.index === node.index).pathsFrom = pathsFrom;

            let pathsTo = [];
            for (let path of node.pathsTo) {
                pathsTo = pathsTo.concat($pathsCPM.find(x => x.index === path));
            }
            $nodeCPM.find(x => x.index === node.index).pathsTo = pathsTo;
        }
    }

    function processingJSONFIle (){

        if ($nodeCPM.length === 0 && $pathsCPM.length === 0) {
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
            modal.set({show: true, type: "confirm_import_json_cpm"});
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
