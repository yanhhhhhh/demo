import { useContext } from 'react';
import globalContext, { type GlobalOpt } from '@/providers/globalContext';
import { getDeviceClassname } from '@/utils';
import Style from "./view.module.less";


interface Props {
  title: string;
}

const SceneHeader = ({
  title
}: Props) => {
  const { device } = useContext<GlobalOpt>(globalContext);

  return <h1 className={`${getDeviceClassname(device)} ${Style.sceneHeader}`}>{title}</h1>
};

export default SceneHeader;
