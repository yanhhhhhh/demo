import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Flex } from "antd";
import { useTranslation } from "react-i18next";
import globalContext, { type GlobalOpt } from '@/providers/globalContext';
import { getDeviceClassname } from '@/utils';
import Style from "./view.module.less";

const SceneB = () => {

  const navigate = useNavigate();
  const { device } = useContext<GlobalOpt>(globalContext);
  const { t } = useTranslation();

  return (
    <div className={`${getDeviceClassname(device)} ${Style.page}`}>
      <div className={Style.description}>
        <h1>Hero</h1>
        <p>{t('desc.qualityPriceRatio')} / {t('desc.easyToUse')} / {t('desc.safer')}</p>
      </div>

      <Flex className={Style.operateRow} justify='center'>
        <Button
          size="large"
          className={`${Style.detailBtn}`}
          type="primary"
          onClick={() => navigate('/services_subscriptions')}
        >
          {t('button.subscribeNow')}
        </Button>
        <Button
          size="large"
          className={`${Style.detailBtn}`}
          onClick={() => navigate("/product_detail")}>
          {t('button.learnMore')}
        </Button>
      </Flex>
    </div>)
}

export default SceneB;
