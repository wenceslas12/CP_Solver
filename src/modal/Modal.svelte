<script>
  import {clickOutside} from "../js/clickOutside.js";

  export let open = false

    function handleClickOutside() {
        open = false
    }
</script>


{#if open}
    <div class="wrap">
<!--        <div class="slot" use:clickOutside on:click_outside={handleClickOutside}>-->
            <div class="slot">
            <slot></slot>
        </div>
    </div>
{/if}


<style>
    .wrap {
        background: #00000099;
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .slot {
        width: fit-content;
        height: fit-content;
        margin: auto;
    }
</style>

