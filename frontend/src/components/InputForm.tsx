import React from "react";
import axios, { AxiosResponse } from "axios";
import { Button, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Task, UpdateTaskData } from "../schema";

type Props = {
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const InputForm: React.FC<Props> = ({ tasks, setTasks }) => {
  const addTask = async (data: UpdateTaskData) => {
    const res: AxiosResponse | null = await axios
      .post("http://localhost:8000/tasks", data)
      .catch(() => {
        alert("Some error occurred");
        return null;
      });
    if (!res) {
      return;
    }
    const newTasks = [...tasks, res.data];
    setTasks(newTasks);
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
    };
    await addTask({ title: target.title.value });
    target.title.value = "";
  };

  return (
    <Box component="form" onSubmit={onSubmitHandler} sx={{ width: "100%" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <TextField
          fullWidth
          name="title"
          label="Enter your task title"
          variant="outlined"
        />
        <Button type="submit" sx={{ p: '10px', minWidth: '45px' }}>
          <AddIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default InputForm;
