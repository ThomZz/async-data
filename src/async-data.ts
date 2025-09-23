import { Override } from './utils/types';

/**
 * Represents the state of any asynchronous data, including loading, fulfilled, and rejected states.
 */
export type AsyncData<TData = unknown, TError = Error> = { isLoading: boolean } & (
    | { state: 'pending'; data?: TData }
    | { state: 'fulfilled'; data: TData }
    | { state: 'rejected'; data?: TData; error: TError }
);

/**
 * Narrows down the AsyncData type to the pending state.
 */
export type PendingAsyncData<TData = unknown, T extends AsyncData<TData> = AsyncData<TData>> = Extract<T, { state: 'pending' }>;

/**
 * Narrows down the AsyncData type to the fulfilled state.
 */
export type FulfilledAsyncData<TData = unknown, T extends AsyncData<TData> = AsyncData<TData>> = Extract<T, { state: 'fulfilled' }>;

/**
 * Narrows down the AsyncData type to the rejected state.
 */
export type RejectedAsyncData<TData = unknown, TError = Error, T extends AsyncData<TData, TError> = AsyncData<TData, TError>> = Extract<T, { state: 'rejected' }>;

export namespace AsyncData {
    /**
     * Creates a pending AsyncData object.
     */
    export function create<TData = unknown>(data?: TData, isLoading?: boolean): Extract<AsyncData<TData>, { state: 'pending' }> {
        return { data, state: 'pending', isLoading: isLoading ?? false };
    }

    /**
     * Creates a fulfilled AsyncData object.
     */
    export function resolve<TData = unknown>(data: TData): FulfilledAsyncData<TData> {
        return { data, state: 'fulfilled', isLoading: false };
    }

    /**
     * Creates a rejected AsyncData object.
     */
    export function reject<TData = unknown, TError = Error>(data: TData | undefined, error: TError): RejectedAsyncData<TData, TError> {
        return { data, state: 'rejected', error, isLoading: false };
    }

    /**
     * Checks if the AsyncData is in the pending state.
     */
    export function isPending<TData = unknown, T extends AsyncData<TData> = AsyncData<TData>>(data: T): data is PendingAsyncData<TData, T> {
        return data.state === 'pending';
    }

    /**
     * Checks if the AsyncData is in the fulfilled state.
     */
    export function isFulfilled<TData = unknown, T extends AsyncData<TData> = AsyncData<TData>>(data?: T): data is FulfilledAsyncData<TData, T> {
        return data?.state === 'fulfilled';
    }

    /**
     * Checks if the AsyncData is fulfilled and the data is defined.
     */
    export function isFulfilledAndDefined<TData = unknown, T extends AsyncData<TData> = AsyncData<TData>>(
        data?: T
    ): data is Extract<T, { state: 'fulfilled' }> & { data: NonNullable<unknown> } {
        return Boolean(data && data.state === 'fulfilled' && typeof data.data !== 'undefined');
    }

    /**
     * Checks if the AsyncData is in the rejected state.
     */
    export function isRejected<TData = unknown, TError = Error, T extends AsyncData<TData, TError> = AsyncData<TData, TError>>(
        data: T
    ): data is RejectedAsyncData<TData, TError, T> {
        return data.state === 'rejected';
    }

    /**
     * Checks if an object is an AsyncData object.
     */
    export function is<TData = unknown, TError = Error>(object: object): object is AsyncData<TData, TError> {
        return Reflect.has(object, 'state') && Reflect.has(object, 'isLoading');
    }

    /**
     * Forks an AsyncData object, replacing its data while preserving its  state.
     * This is particularly useful when you want to maintain the entire state of an AsyncData object,
     * but need to change the data it holds, for example, when transforming/selecting data for different usages.
     */
    export function fork<TData = unknown, TError = Error, TForkData = unknown, T extends AsyncData<TData, TError> = AsyncData<TData, TError>>(
        source: T,
        data: TForkData
    ): T extends RejectedAsyncData<TData, TError>
        ? Override<RejectedAsyncData<TData, TError, T>, { data?: TForkData }>
        : T extends PendingAsyncData<TData>
        ? Override<PendingAsyncData<TData, T>, { data?: TForkData }>
        : T extends FulfilledAsyncData<TData>
        ? Override<FulfilledAsyncData<TData, T>, { data: TForkData }>
        : never {

        if (!['pending', 'rejected', 'fulfilled'].includes(source.state)) {
            throw new Error('Cannot fork the provided AsyncData Object. Unsupported state.');
        }
        return { ...source, data } as ReturnType<typeof fork>;
    }
}
