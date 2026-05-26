export const RECORD_ROUTE_CHANGE_EVENT = "record-route-change";

type NavigateRecordOptions = {
  replace?: boolean;
};

const updateBrowserHistory = (href: string, options?: NavigateRecordOptions) => {
  const methodName = options?.replace ? "replaceState" : "pushState";
  const historyPrototype = Object.getPrototypeOf(window.history) as History;
  const historyMethod = historyPrototype[methodName] as (
    data: unknown,
    unused: string,
    url?: string | URL | null,
  ) => void;

  historyMethod.call(window.history, window.history.state, "", href);
};

export const replaceRecordHistory = (href: string) => {
  updateBrowserHistory(href, { replace: true });
};

export const navigateRecord = (href: string, options?: NavigateRecordOptions) => {
  updateBrowserHistory(href, options);
  window.dispatchEvent(
    new CustomEvent(RECORD_ROUTE_CHANGE_EVENT, {
      detail: {
        pathname: new URL(href, window.location.origin).pathname,
      },
    }),
  );
};
