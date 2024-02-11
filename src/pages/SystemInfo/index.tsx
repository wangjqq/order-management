import { queryOsData } from '@/services/system';
import { formatBytes } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { Descriptions } from 'antd';
import { useEffect, useState } from 'react';

const SystemInfo = () => {
  const [info, setInfo] = useState<any>([]);

  useEffect(() => {
    queryOsData().then((res) => {
      const info = JSON.parse(res.data.infoList?.[0].osData);
      console.log(info);
      const realInfo1 = [
        {
          key: Math.random(),
          label: '制造商',
          children: info?.cpu?.manufacturer,
        },
        {
          key: Math.random(),
          label: '型号',
          children: info?.cpu?.brand,
        },
        {
          key: Math.random(),
          label: 'L1缓存',
          children: info?.cpu?.cache.l1d + info?.cpu?.cache.l1i + 'KB',
        },
        {
          key: Math.random(),
          label: 'L2缓存',
          children: formatBytes(info?.cpu?.cache.l2),
        },
        {
          key: Math.random(),
          label: 'L3缓存',
          children: formatBytes(info?.cpu?.cache.l3),
        },
        {
          key: Math.random(),
          label: '逻辑处理器',
          children: info?.cpu?.cores,
        },

        {
          key: Math.random(),
          label: '内核',
          children: info?.cpu?.physicalCores,
        },
        {
          key: Math.random(),
          label: '基准速度',
          children: info?.cpu?.speedMax + 'GHZ',
        },
        {
          key: Math.random(),
          label: '满载率',
          children: info?.fullLoad.toFixed(2) + '%',
        },
      ];
      const realInfo2 = info?.graphics?.controllers.reduce(
        (p: any, c: any, index: number) => {
          return [
            ...p,
            {
              key: Math.random(),
              label: '型号',
              children: c.model,
              span: 2,
            },
            {
              key: Math.random(),
              label: '显存',
              children: formatBytes(c.vram, 2, false, false, 1048576),
              span: 1,
            },
          ];
        },
        [],
      );
      const realInfo3 = [
        {
          key: Math.random(),
          label: '物理总共',
          children: formatBytes(info?.mem?.total),
        },
        {
          key: Math.random(),
          label: '物理已用',
          children: formatBytes(info?.mem?.used),
        },
        {
          key: Math.random(),
          label: '物理可用',
          children: formatBytes(info?.mem?.free),
        },
        {
          key: Math.random(),
          label: '交换区总共',
          children: formatBytes(info?.mem?.swaptotal),
        },
        {
          key: Math.random(),
          label: '交换区已用',
          children: formatBytes(info?.mem?.swapused),
        },
        {
          key: Math.random(),
          label: '交换区可用',
          children: formatBytes(info?.mem?.swapfree),
        },
      ];
      const realInfo4 = [
        {
          key: Math.random(),
          label: '版本',
          children: info?.osInfo?.distro + ' ' + info?.osInfo?.release,
          span: 2,
        },
        {
          key: Math.random(),
          label: '架构',
          children: info?.osInfo?.arch,
        },
        {
          key: Math.random(),
          label: '制造商',
          children: info?.system?.manufacturer,
        },
        {
          key: Math.random(),
          label: '型号',
          children: info?.system?.model,
        },
        {
          key: Math.random(),
          label: '虚拟机',
          children: info?.system?.virtual ? '是' : '否',
        },
      ];
      const realInfo5 = [
        {
          label: '版本',
          key: Math.random(),
          children: (
            <>
              {Object.entries(info?.versions).map((item: any) => {
                return (
                  <>
                    <p>
                      {item[0]}: {item[1]}
                    </p>
                  </>
                );
              })}
            </>
          ),
        },
      ];

      setInfo([realInfo1, realInfo2, realInfo3, realInfo4, realInfo5]);
    });
  }, []);

  return (
    <PageContainer ghost title={false}>
      <Descriptions title="系统" bordered items={info?.[3]} />
      <Descriptions title="CPU" bordered items={info?.[0]} />
      <Descriptions title="显卡" bordered items={info?.[1]} />
      <Descriptions title="内存" bordered items={info?.[2]} />
      <Descriptions title="依赖版本" bordered items={info?.[4]} />
    </PageContainer>
  );
};

export default SystemInfo;
