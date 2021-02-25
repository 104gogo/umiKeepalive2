import React from 'react';
import { KeepAlive, history, useAliveController } from 'umi';
import {
  CellMeasurerCache,
} from 'react-virtualized/dist/commonjs/CellMeasurer';
import VirtualizedList from '@/components/VirtualizedList';

import styles from './index.less';

window.home = {
  loadedRowsMap: {},
  startIndex: 0,
  cache: new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 170,
  }),
};

export default () => {
  const { drop } = useAliveController();

  const renderItem = data => {
    return (
      <div
        key={data.id}
        className={styles.card}
        style={{ height: data.height }}
        onClick={() => {
          drop('tagList');

          window.tagList = {
            loadedRowsMap: {},
            startIndex: 0,
            cache: new CellMeasurerCache({
              fixedWidth: true,
              minHeight: 170,
            }),
          };
          setTimeout(() => {
            history.push('/tagList');
          }, 0);
        }}
      >
        {data.id}
      </div>
    );
  };

  return (
    <div className={styles.body}>
      <div className={styles.header} />
      <KeepAlive name="home">
        <div id="container" className={styles.content}>
          <div className={styles.block} />
          {/* <AntdList renderItem={renderItem} /> */}
          <VirtualizedList renderItem={renderItem} globalKey="home" />
        </div>
      </KeepAlive>
    </div>
  );
};
