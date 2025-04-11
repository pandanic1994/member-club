import type { FC, PropsWithChildren } from 'react';

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
    return <div className="tw-flex tw-h-full tw-items-center tw-justify-center">{children}</div>;
};

export default AuthLayout;
