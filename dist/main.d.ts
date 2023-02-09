declare type UserMetadata<T> = {
    [key: string]: T;
};
interface Cursor<T> {
    id: string;
    x: number;
    y: number;
    chat: string;
    color: string;
    userMetaData: UserMetadata<T>;
}
export declare function defaultCursorRenderer<T>(cursor: Cursor<T>): HTMLElement;
export declare const initCursorChat: <T>(room_id?: string, triggerKey?: string, cursorDivId?: string, chatDivId?: string, userMetaData?: UserMetadata<T>, renderCursor?: <T_1>(cursor: Cursor<T_1>) => HTMLElement) => () => void;
export {};
