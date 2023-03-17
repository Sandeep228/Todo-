import React, { useState } from "react";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { gql } from "@apollo/client";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { client } from "../config/ApolloConfig";
// const client = new ApolloClient({
//   uri: "http://localhost:8080/v1/graphql",
//   headers: { "x-hasura-admin-secret": "myadminsecretkey" },
//   cache: new InMemoryCache(),
// });

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password);
    // client
    //   .query({
    //     query: gql`
    //       query MyQuery {
    //         users {
    //           id
    //           name
    //           email
    //         }
    //       }
    //     `,
    //   })
    //   .then((result) => console.log(result))
    //   .catch((err) => console.log(err));

    client
      .mutate({
        mutation: gql`
          mutation MyMutation(
            $name: String!
            $email: String!
            $password: String!
          ) {
            insert_users_one(
              object: { email: $email, name: $name, password: $password }
            ) {
              email
            }
          }
        `,
        variables: { name: name, email: email, password: password },
      })
      .then((res) => {
        if (res.data.insert_users_one.email) {
          console.log("signup success");
        } else {
          console.log("signup failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // client
    //   .mutate({
    //     mutation: gql`
    //     mutation MyMutation {
    //       insert_users_one(
    //         object: { name: ${name}, email: ${email}, password: ${password} }
    //       ) {
    //         email
    //       }
    //     }
    //   `,
    //   })
    //   .then((res) => console.log(res))
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" onChange={(e) => setName(e.target.value)} />

          <FormLabel>Email address</FormLabel>
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          <FormLabel>Password</FormLabel>
          <Input type="text" onChange={(e) => setPassword(e.target.value)} />
          <Button mt={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default Signup;
