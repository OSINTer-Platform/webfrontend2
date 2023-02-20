import { config } from '$shared/config';

type Resp = { content: any; ok: boolean; status: number };

export async function queryProtected(
    queryURL: string,
    method = 'GET',
    body: {} | null = null
): Promise<Resp> {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    const request = new Request(`${config.apiRoot}${queryURL}`, {
        method: method,
        headers: headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : null,
    });

    const queryResult = await fetch(request);

    let response: Resp = {
        status: queryResult.status,
        ok: queryResult.ok,
        content: '',
    };

    if (queryResult.status == 401) {
        response.content = 'User needs to be logged in to access this feature';
    } else {
        try {
            if (queryResult.ok) {
                response.content = await queryResult.json();
            } else {
                console.error('Error in query: ', queryResult);
                response.content = (await queryResult.json())['detail'];
            }
        } catch {
            response.content = 'An unexpected error occured, please try again';
        }
    }

    return response;
}
