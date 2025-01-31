import { LabelHTMLAttributes, ReactNode } from 'react';
import cl from './index.module.scss';
import cn from 'classnames';

interface UILabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
}

export const UILabel = ({
  className,
  htmlFor,
  children,
  ...labelProps
}: UILabelProps) => {
  return (
    <label htmlFor={htmlFor} className={cn(className, cl.label)} {...labelProps}>
      {children}
    </label>
  );
};
