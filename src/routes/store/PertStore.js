import {writable} from "svelte/store";

export const pathsPERT = writable([]);

export const nodePert = writable([]);

export const selectedNode = writable(null);

export const selectedPath = writable(null);

export const changePertMode = writable("ChartPERT");

export const informationAboutPath = writable({ optimisticEstimate: null, mostLikelyEstimate: null, pessimisticEstimate: null, nameOfActivity: ""});

export const isPert = writable(true);

export const file = writable(null);

export const activityInTable = writable([]);

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
    onMeanValueActivity: true
});