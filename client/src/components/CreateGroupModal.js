import React, { useState } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  Content,
  Left,
  Body,
  Right,
  Text,
  Button,
  Card,
  CardItem,
  Form,
  Item,
  Label,
  Input,
  Icon,
} from 'native-base';

const createSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'Too Short!')
    .max(15, 'Too Long!')
    .required('Required'),
  avatarUrl: Yup.string()
    .url('Invalid url')
    .required('Required'),
  description: Yup.string()
    .min(10, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
});

const CreateGroupModal = ({ modal, toggleModal, createGroup }) => {
  async function formSubmit(values) {
    console.log(values);
    await createGroup({
      variables: {
        group: {
          ownerId: 1,
          name: values.name,
          avatarUrl: values.avatarUrl,
          description: values.description,
        },
      },
    });
    toggleModal();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modal}
      onRequestClose={() => {
        alert('Modal has been closed.');
      }}>
      <Content contentContainerStyle={styles.content}>
        <Formik
          initialValues={{ name: '', avatarUrl: '', description: '' }}
          validationSchema={createSchema}
          onSubmit={values => formSubmit(values)}>
          {({
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            handleSubmit,
          }) => (
            <Card>
              <CardItem bordered>
                <Body>
                  <Form style={styles.form}>
                    <Item
                      error={errors.name && touched.name}
                      success={touched.name && !(errors.name && touched.name)}
                      style={styles.input}>
                      <Input
                        placeholder="Group Name"
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
                    <Item
                      error={errors.avatarUrl && touched.avatarUrl}
                      success={
                        touched.avatarUrl &&
                        !(errors.avatarUrl && touched.avatarUrl)
                      }
                      style={styles.input}>
                      <Input
                        placeholder="Avatar url"
                        onChangeText={handleChange('avatarUrl')}
                        onBlur={handleBlur('avatarUrl')}
                        value={values.avatarUrl}
                      />
                      <Icon
                        name={
                          touched.avatarUrl
                            ? errors.avatarUrl && touched.avatarUrl
                              ? 'close-circle'
                              : 'checkmark-circle'
                            : null
                        }
                      />
                    </Item>
                    <Item
                      error={errors.description && touched.description}
                      success={
                        touched.description &&
                        !(errors.description && touched.description)
                      }
                      style={styles.input}
                      last>
                      <Input
                        multiline
                        numberOfLines={3}
                        placeholder="Description"
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        value={values.namdescriptione}
                      />
                      <Icon
                        name={
                          touched.description
                            ? errors.description && touched.description
                              ? 'close-circle'
                              : 'checkmark-circle'
                            : null
                        }
                      />
                    </Item>
                  </Form>
                </Body>
              </CardItem>
              <CardItem footer bordered>
                <Left>
                  <Button bordered small onPress={() => toggleModal()}>
                    <Text>Cancel</Text>
                  </Button>
                </Left>
                <Right>
                  <Button small onPress={() => handleSubmit()}>
                    <Text>Submit</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          )}
        </Formik>
      </Content>
    </Modal>
  );
};
const styles = StyleSheet.create({
  form: {
    alignSelf: 'stretch',
  },
  input: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
export default CreateGroupModal;
