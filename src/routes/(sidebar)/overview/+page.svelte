<script lang="ts">
    import { PUBLIC_API_BASE } from '$env/static/public';
    import type { Article } from '$shared/types/api';

    let data: Promise<Array<Article>> = fetch(
        `${PUBLIC_API_BASE}/ml/articles/map`
    ).then((r) => {
        return r.json();
    });
</script>
