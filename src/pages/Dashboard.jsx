import React, { useEffect, useState } from "react";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { gql } from "@apollo/client";
import { client } from "../config/ApolloConfig";
import Modals from "../components/Modals";
// import styles from "./css/dashboard.css";
import "./css/dashboard.css";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [item, setItem] = useState("");
  const [itemIndex, setItemIndex] = useState();
  const [showModal, setShowModal] = useState(false);
  const user_id = localStorage.getItem("userID");
  const [itemID, setItemID] = useState();

  const fetchUserItemData = () => {
    client
      .query({
        query: gql`
          query MyQuery($userID: Int) {
            todos_aggregate(where: { user_id: { _eq: $userID } }) {
              nodes {
                id
                item
              }
            }
          }
        `,
        variables: { userID: user_id },
      })
      .then((res) => {
        // console.log(res);
        // console.log(res.data.todos_aggregate.nodes);
        setTodos(res.data.todos_aggregate.nodes);
      })
      .catch((err) => {
        console.log(err);
      });
    // client
    //   .subscribe({
    //     subscription: gql`
    //       subscription MySubscription($userID: String!) {
    //         todos(where: { user_id: { _eq: $userID } }) {
    //           id
    //           item
    //         }
    //       }
    //     `,
    //     variables: { userID: user_id },
    //   })
    //   .then((res) => {
    //     // console.log(res);
    //     // console.log(res.data.todos_aggregate.nodes);
    //     setTodos(res.data.todos_aggregate.nodes);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  useEffect(() => {
    fetchUserItemData();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    client
      .mutate({
        mutation: gql`
          mutation MyMutation($item: String, $userID: Int) {
            insert_todos_one(object: { item: $item, user_id: $userID }) {
              id
              item
            }
          }
        `,
        variables: { item: item, userID: user_id },
      })
      .then((res) => {
        setTodos([...todos, res.data.insert_todos_one]);
        console.log(res.data.insert_todos_one);
        setItem("");

        console.log("updated toto", todos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteItem = (indexx, itemID) => {
    console.log(itemID, indexx);
    client
      .mutate({
        mutation: gql`
          mutation MyMutation($itemId: Int!) {
            delete_todos_by_pk(id: $itemId) {
              id
            }
          }
        `,
        variables: { itemId: itemID },
      })
      .then((res) => {
        console.log(res.data.delete_todos_by_pk);
        setTodos(todos.filter((data, index) => index !== indexx));
      })
      .catch((err) => console.log(err));
  };

  const toggleModal = (id, index) => {
    setItemID(id);
    setItemIndex(index);
    setShowModal(!showModal);
  };

  return (
    <div>
      <FormControl>
        <FormLabel>TODO</FormLabel>
        <div className="formStyle">
          <Input
            type="text"
            onChange={(e) => setItem(e.target.value)}
            value={item}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </FormControl>

      {todos.map((data, index) => {
        // console.log(index);
        return (
          <div className="mainDiv">
            <p key={index}>{data.item}</p>
            <Button onClick={() => deleteItem(index, data.id)} className="btn">
              Del
            </Button>
            <Button onClick={() => toggleModal(data.id, index)} className="btn">
              Edit
            </Button>
          </div>
        );
      })}
      {showModal ? (
        <Modals
          itemId={itemID}
          setTodos={setTodos}
          itemIndex={itemIndex}
          todo={todos}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
