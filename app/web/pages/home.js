import React, { useState } from 'react';
import { KeepAlive, Link } from 'umi';
import { Button } from 'antd';

const Count = () => {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
};

const Community = () => {

  return (
    <KeepAlive>
      <div>
        <Count />
        <Link to="/community/topic/425">next page</Link>
      </div>
    </KeepAlive>
  );
};

export default Community;
