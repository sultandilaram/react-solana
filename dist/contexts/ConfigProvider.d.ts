import React from 'react';
import { Config } from '../types';
export default function ConfigProvider({ config, children }: {
    config: Config;
    children: React.ReactNode;
}): JSX.Element;
