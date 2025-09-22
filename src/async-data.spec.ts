import { AsyncData } from './async-data';

describe('AsyncData', () => {
    it('should create pending AsyncData', () => {
        const expected = AsyncData.create<number>(undefined, true);
        expect(expected).toEqual({ state: 'pending', data: undefined, isLoading: true });
        expect(AsyncData.isPending(expected)).toBe(true);
    })
    it('should resolve AsyncData', () => {
        const expected = AsyncData.resolve<number>(1);
        expect(expected).toEqual({ state: 'fulfilled', data: 1, isLoading: false });
        expect(AsyncData.isFulfilled(expected)).toBe(true);
        expect(AsyncData.isFulfilledAndDefined(expected)).toBe(true);
    })
    it('should reject AsyncData', () => {
        const expectedError = new Error('This is a fatal error.');
        const expected = AsyncData.reject<number>(undefined, expectedError);
        expect(expected).toEqual({ state: 'rejected', data: undefined, error: expectedError,  isLoading: false });
        expect(AsyncData.isRejected(expected)).toBe(true);
    })
    it('should create AsyncData from an unknown object', () => {
        const unknownObject = { state: 'pending', data: undefined, isLoading: true };
        expect(AsyncData.is(unknownObject)).toBe(true);
        if (AsyncData.is(unknownObject)) {
            const asyncData = unknownObject;
            expect(AsyncData.isPending(asyncData)).toBe(true);
        }
    })
    it('should fork AsyncData', () => {
        const pending = AsyncData.create<number>(undefined, true);
        const fulfilled = AsyncData.resolve<number>(1);
        const rejected = AsyncData.reject<number>(undefined, new Error('This is a fatal error.'));

        const forkedPending = AsyncData.fork(pending, 'forked');
        const forkedFulfilled = AsyncData.fork(fulfilled, 'forked');
        const forkedRejected = AsyncData.fork(rejected, 'forked');

        expect(forkedPending).toEqual({ state: 'pending', data: 'forked', isLoading: true });
        expect(forkedFulfilled).toEqual({ state: 'fulfilled', data: 'forked', isLoading: false });
        expect(forkedRejected).toEqual({ state: 'rejected', data: 'forked', error: rejected.error, isLoading: false });
    })
});
