import React, { ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Checkbox,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from "../schema";
import APIHelper from "../lib/APIHelper";

type Props = {
  task: Task;
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const ListItem: React.FC<Props> = ({ task, tasks, setTasks }) => {
  const updateTask = async (task: Task) => {
    const data = {
      title: task.title,
      done: task.done,
    };
    let res: AxiosResponse;
    try {
      res = await APIHelper.updateTask(task.id, data);
    } catch (err) {
      console.error(err);
      alert("Some error occurred");
      return;
    }
    const idx = tasks.findIndex((t) => t.id === task.id);
    tasks[idx] = res.data; // Direct mutation avoided
    setTasks([...tasks]); // Set new array for re-render
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
    } catch (err) {
      console.error(err);
      alert("Some error occurred");
      return;
    }
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
  };

  const toggleDone = async (checked: boolean) => {
    const newTask: Task = { ...task, done: checked };
    await updateTask(newTask);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        borderBottom: 1,
        borderColor: 'divider',
        paddingBottom: 1,
        width: '100%',
      }}
    >
      <Checkbox
        checked={task.done}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          toggleDone(event.target.checked)
        }
      />
      <TextField
        defaultValue={task.title}
        variant="standard"
        fullWidth
        onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
          updateTask({ ...task, title: event.target.value })
        }
        InputProps={{
          endAdornment: (
            <IconButton>
              <EditIcon />
            </IconButton>
          ),
        }}
      />
      <IconButton
        aria-label="Delete task"
        onClick={() => deleteTask(task.id)}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default ListItem;
