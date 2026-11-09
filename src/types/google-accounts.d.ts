export {};

declare global {
  const google: {
    accounts: {
      id: {
        initialize: (options: {
          client_id: string;
          callback: (response: { credential: string }) => void;
        }) => void;
        renderButton: (parent: HTMLElement, options?: unknown) => void;
      };
    };
  };
}
