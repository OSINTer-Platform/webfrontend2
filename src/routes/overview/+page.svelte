<script lang="ts">
    import { config } from '$shared/config';
    import type { MLArticle } from '$shared/types/api';

    let data: Promise<Array<MLArticle>> = fetch(
        `${config.apiRoot}/ml/articles/map`
    ).then((r) => {
        return r.json();
    });
</script>
