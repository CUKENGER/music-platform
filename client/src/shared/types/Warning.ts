import { FieldError } from "react-hook-form";

export interface IWarning {
  condition?: boolean | FieldError;
  text?: string;
}
