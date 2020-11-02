import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';

import { Container, Content } from 'components/Layout';
import { Loading } from 'components/Loading';
import Skeleton from 'components/Skeleton';
import Notification from 'components/App/Notification';
import InfiniteScroll from 'components/InfiniteScroll';
import Empty from 'components/Empty';
import Head from 'components/Head';

import { useStore } from 'store';

import { GET_USER_NOTIFICATION } from 'graphql/notification';

import { NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT } from 'constants/DataLimit';

import { getListNotification } from '../../networking/Server'

const Root = styled(Container)`
  margin-top: ${(p) => p.theme.spacing.lg};
`;

const List = styled.div`
  overflow: hidden;
  border-radius: ${(p) => p.theme.radius.sm};
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

/**
 * Notifications page
 */
const Notifications = () => {
  const [{ auth }] = useStore();
  const variables = {
    userId: auth.user.id,
    skip: 0,
    limit: NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT,
  };
  const { data, loading, fetchMore, networkStatus } = useQuery(GET_USER_NOTIFICATION, {
    variables,
    notifyOnNetworkStatusChange: true,
  });
  const [dataArr, setDataArr] = useState([]);
  const refreshDataFromServer = () => {
    getListNotification().then((data) => {
      setDataArr(data)
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    refreshDataFromServer()
  }, []);

  const renderContent = () => {
    if (loading && networkStatus === 1) {
      return <Skeleton height={56} bottom="xxs" count={NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT} />;
    }

    const { notifications, count } = dataArr.getUserNotifications;
    if (!notifications.length) {
      return <Empty text="No notifications yet." />;
    }

    return (
      <InfiniteScroll
        data={notifications}
        dataKey="getUserNotifications.notifications"
        count={parseInt(count)}
        variables={variables}
        fetchMore={fetchMore}
      >
        {(data) => {
          const showNextLoading = loading && networkStatus === 3 && count !== data.length;

          return (
            <>
              <List>
                {notifications.map((notification) => (
                  <Notification key={notification._id} notification={notification} close={() => false} />
                ))}
              </List>

              {showNextLoading && <Loading top="lg" />}
            </>
          );
        }}
      </InfiniteScroll>
    );
  };

  return (
    <Content>
      <Root maxWidth="md">
        <Head title={`${auth.user.username}'s Notifications`} />

        {renderContent()}
      </Root>
    </Content>
  );
};

export default Notifications;
