import * as Y from 'yjs';
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
export interface Config<T> {
    triggerKey: string;
    cursorDivId: string;
    chatDivId: string;
    userMetaData: UserMetadata<T>;
    renderCursor: <T>(cursor: Cursor<T>) => HTMLElement;
    yDoc: Y.Doc;
}
export declare const DefaultConfig: {
    triggerKey: string;
    cursorDivId: string;
    chatDivId: string;
    userMetaData: {};
    renderCursor: typeof defaultCursorRenderer;
    yDoc: undefined;
};
export declare const initCursorChat: <T>(room_id?: string, config?: Partial<Config<T>>) => () => void;
export {};
