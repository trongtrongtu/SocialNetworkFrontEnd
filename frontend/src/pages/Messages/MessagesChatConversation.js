import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import { Button, Textarea } from 'components/Form';
import { SendIcon } from 'components/icons';
import Avatar from 'components/Avatar';
import { Spacing } from 'components/Layout';

import { CREATE_MESSAGE } from 'graphql/messages';
import { GET_CONVERSATIONS } from 'graphql/user';

import { currentDate } from 'utils/date';

import * as Routes from 'routes';
import io from 'socket.io-client';
import { getMessage } from '../../networking/Server'


const socket = io('localhost:3001');

const Root = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
  overflow-y: auto;
  height: 100vh;
  margin-top: -120px;
  padding-top: 120px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.colors.grey[500]};
    border-radius: ${(p) => p.theme.radius.lg};
    visibility: hidden;

    &:hover {
      background-color: ${(p) => p.theme.colors.grey[600]};
    }
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      visibility: visible;
    }
  }
`;

const Conversation = styled.div`
  flex: 1;
`;

const MessageDate = styled.span`
  position: absolute;
  bottom: -${(p) => p.theme.spacing.sm};
  left: ${(p) => !p.userMessage && p.theme.spacing.lg};
  right: -${(p) => p.userMessage && 0};
  display: none;
  font-size: ${(p) => p.theme.font.size.tiny};
  color: ${(p) => p.theme.colors.text.secondary};
`;

const MessageWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: ${(p) => p.userMessage && 'flex-end'};
  margin: ${(p) => p.theme.spacing.md} 0;

  &:hover ${MessageDate} {
    display: block;
  }
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  max-width: 300px;
  line-height: 21px;
  font-size: ${(p) => p.theme.font.size.xs};
  padding: ${(p) => p.theme.spacing.xxs} ${(p) => p.theme.spacing.xs};
  border-radius: ${(p) => p.theme.radius.lg};
  color: ${(p) => p.userMessage && p.theme.colors.white};
  background-color: ${(p) => (p.userMessage ? p.theme.colors.primary.light : p.theme.colors.grey[200])};
`;

const Form = styled.form`
  background-color: ${(p) => p.theme.colors.white};
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: ${(p) => p.theme.spacing.xxs};
`;

const StyledTextarea = styled(Textarea)`
  height: 38px;
  border-radius: ${(p) => p.theme.radius.lg};
  background-color: ${(p) => p.theme.colors.grey[200]};
`;

const SendButton = styled(Button)`
  margin-left: ${(p) => p.theme.spacing.sm};
  align-self: center;
`;

/**
 * Component that renders messages conversations UI
 */
let dataArr = []
const MessagesChatConversation = ({ messages, authUser, chatUser, data, match }) => {
  const bottomRef = useRef(null);

  const [messageText, setMessageText] = useState('');

  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [dataArr1, setDataArr] = useState([]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [bottomRef, data]);

  useEffect(() => {
    socket.on("newMessageFriend", dataMes => {
      // console.log('dataArr: ', dataArr)
      dataArr = [...dataArr, dataMes]
      setDataArr(dataMes)
    }); //gửi event về server
  }, []);
  const refreshDataFromServer = () => {
    getMessage().then((data) => {
      if (data && data.length > 0) {
        dataArr = [...data]
        setDataArr(data)
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    refreshDataFromServer();
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    if (!(messageText && messageText.trim())) return;
    socket.emit("newMessageFriend", { data: messageText && messageText.trim(), user: authUser._id, usernamefriend: match.params && match.params.userId, time: new Date().toLocaleString(), image: authUser.image }); //gửi event về server
    setMessageText('');
    // createMessage({
    //   variables: {
    //     input: {
    //       sender: authUser.id,
    //       receiver: chatUser ? chatUser.id : null,
    //       message: messageText,
    //     },
    //   },
    //   refetchQueries: ({ data }) => {
    //     if (data && data.createMessage && data.createMessage.isFirstMessage) {
    //       return [
    //         {
    //           query: GET_CONVERSATIONS,
    //           variables: { authUserId: authUser.id },
    //         },
    //       ];
    //     }
    //   },
    // });
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage(e);
    }
  };
  // console.log('aaaaa: ', { messages, authUser, chatUser, data, match, dataArr })
  return (
    <Root>
      <Conversation>
        {dataArr && dataArr.length > 0 && dataArr.map((message) => {
          if ((match.params && match.params.userId) === message.user || (match.params && match.params.userId) === message.usernamefriend) {
            const isAuthUserReceiver = authUser._id === message.user;
            return (
              <MessageWrapper userMessage={isAuthUserReceiver} key={message.key}>
                {!isAuthUserReceiver && (
                  <Spacing right="xs">
                    <Avatar image={message.image} />
                  </Spacing>
                )}

                <Message userMessage={isAuthUserReceiver}>{message.data}</Message>

                <MessageDate userMessage={isAuthUserReceiver}>{message.time}</MessageDate>
              </MessageWrapper>
            );
          }
        })}
        <div ref={bottomRef} />
      </Conversation>

      {match.params.userId !== Routes.NEW_ID_VALUE && (
        <Form onSubmit={sendMessage}>
          <StyledTextarea
            placeholder="Type a message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={onEnterPress}
          />

          <SendButton type="submit" ghost>
            <SendIcon width="28" />
          </SendButton>
        </Form>
      )}
    </Root>
  );
};

MessagesChatConversation.propTypes = {
  messages: PropTypes.array.isRequired,
  authUser: PropTypes.object.isRequired,
  chatUser: PropTypes.object,
  data: PropTypes.any,
  match: PropTypes.object.isRequired,
};

export default MessagesChatConversation;
