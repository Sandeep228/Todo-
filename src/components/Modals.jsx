import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
} from "@chakra-ui/react";
import { client } from "../config/ApolloConfig";
import { gql } from "@apollo/client";
const Modals = (props) => {
  //   const { isOpen, setIsOpen } = useDisclosure();
  const [item, setitem] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const itemId = props.itemId;
  const setTodos = props.setTodos;
  const itemIndexTodo = props.itemIndex;
  const todoList = props.todo;

  console.log(props.itemId);
  //   const closeState = () => {
  //     setIsOpen(true);
  //   };
  const fetchItemData = () => {
    client
      .query({
        query: gql`
          query MyQuery($itemID: Int!) {
            todos_by_pk(id: $itemID) {
              item
            }
          }
        `,
        variables: { itemID: itemId },
      })
      .then((res) => {
        console.log(res.data.todos_by_pk.item);
        setitem(res.data.todos_by_pk.item);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    onOpen();
    fetchItemData();
  }, []);

  //   const updateState = (todo) => {
  //     setTodos(todo);
  //   };

  const handleUpdateItem = (e) => {
    e.preventDefault();

    client
      .mutate({
        mutation: gql`
          mutation MyMutation($itemID: Int!, $itemName: String!) {
            update_todos_by_pk(
              pk_columns: { id: $itemID }
              _set: { item: $itemName }
            ) {
              item
            }
          }
        `,
        variables: { itemID: itemId, itemName: item },
      })
      .then((res) => {
        setitem(res.data.update_todos_by_pk.item);
        const newTodoList = todoList.map((data, index) => {
          if (index === itemIndexTodo) {
            console.log(data);

            return { ...data, item };
          } else {
            return data;
          }
        });
        setTodos(newTodoList);

        // setTodos((prev) => {
        //   return prev.map((todo, i) =>
        //     i === itemIndexTodo
        //       ? {
        //           ...todo,
        //           item,
        //         }
        //       : todo
        //   );
        // });

        console.log(todoList);
        console.log(res.data.update_todos_by_pk.item);
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Basic usage"
              onChange={(e) => setitem(e.target.value)}
              value={item}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleUpdateItem}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Modals;
