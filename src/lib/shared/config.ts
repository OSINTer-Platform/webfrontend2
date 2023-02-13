type O = string | { [key: string]: O };
type OTop = { [key:string]: O}

export const config: OTop = {
	apiRoot : "http://localhost:8000"
}
