<script lang="ts">
    import Switch from '$utils/switch.svelte';
    import OptionSection from './optionSection.svelte';

    import type { SearchQuery, SortBy, SortOrder } from '$shared/types/api';

    const sortBy: Array<{ value: SortBy; name: string }> = [
        { value: '', name: 'Best Match' },
        { value: 'publish_date', name: 'Publish Date' },
        { value: 'read_times', name: 'Read Times' },
        { value: 'source', name: 'Source' },
        { value: 'author', name: 'Author' },
        { value: 'inserted_at', name: 'Time of scraping' },
    ];

    const sortOrder: Array<{ value: SortOrder; name: string }> = [
        { value: 'desc', name: 'Descending' },
        { value: 'asc', name: 'Ascending' },
    ];

    let limitEnabled = true;

    export let searchQuery: SearchQuery;
</script>

<div class="p-4">
    <OptionSection
        title="Timespan"
        desc="Enter wanted date interval. Only articles published within this interval will be shown."
    >
        <div class="input">
            <input
                id="first_date"
                name="first_date"
                placeholder=" "
                class="wide"
            />
            <label for="first_date" class="wide">First Date</label>
        </div>

        <div class="input">
            <input
                id="last_date"
                name="last_date"
                placeholder=" "
                class="wide"
            />
            <label for="last_date" class="wide">Last Date</label>
        </div>
    </OptionSection>

    <OptionSection
        title="Sorting"
        desc="Choose how to sort articles and whether they should be sorted ascending or descending."
    >
        <div class="input">
            <select
                bind:value={searchQuery.sort_by}
                id="sort_by"
                name="sort_by"
                placeholder=" "
                class="wide"
            >
                <option selected disabled>Sort By</option>
                {#each sortBy as { value, name }}
                    <option {value}>{name}</option>
                {/each}
            </select>
            <label for="sort_by" class="wide">Sort By</label>
        </div>

        <div class="input">
            <select
                bind:value={searchQuery.sort_order}
                id="sort_order"
                name="sort_order"
                placeholder=" "
                class="wide"
            >
                <option selected disabled>Sort Order</option>
                {#each sortOrder as { value, name }}
                    <option {value}>{name}</option>
                {/each}
            </select>
            <label for="sort_order" class="wide">Sort Order</label>
        </div>
    </OptionSection>

    <OptionSection
        title="Limit"
        desc="Limit number of articles queried from server. Higher number will lead to longer load times."
    >
        <div class="input">
            <input
                id="limit"
                name="limit"
                placeholder=" "
                class="wide"
                type="number"
                inputmode="numeric"
                min="0"
                disabled={!limitEnabled}
                bind:value={searchQuery.limit}
                title={limitEnabled ? '' : 'Flip switch to enable limit'}
            />
            <label for="limit" class="wide">Limit</label>

            <div
                class="absolute top-5 right-3"
                title={limitEnabled
                    ? 'Disable limit. WARNING: Will load LARGE amounts of data.'
                    : 'Enable limit. Strongly recommended'}
            >
                <Switch
                    bind:checked={limitEnabled}
                    on:change={(e) =>
                        (searchQuery.limit = e?.target?.checked ? 100 : 0)}
                />
            </div>
        </div>
    </OptionSection>

    <OptionSection
        title="Search Term"
        desc="Uses nearly same syntax as Google Dorks. Flip switch to enable highlighting search matches."
    >
        <div class="input">
            <input
                id="search_term"
                name="search_term"
                placeholder=" "
                class="wide"
                type="text"
                bind:value={searchQuery.search_term}
                on:focus={() => (searchQuery.sort_by = '')}
                on:blur={() =>
                    (searchQuery.sort_by = searchQuery.search_term
                        ? ''
                        : 'publish_date')}
            />
            <label for="search_term" class="wide">Search Term</label>

            <div
                class="absolute top-5 right-3"
                title="{searchQuery.highlight
                    ? 'Disable'
                    : 'Enable'} highlighting of search matches"
            >
                <Switch bind:checked={searchQuery.highlight} name="highlight" />
            </div>
        </div>
    </OptionSection>
</div>

<style lang="scss">
    div.input {
        @apply relative h-16 flex justify-center;
    }

    select.wide,
    input.wide {
        @apply w-full h-4/5 m-auto pl-4

	appearance-none rounded-lg
	border border-tertiary-700
	outline outline-2 outline-surface-100
	bg-surface-50

	text-sm

	disabled:cursor-not-allowed disabled:text-tertiary-600

	transition-all duration-300;

        &:hover:not([disabled]),
        &:focus:not([disabled]) {
            @apply border-white outline-primary-500/75;
        }

        &:hover:not([disabled]) ~ label,
        &:focus:not([disabled]) ~ label {
            @apply text-primary-500;
        }

        &:focus ~ label,
        &:not(:placeholder-shown) ~ label {
            @apply bg-surface-100;
            transform: translateY(-1.7rem) scale(0.85);
        }

        &[type='number'] {
            -moz-appearance: textfield;
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            display: none;
            -webkit-appearance: none;
            margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
        }
    }

    label.wide {
        @apply capitalize font-light text-sm
	pointer-events-none
	absolute left-4 top-6
	transition-colors transition-transform;

        transform-origin: 0 50%;
    }
</style>
