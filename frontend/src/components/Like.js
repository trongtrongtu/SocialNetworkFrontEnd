import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';

import { LikeIcon } from 'components/icons';
import { Spacing } from './Layout';
import { Button } from './Form';

import { GET_FOLLOWED_POSTS, GET_POSTS } from 'graphql/post';
import { GET_AUTH_USER } from 'graphql/user';
import { CREATE_LIKE, DELETE_LIKE } from 'graphql/like';

import { NotificationType } from 'constants/NotificationType';

import { useNotifications } from 'hooks/useNotifications';

import { useStore } from 'store';
import { addLike } from '../networking/Server'


const StyledButton = styled(Button)`
  padding: ${(p) => p.theme.spacing.xs} 0;
`;

/**
 * Component for rendering Like button
 */
const Like = ({ postId, user, likes, withText, fullWidth, onChangeLikeCount, isLike }) => {
  const [loading, setLoading] = useState(false);
  const [dataArr, setDataArr] = useState(false);
  const [{ auth }] = useStore();
  const notification = useNotifications();
  // Detect which mutation to use
  const hasLiked = likes.find((l) => l.user === auth.user._id && l.post === postId);
  const operation = hasLiked ? 'delete' : 'create';
  const options = {
    create: {
      mutation: CREATE_LIKE,
      variables: { postId, userId: auth.user._id },
    },
    delete: {
      mutation: DELETE_LIKE,
      variables: { id: hasLiked ? hasLiked.id : null },
    },
  };
  const [mutate] = useMutation(options[operation].mutation, {
    refetchQueries: [
      { query: GET_AUTH_USER },
      { query: GET_POSTS, variables: { authUserId: auth.user._id } },
      { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user._id } },
    ],
  });

  const handleButtonClick = async () => {
    setLoading(true);
    const { data } = await mutate({
      variables: { input: { ...options[operation].variables } },
    });

    // Create or delete notification for like
    if (auth.user._id === user.id) return setLoading(false);
    await notification.toggle({
      user,
      postId,
      hasDone: hasLiked,
      notificationType: NotificationType.LIKE,
      notificationTypeId: data.createLike ? data.createLike.id : null,
    });
    setLoading(false);
  };


  return (
    <StyledButton
      fullWidth={fullWidth && fullWidth}
      disabled={loading}
      text
      onClick={() =>
        addLike({ user: user._id, post: postId }).then((data) => {
          onChangeLikeCount();
          setDataArr(!dataArr)
        }).catch((error) => {
          console.error(error);
        })
      }
      color={dataArr && 'primary.main'}
    >
      <LikeIcon color={(dataArr || isLike) && 'primary.main'} />
      <Spacing inline left="xxs" />
      { withText && <b>Like</b>}
    </StyledButton >
  );
};

Like.propTypes = {
  postId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  likes: PropTypes.array,
  withText: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default Like;
