import { createElement, useMemo, useRef } from 'react';
import { useInViewport } from 'ahooks';
import type { HTMLAttributes, ReactNode, PropsWithChildren } from 'react';
import Style from './view.module.less';

type Ele = HTMLParagraphElement | HTMLSpanElement | HTMLHeadingElement;

interface Props extends PropsWithChildren {
  tag: string;
  props: HTMLAttributes<Ele>;
  node: ReactNode
}

const FadeText = ({
  tag,
  props,
  node,
  children,
}: Props) => {

  const dRef = useRef<Ele>();

  const [inViewport] = useInViewport(dRef, {
    threshold: 0.3,
  });

  const statusChangeClassName = useMemo(() => {
    return inViewport ? Style['fade-next-status'] : Style['fade-prev-status']
  }, [inViewport]);


  return createElement(
    tag,
    {
      ...props,
      className: `${props.className} hero-animate ${statusChangeClassName}`,
      ref: dRef,
    },
    node
  )
}

export default  FadeText;
