import React from 'react';
import { IAuthContext } from './contexts';
export default function AuthProvider({ methods, children }: {
    methods: IAuthContext;
    children: React.ReactNode;
}): JSX.Element;
