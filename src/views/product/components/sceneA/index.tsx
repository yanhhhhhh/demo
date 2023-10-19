// 详情页：产品参数
import { useContext } from 'react';
import { Flex } from 'antd';
import { proSpecs, photovoltaicPanelSpecs } from "./constant";
import SceneHeader from "../sceneHeader";
import globalContext, { type GlobalOpt } from '@/providers/globalContext';
import { getDeviceClassname } from '@/utils';
import { useTranslation } from "react-i18next";
import photovoltaicPanelSpecsCover from '@/assets/images/photovoltaicPanelSpecs.png';
import Style from "./view.module.less";

const SceneA = () => {

  const { device } = useContext<GlobalOpt>(globalContext);
  const { t } = useTranslation();

  return (
    <div className={`${getDeviceClassname(device)} ${Style.specsBox}`}>
      <Flex className={`${Style.specs} ${Style.proSpecs}`} justify='center' align='center' vertical>
        <SceneHeader title={t(`header.productSpecifications`)} />
        <Flex className={Style.specsBoard} justify='flex-start' wrap='wrap'>
          {proSpecs.map((item, index) => (
            <Flex className={Style['specs-item']}
              key={index}
              justify="flex-start"
              align="center"
              wrap="nowrap">
              <span className={`auto-wrap ${Style.title}`}>{item.name}</span>
              <span className={`force-wrap ${Style.value}`}>{item.value}</span>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex className={`${Style.specs}  ${Style.photovoltaicPanelSpecs}`} align='center' vertical>
        <SceneHeader title={t(`header.photovoltaicPanelSpecifications`)} />
        <Flex className={Style.content} wrap="wrap">
          <div className={Style.cover}>
            {!device.isPc ? <img src={photovoltaicPanelSpecsCover} /> : null}
          </div>
          <Flex className={`${Style.specs} ${Style.specsBoard}`} wrap="wrap">
            {photovoltaicPanelSpecs.map((item, index) => (
              <Flex
                justify="flex-start"
                align="center"
                className={Style['specs-item']}
                key={index}>
                <span className={`auto-wrap ${Style.title}`}>{item.name}</span>
                <span className={`force-wrap ${Style.value}`} dangerouslySetInnerHTML={{__html:item.value}}></span>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default SceneA;
