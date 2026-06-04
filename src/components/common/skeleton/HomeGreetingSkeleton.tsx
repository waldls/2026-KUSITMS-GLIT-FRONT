import Skeleton from "./Skeleton";

const HomeGreetingSkeleton = () => (
  <div aria-busy aria-label="인사말 로딩 중">
    <Skeleton className="mx-auto h-13 w-56 rounded" />
  </div>
);

export default HomeGreetingSkeleton;
