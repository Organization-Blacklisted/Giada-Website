import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow";
}
