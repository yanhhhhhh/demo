import { Flex } from 'antd';
import SceneHeader from '../sceneHeader';
import type { Props } from '.';
import Style from './view.module.less';
import { t } from 'i18next';

const SceneC = ({ features = [] }: Props) => {
  return (
    <div className={`${Style.mobile} ${Style.box}`}>
      <SceneHeader title={t(`header.threeFeatures`)} />
      {features.map((ele, index) => (
        <Flex key={index} className={Style.col} align="center" vertical>
          <h3 dangerouslySetInnerHTML={{ __html: ele.text }}></h3>
          <p>{ele.desc}</p>
          <div className={Style.bottom}>
            <div
              className={Style.cover}
              style={{ backgroundImage: `url(${ele.cover})` }}
            ></div>
            <p>{ele.text}</p>
          </div>
        </Flex>
      ))}
    </div>
  );
};

export default SceneC;
