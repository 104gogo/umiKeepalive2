// @ts-nocheck
import { IRouteComponentProps } from 'umi'

// only export isBrowser for user
export { isBrowser } from '/Users/yunfenqiu/github/my/umiKeepalive2/node_modules/@umijs/utils/lib/ssr.js';

interface IParams extends Pick<IRouteComponentProps, 'match'> {
  isServer: Boolean;
  [k: string]: any;
}

export type IGetInitialProps<T = any> = (params: IParams) => Promise<T>;
