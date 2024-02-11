import EChart from '@/component/EChart';
import { queryOsData } from '@/services/system';
import { formatBytes } from '@/utils/format';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Select } from 'antd';
import { useRef, useState } from 'react';
import styles from './index.module.less';

const Monitor: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const [fs, setFs] = useState<any>();
  const [pageSize, setPageSize] = useState(5);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 48,
      render: (_, record, index, action: any) => {
        const { current, pageSize } = action.pageInfo;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'CPU信息',
      dataIndex: 'cpu',
    },
    {
      title: '内存信息',
      dataIndex: 'mem',
    },
    {
      title: '进程数',
      dataIndex: 'processes',
    },
    {
      title: '记录时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
  ];
  console.log(list);
  return (
    <PageContainer ghost title={false}>
      <div className={styles['monitors']}>
        <EChart
          style={{ width: '33%', height: '300px' }}
          options={{
            title: {
              text: '内存占用',
              left: 'center',
            },
            // 提示框
            tooltip: {
              trigger: 'axis',
            },
            // 图例
            legend: {
              data: ['已用内存'],
              bottom: 10,
            },
            // 横坐标
            xAxis: {
              type: 'category',
              data: list.infoList
                ?.map((item: any) => {
                  const date = new Date(item.created_at);
                  return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                })
                .reverse(),
            },
            // 纵坐标
            yAxis: {
              type: 'value',
              name: formatBytes(
                list.infoList?.[0]?.osData.mem.total,
                2,
                true,
                true,
              ),
              min: 0,
              max: formatBytes(list.infoList?.[0].osData.mem.total, 2, true),
            },
            // 数据系列
            series: [
              {
                name: '已用内存',
                type: 'line',
                data: list.infoList
                  ?.map((item: any) =>
                    formatBytes(item.osData.mem.used, 2, true),
                  )
                  .reverse(),
                // 平滑曲线样式
                smooth: true,
              },
            ],
          }}
        />
        <EChart
          style={{ width: '33%', height: '300px' }}
          options={{
            title: {
              text: 'CPU占用',
              left: 'center',
            },
            // 提示框
            tooltip: {
              trigger: 'axis',
            },
            // 图例
            legend: {
              data: ['CPU占用率'],
              bottom: 10,
            },
            // 横坐标
            xAxis: {
              type: 'category',
              data: list.infoList
                ?.map((item: any) => {
                  const date = new Date(item.created_at);
                  return date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                })
                .reverse(),
            },
            // 纵坐标
            yAxis: {
              type: 'value',
              name: '百分比',
              min: 0,
              max: 100,
            },
            // 数据系列
            series: [
              {
                name: 'CPU占用率',
                type: 'line',
                data: list.infoList
                  ?.map((item: any) =>
                    item.osData.currentLoad.currentLoad.toFixed(2),
                  )
                  .reverse(),
                // 平滑曲线样式
                smooth: true,
              },
            ],
          }}
        />
        <Select
          value={fs}
          style={{ width: 120 }}
          onChange={(value) => setFs(value)}
          options={list?.infoList?.[0].osData.fsSize.map((item: any) => {
            return { value: item.fs, label: item.fs + formatBytes(item.size) };
          })}
        />
        <EChart
          style={{ width: '33%', height: '300px' }}
          options={{
            title: {
              text: '硬盘占用',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            series: [
              {
                name: '硬盘使用情况',
                type: 'pie',
                radius: ['20%', '30%'],
                avoidLabelOverlap: false,
                label: {
                  show: true,
                },
                labelLine: {
                  show: true,
                },
                data: [
                  {
                    value: formatBytes(
                      list?.infoList?.[0].osData.fsSize.find(
                        (item: any) => item.fs === fs,
                      ).used,
                      2,
                      true,
                      false,
                    ),
                    itemStyle: {
                      color: 'rgb(172, 172, 172)',
                    },
                    name:
                      '已用空间' +
                      '\n' +
                      formatBytes(
                        list?.infoList?.[0].osData.fsSize.find(
                          (item: any) => item.fs === fs,
                        ).used,
                      ),
                  },
                  {
                    value: formatBytes(
                      list?.infoList?.[0].osData.fsSize.find(
                        (item: any) => item.fs === fs,
                      ).size -
                        list?.infoList?.[0].osData.fsSize.find(
                          (item: any) => item.fs === fs,
                        ).used,
                      2,
                      true,
                      false,
                    ),
                    itemStyle: {
                      color: 'rgb(38, 160, 218)',
                    },
                    name:
                      '可用空间' +
                      '\n' +
                      formatBytes(
                        list?.infoList?.[0].osData.fsSize.find(
                          (item: any) => item.fs === fs,
                        ).size -
                          list?.infoList?.[0].osData.fsSize.find(
                            (item: any) => item.fs === fs,
                          ).used,
                      ),
                  },
                ],
              },
            ],
          }}
        />
      </div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params: { pageSize: number; current: number }) => {
          const { data } = await queryOsData(params);
          setFs(JSON.parse(data?.infoList?.[0].osData).fsSize[0].fs);
          setList({
            ...data,
            infoList: data.infoList.map((item: any) => ({
              ...item,
              osData: JSON.parse(item.osData),
            })),
          });
          const columnData = data.infoList.map((item: any) => {
            const osData = JSON.parse(item.osData);

            return {
              cpu: `${
                osData.cpuCurrentSpeed.avg
              }GHZ ${osData.currentLoad.currentLoad.toFixed(2)}%`,
              mem: `${formatBytes(osData.mem.used)}/${formatBytes(
                osData.mem.total,
              )} ${((osData.mem.used / osData.mem.total) * 100).toFixed(2)}%`,
              processes: osData.processes.unknown,
              created_at: item.created_at,
            };
          });
          return { data: columnData, total: data.total };
        }}
        rowKey="id"
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        search={false}
        pagination={{
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange(current, size) {
            setPageSize(size);
          },
        }}
        toolBarRender={() => []}
      />
    </PageContainer>
  );
};

export default Monitor;
