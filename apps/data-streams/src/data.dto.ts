export class StartFetchingRequest {
    intervalInMinutes: number;
}

export class StartFetchingCommand {
    processId: string;
    intervalInMinutes: number;
}

export class FetchedData {
    processId: string;
    data: object;
}
