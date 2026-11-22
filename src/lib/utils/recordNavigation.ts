import { isRecordFlowPath, resolveRecordFlowPath } from "@/lib/utils/recordFlowGuard";
import { setRecordFlowActive } from "@/lib/utils/recordSession";

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
  // 앱 내 이동은 플로우 진입으로 보고 가드보다 먼저 활성화 (새 세션 첫 클릭이 /record로 튕기던 문제)
  setRecordFlowActive(isRecordFlowPath(new URL(href, window.location.origin).pathname));
  const resolvedHref = resolveRecordFlowPath(href);

  updateBrowserHistory(resolvedHref, options);
  window.dispatchEvent(
    new CustomEvent(RECORD_ROUTE_CHANGE_EVENT, {
      detail: {
        pathname: new URL(resolvedHref, window.location.origin).pathname,
      },
    }),
  );
};
