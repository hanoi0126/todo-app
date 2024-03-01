import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Box, Container, Typography, Stack } from "@mui/material";
import "./App.css";
import List from "./components/List";
import InputForm from "./components/InputForm";
import { Task } from "./schema";
import APIHelper from "./lib/APIHelper";

function App() {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasks = async () => {
    setLoading(true);
    let res: AxiosResponse;
    try {
      res = await APIHelper.getAllTasks();
    } catch (err) {
      console.error(err);
      alert("Some error occurred");
      return;
    } finally {
      setLoading(false);
    }
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box className="App">
      <Container>
        <Stack spacing={2} py={4}>
          <Typography variant="h2" component="h1">
            My Todo List
          </Typography>
          <InputForm tasks={tasks} setTasks={setTasks} />
          <List tasks={tasks} setTasks={setTasks} loading={loading} />
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
