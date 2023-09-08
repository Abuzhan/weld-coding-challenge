export class FetchedData {
    processId: string;
    data: object;
}

export class StartFetchingCommand {
    processId: string;
    intervalInMinutes: number;
}
