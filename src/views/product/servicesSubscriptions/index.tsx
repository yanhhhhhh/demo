import { useState, useContext }  from 'react';
import { Button, Flex } from 'antd';
import { useTranslation } from "react-i18next";
import SceneHeader from '../components/sceneHeader';
import { serviceList } from './constants';
import globalContext, { type GlobalOpt } from '@/providers/globalContext';
import { getDeviceClassname } from '@/utils';
import Style from './view.module.less';

const ServicesSubscriptions = () => {

  const { device } = useContext<GlobalOpt>(globalContext);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const { t } = useTranslation();

  const onClick = (idx: number) => {
    setActiveIdx(idx);
  }
  
  
  return (<div className={`${getDeviceClassname(device)} ${Style.subscriptions}`}>
    <SceneHeader title='订阅服务' />
    <Flex className={`${Style.box}`} wrap="wrap" gap={"large"} justify="center">
    {
      serviceList.map((ele, index) => (
        <div  key={index} className={`${Style.card} ${activeIdx === index ? Style.active : ''}`}
          onClick={() => onClick(index)}>
          <div className={Style.top}>{ele.currencySign}{ele.price}</div>
          <div className={Style.middle}>
            <p>{ele.name}</p>
            <p>{ele.desc}</p>
            <p>{ele.canCancel}</p>
            <p>{ele.billingCycle}</p>
            <p>{ele.package}</p>
          </div>
          <div className={Style.bottom}>
            <Button className={Style.subBtn} type={activeIdx === index ? 'primary' : 'default'}>{t('button.subscribeNow')}</Button>
          </div>
        </div>
        
      ))
      }
    </Flex>
  </div>)
};

export default ServicesSubscriptions;
