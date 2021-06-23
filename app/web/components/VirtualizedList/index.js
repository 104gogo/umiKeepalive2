import React, { useState } from 'react';
import { List, Spin } from 'antd';
import { useActivate, useUnactivate } from 'umi';
import { useRequest } from '@umijs/hooks';
import {
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized/dist/commonjs/CellMeasurer';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';

import styles from './index.less';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

const VirtualizedList = (props) => {
  const { renderItem, globalData } = props;
  const [list, setList] = useState([]);
  const [_, setRandomKey] = useState(Math.random);
console.log('globalData', globalData);
  useActivate(() => {
    setRandomKey(Math.random);
    console.log('TestFunction: didActivate');
  });

  useUnactivate(() => {
    console.log('TestFunction: willUnactivate');
  });

  // 获取列表
  const { loading, run } = useRequest(
    () => {
      const data = new Array(20)
        .fill({})
        .map((item, index) => ({ ...item, id: globalData.startIndex++, height: getRandomInt(170, 500) }));

      return new Promise(resolve => setTimeout(() => resolve(data), 1000));
    },
    {
      onSuccess(data) {
        setList([...list, ...data]);
      },
    },
  );

  // 翻页获取更多数据
  const handleInfiniteOnLoad = async ({ startIndex, stopIndex }) => {
    if (loading) return;

    for (let i = startIndex; i <= stopIndex; i++) {
      globalData.loadedRowsMap[i] = 1; // 1 means loading
    }

    run();
  };

  const isRowLoaded = ({ index }) => !!globalData.loadedRowsMap[index];

  const renderRow = ({ index, key, parent, style }) => {
    const item = list[index];

    return (
      <CellMeasurer
        cache={globalData.cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        <List.Item key={key} style={style}>
          {renderItem(item)}
        </List.Item>
      </CellMeasurer>
    );
  };

  const vlist = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
    onRowsRendered,
    width,
  }) => (
    <VList
      autoHeight
      height={height || 170}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      overscanRowCount={0}
      rowCount={list.length}
      rowHeight={globalData.cache.rowHeight}
      rowRenderer={renderRow}
      onRowsRendered={onRowsRendered}
      scrollTop={scrollTop}
      width={width}
    />
  );

  const autoSize = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
    onRowsRendered,
  }) => (
    <AutoSizer disableHeight>
      {({ width }) =>
        vlist({
          height,
          isScrolling,
          onChildScroll,
          scrollTop,
          onRowsRendered,
          width,
        })
      }
    </AutoSizer>
  );

  const infiniteLoader = ({
    height,
    isScrolling,
    onChildScroll,
    scrollTop,
  }) => (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleInfiniteOnLoad}
      rowCount={list.length}
      threshold={1}
    >
      {({ onRowsRendered }) =>
        autoSize({
          height,
          isScrolling,
          onChildScroll,
          scrollTop,
          onRowsRendered,
        })
      }
    </InfiniteLoader>
  );

  const renderBottom = () => {
    if (loading) return <Spin />;

    return '';
  };

  return (
    <div className={styles.virtualizedList}>
      <List>
        {list.length > 0 && (
          <WindowScroller scrollElement={document.getElementById('container')}>
            {infiniteLoader}
          </WindowScroller>
        )}
      </List>
      <div style={{ textAlign: 'center' }}>{renderBottom()}</div>
    </div>
  );
};

export default VirtualizedList;
