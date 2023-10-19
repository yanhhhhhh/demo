// 首页二屏
import { useMemo, useRef, useState, useContext } from 'react';
import { Flex } from 'antd';
import globalContext, { type GlobalOpt } from '@/providers/globalContext';
import SceneHeader from '../sceneHeader';
import { useTranslation } from 'react-i18next';
import { type Props } from './';
import Style from './view.module.less';

const SceneC = ({ features = [] }: Props) => {
  const { device } = useContext<GlobalOpt>(globalContext);

  const [curFeatureIdx, setCurFeatureIdx] = useState<number>(0);
  const bgBoxRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const handlePointerEnter = (order: number) => {
    const list = bgBoxRef.current?.children as unknown as HTMLDivElement[];
    for (let i = 0; i < list?.length; i++) {
      const li = list[i] as HTMLDivElement;
      li.style.opacity = '0';
      if (i === order) {
        li.style.opacity = '1';
      }
    }
    setCurFeatureIdx(order);
  };

  const handlePointerLeave = (order: number) => {};

  const curFeature = useMemo(() => {
    return features[curFeatureIdx || 0];
  }, [curFeatureIdx]);

  const curFeatureText = useMemo(() => {
    return device.isTablet
      ? curFeature.text
      : curFeature.lineBreakText || curFeature.text;
  }, [curFeature, device]);

  return (
    <div className={Style.box}>
      <SceneHeader title={t(`header.threeFeatures`)} />
      <Flex className={Style.row} justify="center" align="center">
        <Flex className={Style.boxl} justify="center" vertical>
          <h3 dangerouslySetInnerHTML={{ __html: curFeatureText }}></h3>
          <p>{curFeature.desc}</p>
        </Flex>
        <div className={Style.boxr}>
          <div className={Style.bgBox} ref={bgBoxRef}>
            {features.map((ele, index) => (
              <div
                className={Style.cover}
                key={index}
                style={{ backgroundImage: `url(${ele.cover})` }}
              ></div>
            ))}
          </div>
          <Flex className={Style.lineBox} justify="center" align="center">
            {features.map((ele, index) => (
              <p
                key={ele.text}
                className={`${Style.title} ${
                  curFeatureIdx === index ? Style.active : ''
                }`}
                dangerouslySetInnerHTML={{
                  __html: ele.lineBreakText || ele.text,
                }}
                onPointerEnter={() => handlePointerEnter(index)}
                onPointerLeave={() => handlePointerLeave(index)}
              ></p>
            ))}
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

export default SceneC;
