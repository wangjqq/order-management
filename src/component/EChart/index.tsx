import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { debounce } from 'lodash-es';
import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

interface EChartProps {
  options: echarts.EChartsOption;
  style?: React.CSSProperties;
  onClick?: (params: any) => void;
  loading?: boolean;
}

const EChart = (props: EChartProps, ref: any) => {
  const { options, style = {}, onClick, loading = false } = props;
  const cDom = useRef(null);
  const cInstance = useRef<EChartsType | undefined>();

  const getInstance = () => cInstance.current;
  useImperativeHandle(ref, () => ({ getInstance }));

  useEffect(() => {
    if (cDom.current) {
      // 校验 Dom 节点上是否已经挂载了 ECharts 实例，只有未挂载时才初始化
      cInstance.current = echarts.getInstanceByDom(cDom.current);
      if (!cInstance.current) {
        cInstance.current = echarts.init(cDom.current, null, {
          renderer: 'svg',
        });
      }
      // 设置配置项
      options && cInstance.current.setOption(options);
      // 绑定点击事件
      cInstance.current.on('click', (event) => {
        if (event && onClick) onClick(event);
      });
    }

    return () => {
      // 容器被销毁之后，销毁实例，避免内存泄漏
      cInstance.current?.dispose();
    };
  }, [cDom, options]);

  // 展示 loading 动画
  useEffect(() => {
    loading
      ? cInstance.current?.showLoading()
      : cInstance.current?.hideLoading();
  }, [loading]);

  // 窗口自适应并开启过渡动画
  const resize = () => {
    if (cInstance.current) {
      cInstance.current.resize({
        animation: { duration: 300 },
      });
    }
  };

  const debounceResize = debounce(resize, 500);

  // 监听窗口大小
  useEffect(() => {
    window.addEventListener('resize', debounceResize);

    return () => {
      window.removeEventListener('resize', debounceResize);
    };
  }, []);

  // 监听高度变化
  useLayoutEffect(() => {
    debounceResize();
  }, [style.width, style.height]);

  return <div ref={cDom} style={{ width: '100%', height: '100%', ...style }} />;
};

export default React.memo(React.forwardRef(EChart));
