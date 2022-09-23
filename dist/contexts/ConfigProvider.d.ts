import React from 'react';
import { Config } from '../types';
declare type Props = {
    config: Config;
    children: React.ReactNode;
};
export default function ConfigProvider({ config, children }: Props): JSX.Element;
export {};
