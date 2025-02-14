export interface IStoreProvider {

    upload({ id, userId, file }: { id: string; userId: string; file: File }): Promise<string>;

    get({ id }: { id: string }): Promise<string>;

    remove({ id }: { id: string }): Promise<void>;
}
