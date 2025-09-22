# AsyncData

A lightweight, dependency-free utility for managing and typing asynchronous data states with ease.

## Features
- Type-safe representation of async data states (pending, fulfilled, rejected)
- **Leverages TypeScript's type narrowing for safe and expressive code**
- Utility functions for state creation, checking, and transformation
- No dependencies

## TypeScript Type Narrowing

AsyncData is designed to work hand in hand with TypeScript's type narrowing. By using the provided type guard functions (like `isPending`, `isFulfilled`, `isRejected`), you can safely narrow the type of your async data state within conditional blocks. This enables full type safety and autocompletion for the specific state you are handling. It can be especially handy in scenarios like RxJS pipelines, where you want to filter or transform streams based on the async data state while maintaining full type safety.

You can also use an explicit check on `state` (e.g., `data.state === 'fulfilled'`), but using the provided type guards is recommended for clarity.

```typescript
if (AsyncData.isFulfilled(data)) {
  // TypeScript knows 'data' is FulfilledAsyncData<T>
  // You can safely access data.data here
  console.log(data.data);
} else if (AsyncData.isRejected(data)) {
  // TypeScript knows 'data' is RejectedAsyncData<T, E>
  console.error(data.error);
}
// Or, using an explicit check (less type-safe):
if (data.state === 'fulfilled') {
  // TypeScript may not fully narrow the type here
  console.log(data.data);
}
```

## Installation

```bash
npm install @thomzz/async-data
```

## Usage

```typescript
import { AsyncData } from '@thomzz/async-data';

// Create a pending async data state
const pending = AsyncData.create();

// Create a fulfilled async data state
const fulfilled = AsyncData.resolve('result');

// Create a rejected async data state
const rejected = AsyncData.reject(undefined, new Error('Something went wrong'));

// Type narrowing in action:
if (AsyncData.isPending(pending)) {
  // 'pending' is now PendingAsyncData
}
if (AsyncData.isFulfilled(fulfilled)) {
  // 'fulfilled' is now FulfilledAsyncData
}
if (AsyncData.isRejected(rejected)) {
  // 'rejected' is now RejectedAsyncData
}

// Forking (transforming data while preserving state)
const newFulfilled = AsyncData.fork(fulfilled, 123); // data is now typed as a number (123)
```

### In a real life context

AsyncData is especially useful in applications with mutable data structures and reactive UI frameworks (such as React, Vue, Svelte, etc.). It enables you to:

- Clearly represent and track loading, success, and error states for asynchronous operations (e.g., API calls, data fetching, form submissions).
- Safely update and mutate state in response to user actions or network events, while keeping your UI in sync.
- Use type guards to write type-safe UI logic, ensuring you only access data or error properties when the state is appropriate.
- Improve developer experience with autocompletion and type inference in your UI components.
- **Serve as a foundation for state management**, making it easy to represent, update, and reason about async state transitions in both simple and complex state management solutions (e.g., Redux, Zustand, Vuex, custom stores, NgRx etc.).

AsyncData can be integrated into your state management logic to provide a consistent and type-safe way to handle asynchronous state, reducing boilerplate and potential bugs.

**Naive example in a React-like context, just to give you the idea :**

```tsx
const [userData, setUserData] = useState(AsyncData.create<User>());

useEffect(() => {
  setUserData(AsyncData.create(undefined, true));
  fetchUser()
    .then(user => setUserData(AsyncData.resolve(user)))
    .catch(error => setUserData(AsyncData.reject(undefined, error)));
}, []);

if (AsyncData.isPending(userData)) {
  return <Spinner />;
}
if (AsyncData.isRejected(userData)) {
  return <ErrorMessage error={userData.error} />;
}
return <UserProfile user={userData.data} />;
```

## API Reference

### Types

- `AsyncData<TData, TError>`: Represents the state of any asynchronous data, including loading, fulfilled, and rejected states.
- `PendingAsyncData<TData>`: Narrows down the AsyncData type to the pending state.
- `FulfilledAsyncData<TData>`: Narrows down the AsyncData type to the fulfilled state.
- `RejectedAsyncData<TData, TError>`: Narrows down the AsyncData type to the rejected state.

### Namespace: `AsyncData`

#### `create<TData>(data?: TData, isLoading?: boolean)`
Creates a pending AsyncData object.

#### `resolve<TData>(data: TData)`
Creates a fulfilled AsyncData object.

#### `reject<TData, TError>(data: TData | undefined, error: TError)`
Creates a rejected AsyncData object.

#### `isPending<TData>(data: AsyncData<TData>)`
Checks if the AsyncData is in the pending state. **Acts as a type guard for narrowing.**

#### `isFulfilled<TData>(data?: AsyncData<TData>)`
Checks if the AsyncData is in the fulfilled state. **Acts as a type guard for narrowing.**

#### `isFulfilledAndDefined<TData>(data?: AsyncData<TData>)`
Checks if the AsyncData is fulfilled and the data is defined.

#### `isRejected<TData, TError>(data: AsyncData<TData, TError>)`
Checks if the AsyncData is in the rejected state. **Acts as a type guard for narrowing.**

#### `is<TData, TError>(object: object)`
Checks if an object is an AsyncData object.

#### `fork`
Forks an AsyncData object, replacing its data while preserving its state. Overloads:

## License

Apache-2.0
