import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';

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
  Spinner,
} from 'native-base';

import { setCurrentUser } from '../store/actions/auth';

import { LOGIN_MUTATION } from '../graphql/mutations';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email.')
    .required('Required.'),
  password: Yup.string()
    .min(5, 'Too Short.')
    .max(15, 'Too Long.')
    .required('Required.'),
});

const LoginScreen = props => {
  const [login, { ...mutationResult }] = useMutation(LOGIN_MUTATION);

  async function formSubmit(values) {
    const { data } = await login({
      variables: {
        email: values.email,
        password: values.password,
      },
    });
    const user = data.login;
    props.setCurrentUser(user);
    props.navigation.navigate('Home');
  }

  if (mutationResult.loading) return <Spinner />;
  if (mutationResult.error)
    return <Text>{JSON.stringify(mutationResult.error, null, 2)}</Text>;

  return (
    <Container>
      <Content>
        <Image
          source={require('../assets/drawerBackground.jpg')}
          style={{
            height: 150,
            width: '100%',
            alignSelf: 'stretch',
            position: 'absolute',
          }}
        />
        <Text style={styles.avatar}>{'<RN>'}</Text>
        <Text style={styles.subtitle}>React Native Chat</Text>
        <Grid style={styles.grid}>
          {/* <Row size={1}>
            <Col>
              <Button
                full
                iconLeft
                primary
                style={{ margin: 15, marginBottom: 0 }}>
                <Icon name="logo-google" />
                <Text> Login with Google </Text>
              </Button>
            </Col>
          </Row> */}
          <Row>
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
                      style={styles.item}
                      floatingLabel
                      error={errors.email && touched.email}
                      success={
                        touched.email && !(errors.email && touched.email)
                      }>
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
                      style={styles.item}
                      floatingLabel
                      error={errors.password && touched.password}
                      success={
                        touched.password &&
                        !(errors.password && touched.password)
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
          <Row>
            <Col>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Register')}>
                <Text style={styles.link}> Register</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginLeft: 15,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
  },
  grid: {
    marginTop: 150,
    paddingBottom: 20,
  },
  avatar: {
    position: 'absolute',
    alignSelf: 'center',
    top: 20,
    fontSize: 60,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'San Francisco',
    letterSpacing: 5,
  },
  subtitle: {
    position: 'absolute',
    alignSelf: 'center',
    top: 105,
    fontSize: 14,
    fontWeight: '100',
    color: 'white',
  },
  item: {
    marginRight: 15,
  },
});

export default connect(
  state => ({
    auth: state.authReducer,
  }),
  { setCurrentUser },
)(LoginScreen);
