<script>
    import {informationAboutPath, activityInTable} from "../../../routes/store/CpmStore.js";
    import {Button, Listgroup, Label, Select} from "flowbite-svelte";
    import {modal} from "../../../routes/store/ModalStore.js";

    let selected;
    let activityForChoose = $activityInTable.map(obj => ({
        name: obj.nameOfActivity, value: obj.index
    }));
    let selectedActivities = [];

    function addActivityToTable() {
        let previousActivities = selectedActivities.map(obj => obj.index);

        let newActivity = {
            nameOfActivity: $informationAboutPath.nameOfActivity,
            durations: $informationAboutPath.durations,
            previousActivities: previousActivities,
            index: $activityInTable.length === 0 ? 0 : $activityInTable.reduce((max, current) => (current.index > max.index) ? current : max).index + 1
        };

        $activityInTable = $activityInTable.concat(newActivity);

        //Set default value
        $informationAboutPath.nameOfActivity = "";
        $informationAboutPath.durations = null;

        modal.set({show: false, type: ""});
    }

    function addActivityToList() {
        selectedActivities = selectedActivities.concat($activityInTable.find(x => x.index === selected));
        activityForChoose.splice(activityForChoose.findIndex(x => x.value === selected), 1);
        selected = "";
    }

    function deleteActivityFromList(item) {
        let reAddActivityToChoose = {
            name: $activityInTable.find(x => x.index === item.index).nameOfActivity,
            value: $activityInTable.find(x => x.index === item.index).index
        };
        activityForChoose = activityForChoose.concat(reAddActivityToChoose);
        selectedActivities.splice(selectedActivities.findIndex(x => x.index === item.index), 1);
        selectedActivities = selectedActivities;
        activityInTable.subscribe(value => {
        })
    }

</script>

<div class="adjuster">
    <h2>Set information's of a path1</h2>
    <form>
        <label for="activityName">Name of activity:</label>
        <input bind:value={$informationAboutPath.nameOfActivity} type="text" id="activityName" name="activityName"
               required><br>

        <label for="duration">Duration:</label>
        <input bind:value={$informationAboutPath.durations} type="number" id="duration" name="duration" min="0"
               required><br>

        <input on:click={addActivityToTable} type="submit" value="Vytvořit aktivitu">

        <Label>
            Select an option
            <Select on:change={addActivityToList} class="mt-2" items={activityForChoose} bind:value={selected}/>
        </Label>

        {#if selectedActivities.length !== 0}
            <Listgroup items={selectedActivities} let:item class="w-70">
                {item.nameOfActivity}
                <Button on:click={() => deleteActivityFromList(item)}>
                    delete
                </Button>
            </Listgroup>
        {/if}
    </form>
</div>

<style>
    /* Styl pro labely (popisky) vstupních polí */
    label {
        display: block;
        margin-bottom: 5px;
    }

    /* Styl pro vstupní pole */
    input[type="text"],
    input[type="number"] {
        width: 80%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    /* Styl pro tlačítko */
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

    /* Volitelně můžete přidat rámec kolem formuláře pro vzhled */
    form {
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
    }


    .adjuster {
        position: absolute;
        width: 20%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 1em;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 4px;
    }
</style>