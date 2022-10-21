import React from 'react';
import { Config } from '../types';
import 'react-toastify/dist/ReactToastify.css';
declare type Props = {
    config: Config;
    children: React.ReactNode;
};
export default function ConfigProvider({ config, children }: Props): JSX.Element;
export {};
