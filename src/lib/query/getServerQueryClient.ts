import "server-only";

import { createQueryClient } from "@/lib/query/createQueryClient";

/** 서버 컴포넌트·Server Action 요청마다 새 인스턴스 (요청 간 공유 금지) */
export const getServerQueryClient = () => createQueryClient();
