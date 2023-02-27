type O = string | { [key: string]: O };
type OTop = { [key: string]: O };

export const config: OTop = {
    apiRoot: 'http://127.0.0.1:8000',
};
