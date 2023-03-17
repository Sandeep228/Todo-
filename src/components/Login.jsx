import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
} from "@chakra-ui/react";
import { gql } from "@apollo/client";
import { client } from "../config/ApolloConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setpassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .query({
        query: gql`
          query MyQuery($name: String!, $password: String!) {
            users_aggregate(
              where: { email: { _eq: $name }, password: { _eq: $password } }
            ) {
              nodes {
                id
              }
            }
          }
        `,
        variables: { name: name, password: password },
      })
      .then((res) => {
        console.log(res);
        if (res.data.users_aggregate.nodes.length === 1) {
          console.log(res.data.users_aggregate.nodes[0].id);
          localStorage.setItem("userID", res.data.users_aggregate.nodes[0].id);
          navigate("/dashboard");
        } else {
          console.log("no user found");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" onChange={(e) => setName(e.target.value)} />
          <FormLabel>Password</FormLabel>
          <Input type="text" onChange={(e) => setpassword(e.target.value)} />
          <Button mt={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default Login;
