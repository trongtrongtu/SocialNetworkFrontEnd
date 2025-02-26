import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';

import { A } from 'components/Text';
import { Spacing } from 'components/Layout';
import { Error } from 'components/Text';
import { InputText, Button } from 'components/Form';

import { SIGN_IN } from 'graphql/user';

import * as Routes from 'routes';
import { login } from '../../networking/Server'


const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  font-size: ${(p) => p.theme.font.size.xxs};
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const InputContainer = styled(Spacing)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 1px;
`;

const ForgotPassword = styled.div`
  font-size: ${(p) => p.theme.font.size.xxs};
  margin-top: ${(p) => p.theme.spacing.xxs};
  color: ${(p) => p.theme.colors.white};
`;

/**
 * Sign In page
 */
const SignIn = ({ history, location, refetch, onChange }) => {
  const [values, setValues] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const [signin, { loading }] = useMutation(SIGN_IN);
  useEffect(() => {
    setError('');
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('All fields are required');
      return;
    } else {
      login(emailOrUsername, password).then((data) => {
        if (data.result === 'ok') {
          localStorage.setItem('id', data && data.data && data.data._id);
          onChange();
          history.push(Routes.HOME);
        } else if (data.result === 'failed_login') {
          setError('Login failed');
        }
      }).catch((error) => {
        console.error(error);
      });
    }
    // if (!emailOrUsername || !password) {
    //   setError('All fields are required');
    //   return;
    // }

    // setError('');
    // try {
    //   const response = await signin({
    //     variables: { input: { emailOrUsername, password } },
    //   });
    //   localStorage.setItem('token', response.data.signin.token);
    //   await refetch();
    //   history.push(Routes.HOME);
    // } catch (error) {
    //   setError(error.graphQLErrors[0].message);
    // }
  };

  const { emailOrUsername, password } = values;

  return (
    <form onSubmit={handleSubmit}>
      <Root>
        <InputContainer>
          {error && (
            <ErrorMessage>
              <Error size="xxs" color="white">
                {error}
              </Error>
            </ErrorMessage>
          )}

          <InputText
            autoFocus
            type="text"
            name="emailOrUsername"
            values={emailOrUsername}
            onChange={handleChange}
            placeholder="Username"
            borderColor="white"
          />
        </InputContainer>

        <InputContainer left="xs" right="xs">
          <InputText
            type="password"
            name="password"
            values={password}
            onChange={handleChange}
            placeholder="Password"
            borderColor="white"
          />
          <A to={Routes.FORGOT_PASSWORD}>
            <ForgotPassword>Forgot password?</ForgotPassword>
          </A>
        </InputContainer>

        <Button disabled={loading}>Log in</Button>
      </Root>
    </form>
  );
};

SignIn.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignIn);
