import EChart from '@/component/EChart';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.module.less';

const Monitor: React.FC = () => {
  return (
    <PageContainer ghost title={false}>
      <div className={styles['monitors']}>
        <EChart
          style={{ width: '50%' }}
          options={{
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line',
              },
            ],
          }}
        />
        <EChart
          style={{ width: '50%' }}
          options={{
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line',
              },
            ],
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Monitor;
