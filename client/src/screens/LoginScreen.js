import React from 'react';
import {ScrollView} from 'react-native';
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

const LoginScreen = props => {
  console.log(props);
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
            <Button full iconLeft primary style={{margin: 15}}>
              <Icon name="logo-google" />
              <Text> Login with Google </Text>
            </Button>
          </Col>
        </Row>
        <Row size={3}>
          <Col>
            <Form>
              <Item floatingLabel error>
                <Label>Email</Label>
                <Input />
                <Icon name="close-circle" />
              </Item>
              <Text style={{color: 'red', marginLeft: 15}}>Requred</Text>

              <Item floatingLabel error last>
                <Label>Password</Label>
                <Input secureTextEntry={true} />
                <Icon name="close-circle" />
              </Item>
              <Text style={{color: 'red', marginLeft: 15}}>Requred</Text>

              <Button full primary style={{margin: 15, marginTop: 50}}>
                <Text> Login </Text>
              </Button>
              {/* <Button full light primary>
            <Text>Register</Text>
          </Button> */}
            </Form>
          </Col>
        </Row>
        <Row size={3} />
      </Grid>
    </Container>
  );
};

export default LoginScreen;
