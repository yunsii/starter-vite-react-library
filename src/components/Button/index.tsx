import React from 'react';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  extra?: React.ReactNode;
}

export default function Button(props: IButtonProps) {
  const { extra, children, ...rest } = props;

  return (
    <>
      <button {...rest}>{children}</button>
      {extra}
    </>
  );
}
