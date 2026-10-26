import { useTranslation } from 'react-i18next';

type TProxy = Record<string, string> & {
    i18n: typeof import('i18next').default;
};

// Properties that should never be treated as translation keys
const IGNORED_PROPS = new Set([
    '$$typeof', 'render', 'then', 'toJSON', 'valueOf', 'toString',
    'constructor', 'prototype', 'length', 'name'
]);

export function useT() {
    const { t, i18n } = useTranslation();

    const tProxy = new Proxy({} as TProxy, {
        get(_target, prop) {
            if (prop === 'i18n') return i18n;
            if (typeof prop === 'string') {
                if (IGNORED_PROPS.has(prop) || prop.startsWith('Symbol(')) {
                    return '';
                }
                return t(prop);
            }
            return '';
        },
    });

    return { t: tProxy, i18n };
}