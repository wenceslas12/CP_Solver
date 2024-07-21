<script>
    import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
    $: activeUrl = $page.url.pathname;
</script>

<Navbar let:hidden let:toggle class="!bg-blue-100  pt-0 pb-0 border-2 border-b-blue-500 mb-1.5">
    <NavBrand href="/" class="">
        <img src="src/lib/images/logo_CPSolver.png" class=" mr-2 h-20 sm:h-15 " alt="CP Solver Logo" />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">CP Solver</span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {activeUrl} {hidden} >
        <NavLi href="/" class={activeUrl === "/"?"text-2xl text-white":"text-2xl"}>Info</NavLi>
        <NavLi href="/cpm" class={activeUrl === "/cpm"?"text-2xl text-white":"text-2xl"}>CPM</NavLi>
        <NavLi href="/pert" class={activeUrl === "/pert"?"text-2xl text-white":"text-2xl"}>PERT</NavLi>
    </NavUl>
</Navbar>

<style>
</style>