<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    export let value: string = '';

    export let id: string = '';
    export let name: string = '';
    export let placeholder: string = '';

    let className: string = '';
    export { className as class };

    let inputElement: HTMLInputElement;

    onMount(async () => {
        if (browser) {
            inputElement.type = 'text';
        }
    });

    function focus(e: Event) {
        const element = e.target as HTMLInputElement;
        element.type = 'date';
    }

    function blur(e: Event) {
        const element = e.target as HTMLInputElement;

        if (element.value.length == 0) {
            element.type = 'text';
        } else {
            const date = new Date(element.value);
            element.type = 'datetime-local';
            value = date.toISOString().slice(0, -8);
        }
    }
</script>

<input
    bind:this={inputElement}
    bind:value
    {id}
    {name}
    {placeholder}
    class={className}
    type="datetime-local"
    on:focus={focus}
    on:blur={blur}
/>
