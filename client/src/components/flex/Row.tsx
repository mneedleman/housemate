import type { HTMLAttributes } from "react";
import { cn } from "src/utils/cn";

const Row = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-row", className)} {...rest} />
);

export default Row;
