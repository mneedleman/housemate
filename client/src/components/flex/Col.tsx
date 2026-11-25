import type { HTMLAttributes } from "react";
import { cn } from "src/utils/cn";

const Col = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col", className)} {...rest} />
);

export default Col;
