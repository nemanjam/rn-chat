import React from 'react';
import { StyleSheet } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Form,
  Item,
  Label,
  Input,
  Grid,
  Row,
  Col,
} from 'native-base';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email.')
    .required('Required'),
  password: Yup.string()
    .min(5, 'Too Short.')
    .max(15, 'Too Long.')
    .required('Required.'),
});

const LoginScreen = props => {
  function formSubmit(values) {
    console.log(values);
  }

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Login</Title>
        </Body>
        <Right />
      </Header>
      <Grid>
        <Row size={1} />
        <Row size={2}>
          <Col>
            <Button full iconLeft primary style={{ margin: 15 }}>
              <Icon name="logo-google" />
              <Text> Login with Google </Text>
            </Button>
          </Col>
        </Row>
        <Row size={3}>
          <Col>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                repeatPassword: '',
              }}
              validationSchema={loginSchema}
              onSubmit={values => formSubmit(values)}>
              {({
                errors,
                touched,
                handleChange,
                handleBlur,
                values,
                handleSubmit,
              }) => (
                <Form>
                  <Item
                    floatingLabel
                    error={errors.email && touched.email}
                    success={touched.email && !(errors.email && touched.email)}>
                    <Label>Email</Label>
                    <Input
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                    <Icon
                      name={
                        touched.email
                          ? errors.email && touched.email
                            ? 'close-circle'
                            : 'checkmark-circle'
                          : null
                      }
                    />
                  </Item>
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                  <Item
                    floatingLabel
                    error={errors.password && touched.password}
                    success={
                      touched.password && !(errors.password && touched.password)
                    }>
                    <Label>Password</Label>
                    <Input
                      secureTextEntry={true}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <Icon
                      name={
                        touched.password
                          ? errors.password && touched.password
                            ? 'close-circle'
                            : 'checkmark-circle'
                          : null
                      }
                    />
                  </Item>
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <Button
                    full
                    primary
                    style={{ margin: 15, marginTop: 50 }}
                    onPress={() => handleSubmit()}>
                    <Text> Login </Text>
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row size={3} />
      </Grid>
    </Container>
  );
};
const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginLeft: 15,
  },
});
export default LoginScreen;
