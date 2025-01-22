import { LabelHTMLAttributes, ReactNode } from 'react';
import cl from './index.module.scss';
import cn from 'classnames';

interface UILabelFieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
}

export const UILabelField = ({
  className,
  htmlFor,
  children,
  ...labelProps
}: UILabelFieldProps) => {
  return (
    <label htmlFor={htmlFor} className={cn(className, cl.label)} {...labelProps}>
      {children}
    </label>
  );
};
