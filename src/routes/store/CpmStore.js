import {writable} from 'svelte/store';
export const pathsCPM = writable([]);

export const nodeCPM = writable([]);

export const changeCpmMode = writable("ChartCPM");

export const selectedNode = writable(null);

export const selectedPath = writable(null);

export const informationAboutPath = writable({durations: null, nameOfActivity: ""});

export const activityInTable = writable([]);

export const isCPM = writable(true);

export const indexNodeFromMatrix = writable({nodeFrom: null, nodeTo: null});

export const file = writable(null);

export const isCanvas = writable(false);

export const imgCanvas = writable();

export const style = writable({
    sizeCircle: 50,
    strokeWidth: 2,
    gridWidth: 1,
    fontSize: 18,
    onIndexNode: true,
    onValueInNode: true,
    onNameActivity: true,
    onEdgeValuesOnTheLine: true,
    onActivityDurations: true
});