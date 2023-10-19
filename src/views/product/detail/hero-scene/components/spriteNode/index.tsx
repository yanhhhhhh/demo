import styles from './index.module.less';
interface SpriteNodeProps {
  text: string;
  labelPosition?: 'left' | 'right';
}
export default function SpriteNode({
  text,
  labelPosition = 'right',
}: SpriteNodeProps) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles['guide-line']} ${
          labelPosition === 'left'
            ? styles['guide-line-left']
            : styles['guide-line-right']
        } `}
      ></div>
      <div
        className={`${styles['tag']} ${
          labelPosition === 'left' ? styles['tag-left'] : ''
        } `}
      >
        {text}
      </div>
    </div>
  );
}
