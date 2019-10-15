import React, { useState } from 'react';
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

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'Too Short.')
    .max(15, 'Too Long.')
    .required('Required.'),
  email: Yup.string()
    .email('Invalid email.')
    .required('Required'),
  password: Yup.string()
    .min(5, 'Too Short.')
    .max(15, 'Too Long.')
    .required('Required.'),
  repeatPassword: Yup.string()
    .when('password', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'Both passwords must be the same',
      ),
    })
    .required('Required'),
});

const RegisterScreen = props => {
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
          <Title>Register</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            repeatPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={values => formSubmit(values)}>
          {({
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            handleSubmit,
          }) => (
            <Form style={styles.form}>
              <Item
                floatingLabel
                error={errors.name && touched.name}
                success={touched.name && !(errors.name && touched.name)}>
                <Label>Name</Label>
                <Input
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <Icon
                  name={
                    touched.name
                      ? errors.name && touched.name
                        ? 'close-circle'
                        : 'checkmark-circle'
                      : null
                  }
                />
              </Item>
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
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
              <Item
                floatingLabel
                error={errors.repeatPassword && touched.repeatPassword}
                success={
                  touched.repeatPassword &&
                  !(errors.repeatPassword && touched.repeatPassword)
                }>
                <Label>Repeat Password</Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={handleChange('repeatPassword')}
                  onBlur={handleBlur('repeatPassword')}
                  value={values.repeatPassword}
                />
                <Icon
                  name={
                    touched.repeatPassword
                      ? errors.repeatPassword && touched.repeatPassword
                        ? 'close-circle'
                        : 'checkmark-circle'
                      : null
                  }
                />
              </Item>
              {errors.repeatPassword && touched.repeatPassword && (
                <Text style={styles.errorText}>{errors.repeatPassword}</Text>
              )}

              <Button
                full
                primary
                style={styles.registerButton}
                onPress={() => handleSubmit()}>
                <Text> Register </Text>
              </Button>
            </Form>
          )}
        </Formik>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginLeft: 15,
  },
  registerButton: {
    margin: 15,
    marginTop: 50,
  },
});
export default RegisterScreen;
