import { StyleProvider, px2remTransformer } from "@ant-design/cssinjs";
import { App, ConfigProvider, Spin } from "antd";
import { useAtomValue } from 'jotai';
import { baseConfig, ELang } from '@/stores';

import AntdEnUs from "antd/es/locale/en_US";

import AntdZhCN from "antd/es/locale/zh_CN";

import "dayjs/locale/zh-cn";

import { FC, PropsWithChildren, ReactElement, Suspense, useMemo, useEffect, useState } from "react";
import GlobalContext, { initialGlobalOpt, type GlobalOpt } from './globalContext';
import { getDevice } from '@/utils';

import type { MessageInstance } from "antd/es/message/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import type { NotificationInstance } from "antd/es/notification/interface";

// 添加前缀类，用于自定义静态方法的颜色
ConfigProvider.config({
  prefixCls: "hero",
});

export interface AntdStaticMethodProps extends PropsWithChildren {}

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, "warn">;

const AntdStaticMethodProvider: FC<AntdStaticMethodProps> = (props) => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
  return <>{props.children}</>;
};

export { message, modal, notification };

export default function Providers(props: { children: ReactElement }) {

  const base = useAtomValue(baseConfig);

  const locale = useMemo(() => {
    const lang = base.language;
    switch (lang) {
      case ELang.chinese:
        return AntdZhCN;
      case ELang.english:
        return AntdEnUs;
      default:
        return AntdEnUs;
    }
  }, [base.language]);

  const px2rem = px2remTransformer({
    rootValue: 32, // 32px = 1rem; @default 16
  });

  const [globalOpt, setGlobalOpt] = useState<GlobalOpt>(initialGlobalOpt);

  useEffect(() => {
    const device = getDevice();
    setGlobalOpt({
      ...initialGlobalOpt,
      device
    })
  }, []);

  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#3866F7",
            colorSuccess: "#0ed180",
            colorWarning: "#ffa623",
            colorError: "#ff425c",
            // colorBgBase: "#080808",
            controlOutlineWidth: 0,
          },
          components: {
            Button: {
              // padding: 0,
            }
          },
        }}
        locale={locale}
        prefixCls="hero"
      >
        <App>
          <GlobalContext.Provider value={globalOpt}>
            <AntdStaticMethodProvider>
              <Suspense fallback={<Spin />}>{props.children}</Suspense>
            </AntdStaticMethodProvider>
          </GlobalContext.Provider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
