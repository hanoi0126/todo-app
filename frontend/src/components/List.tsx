import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import ListItem from "./ListItem";
import { Task } from "../schema";

type Props = {
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading: boolean;
};

const List: React.FC<Props> = ({ tasks, setTasks, loading }) => {
  return (
    <Stack width="100%">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tasks.length ? (
            tasks.map((task: Task) => (
              <ListItem
                key={task.id}
                task={task}
                tasks={tasks}
                setTasks={setTasks}
              />
            ))
          ) : (
            <Typography variant="h5" textAlign="center">タスクがありません</Typography>
          )}
        </>
      )}
    </Stack>
  );
};

export default List;
