import { useAtom } from 'jotai';
import { Dropdown, type MenuProps } from 'antd';
import {
  GlobalOutlined,
} from '@ant-design/icons';
import i18n from '@/utils/i18nConfig';
import { baseConfig } from '@/stores';

import Style from './index.module.less'


const LanguageSwitch = () => {

  const [, setBase] = useAtom(baseConfig);

  const items: MenuProps['items'] = [
    { key: 'en', label: 'EN' },
    { key: 'zh-CN', label: '中' }
  ]

  const handleItemClick: MenuProps['onClick'] = ({key}) => {
    i18n.changeLanguage(key);
    setBase({
      language: key
    });
  }

  return (<>
    <Dropdown menu={{ items, onClick: handleItemClick }} placement="bottomLeft" arrow>
      <GlobalOutlined className={Style.lanIcon} />
    </Dropdown>
  </>)
}

export default LanguageSwitch;
