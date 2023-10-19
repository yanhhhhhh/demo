import { memo, useContext } from "react";
import { Flex } from 'antd';
import LanguageSwitch from "../languageSwitch";
import Logo from "@/assets/images/logow.svg";
import Style from "./view.module.less";
import { useMemoizedFn } from "ahooks";
import globalContext, { type GlobalOpt } from '@/providers/globalContext';
import { getDeviceClassname } from '@/utils';

const HeroNav = () => {

  const { device } = useContext<GlobalOpt>(globalContext);

  const goHome = useMemoizedFn(() => {
    location.href = "/";
  });

  return (
    <>
      <Flex
        className={Style.nav}
        align="center"
        justify="space-between"
      >
        {/* 点击返回首页 */}
        <div className={`${getDeviceClassname(device)} ${Style.logo}`} onClick={goHome}>
          <img src={Logo} alt="HIHIUM" />
        </div>
        <LanguageSwitch />
      </Flex>
    </>
  );
};

export default memo(HeroNav);
