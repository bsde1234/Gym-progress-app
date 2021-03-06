/* eslint-disable no-shadow */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Redirect,Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import AuthTemplete from 'templates/AuthTemplete';
import { Input } from 'components/atoms/Input/Input';
import Button from 'components/atoms/Button/Button';
import Heading from 'components/atoms/Heading/Heading';
import { connect } from 'react-redux';
import { signIn } from 'actions';
import {routes} from 'routes';
import * as Yup from 'yup';

const StyledParagraph = styled.p`
color:white;
padding-top:10px;
`
const StyledLink = styled(Link)`
  color:white;
  text-decoration:none;
  font-weight:${({theme})=>theme.bold};
`
const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
`;
const StyledErrors = styled.span`
  color: ${({theme})=>theme.secondary};
  margin-bottom:10px;
  
`;
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .required('Password is required'),
});
const LoginPage = ({ signIn, authenticated,errorReducer }) => {
  return (
    <AuthTemplete>
      <Heading as="h3" big>
        Sign In
      </Heading>
      {errorReducer.error ? <StyledErrors>Something went wrong, Try again</StyledErrors> : null}
      <Formik
        validationSchema={SignInSchema}
        initialValues={{ email: '', password: '' }}
        onSubmit={values => {
          signIn(values.email, values.password);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          /* and other goodies */
        }) => {
          if (authenticated) {
            return <Redirect to={routes.workout}/>
          }
          return (
            <StyledForm onSubmit={handleSubmit}>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="E-mail address"
                autocomplete="email"
                required
              />
              <StyledErrors>{errors.email && touched.email && errors.email}</StyledErrors>
              <Input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Password"
                autocomplete="password"
                required
              />
              <StyledErrors>{errors.password && touched.password && errors.password}</StyledErrors>
              <Button type="submit">Submit</Button>
              <StyledParagraph>Not registered yet? <StyledLink to={routes.register}> Click here<span role="img" aria-label="highfive">🖐</span></StyledLink></StyledParagraph>
            </StyledForm>
          );
        }}
      </Formik>
    </AuthTemplete>
  );
};
LoginPage.propTypes = {
  signIn: PropTypes.func.isRequired,
  authenticated:PropTypes.bool,
};
LoginPage.defaultProps ={
    authenticated:false,
}
const mapStateToProps = ({ authReducer,errorReducer }) => {
  const {authenticated} = authReducer
  return { authenticated,errorReducer };
};

const mapDispatchToProps = dispatch => ({
  signIn: (email, password) => dispatch(signIn(email, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPage);
