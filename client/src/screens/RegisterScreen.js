import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
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

const RegisterScreen = props => {
  const [hasError, setHasError] = useState(false);

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
        <Form style={styles.form}>
          <Item floatingLabel error>
            <Label>Name</Label>
            <Input />
            <Icon name="close-circle" />
          </Item>
          {hasError && <Text style={styles.errorText}>Requred</Text>}
          <Item floatingLabel error>
            <Label>Email</Label>
            <Input />
            <Icon name="close-circle" />
          </Item>
          {hasError && <Text style={styles.errorText}>Requred</Text>}
          <Item floatingLabel error>
            <Label>Password</Label>
            <Input secureTextEntry={true} />
            <Icon name="close-circle" />
          </Item>
          {hasError && <Text style={styles.errorText}>Requred</Text>}

          <Item floatingLabel error last>
            <Label>Repeat Password</Label>
            <Input secureTextEntry={true} />
            <Icon name="close-circle" />
          </Item>
          {hasError && <Text style={styles.errorText}>Requred</Text>}

          <Button full primary style={styles.registerButton}>
            <Text> Register </Text>
          </Button>
        </Form>
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
