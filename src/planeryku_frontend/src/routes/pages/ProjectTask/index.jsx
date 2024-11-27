import React, { act, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Modal,
  Popper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import ProjectIcon from '../../../components/icon/project';
import HorizontalMenuIcon from '../../../components/icon/horizontal-menu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useTask from './useTask';

export default function ProjectTask() {
  const [categories, setCategories] = useState([
    'open',
    'inProgress',
    'readyToTest',
    'readyToDeploy',

  ]);
  
  const {isLoading, tasks, setTasks, getCategoryName, updateStatusTask} = useTask();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [taskName, setTaskName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Drag and Drop Logic (unchanged)
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {return;}

    if (
      source.droppableId === destination.droppableId &&
			source.index === destination.index
    ) {
      return;
    }

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    const draggedTask = tasks.find(
      (task) =>
        task.category === sourceCategory &&
				task.order === source.index + 1,
    );

    if (draggedTask) {
      let updatedTasks = tasks.map((task) => {
        if (
          task.category === sourceCategory &&
					task.order > source.index + 1
        ) {
          return { ...task, order: task.order - 1 };
        }

        if (
          task.category === destinationCategory &&
					task.order >= destination.index + 1
        ) {
          return { ...task, order: task.order + 1 };
        }

        return task;
      });

      draggedTask.category = destinationCategory;
      draggedTask.order = destination.index + 1;

      updatedTasks = [
        ...updatedTasks.filter((task) => task.id !== draggedTask.id),
        draggedTask,
      ];

      updatedTasks.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.order - b.order,
      );

      setTasks(updatedTasks);
      updateStatusTask(draggedTask.id, destinationCategory);
    }
  };

  const handleOpenTaskModal = (activeCategory) => {
    setActiveCategory(activeCategory);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = () => {
    if (!taskName.trim()) {return;}

    const newTask = {
      id: tasks.length + 1,
      category: activeCategory,
      name: taskName,
      order:
				tasks.filter((task) => task.category === activeCategory)
				  .length + 1,
    };

    setTasks([...tasks, newTask]);
    setTaskName('');
    setIsTaskModalOpen(false);
  };

  // New Logic for Adding Categories
  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim() || categories.includes(newCategoryName))
    {return;}

    setCategories([...categories, newCategoryName]);
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
  };

  const handleChangeCategory = (value) => {
    setActiveCategory(value);
  };

  const handlePopper = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div className="flex gap-5 items-center p-8">
        <ProjectIcon />
        <div className="flex flex-col gap-2 ml-auto w-full">
          <span>Project Name</span>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 15,
            }}
          >
            <Box sx={{ width: '60%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                style={{ height: 7, borderRadius: 10 }}
                value={75}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
								75% Completed
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
      <div className="bg-stone-50 p-8 min-h-[calc(100vh-70px)] max-w-[calc(100vw-15rem)] overflow-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5">
            {categories.map((category) => (
              <Droppable droppableId={category} key={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-3"
                  >
                    <div className="p-5 max-w-[300px] min-w-[300px] border border-slate-200 rounded-xl bg-white">
                      <div className="flex gap-3 items-center">
                        <h1 className="font-semibold">
                          {getCategoryName(category)}
                        </h1>
                        <Chip
                          label={
                            tasks.filter(
                              (task) =>
                                task.category ===
																category,
                            ).length
                          }
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 8,
                          }}
                        />
                        <div className="ml-auto">
                          <IconButton>
                            <HorizontalMenuIcon />
                          </IconButton>
                        </div>
                      </div>
                      <div className="flex flex-col mt-3">
                        {tasks
                          .filter(
                            (task) =>
                              task.category ===
															category,
                          )
                          .sort(
                            (a, b) =>
                              a.order - b.order,
                          )
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={`${task.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={
                                    provided.innerRef
                                  }
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-4 border rounded-lg my-1"
                                >
                                  <span>
                                    {
                                    
                                      task.name
                                    }
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                      <div className="bg-white">
                        {provided.placeholder}
                      </div>
                      <div className="pt-1">
                        <Button
                          variant="text"
                          size="small"
                          style={{
                            textTransform: 'none',
                            borderRadius: 6,
                            padding: 8,
                            width: '100%',
                          }}
                          onClick={() =>
                            handleOpenTaskModal(
                              category,
                            )
                          }
                        >
													+ Add a card
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}

            <div className="flex flex-col gap-3 pr-8">
              <div className="flex flex-col gap-3 max-w-[300px] min-w-[300px] border border-slate-200 rounded-xl bg-white">
                <Button
                  variant="text"
                  size="medium"
                  style={{
                    textTransform: 'none',
                    borderRadius: 6,
                    padding: 8,
                    width: '100%',
                  }}
                  onClick={handleOpenCategoryModal}
                >
									+ Add new category
                </Button>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* Task Modal */}
      <Modal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-lg p-5 rounded-xl">
          <div className="flex justify-between">
            <h1 className="font-semibold">Add new task</h1>
          </div>
          <div className="mt-5">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Task Name</span>
              <FormControl hiddenLabel={true}>
                <TextField
                  size="small"
                  placeholder="Enter task name"
                  value={taskName}
                  onChange={(event) =>
                    setTaskName(event.target.value)
                  }
                />
              </FormControl>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-sm">Category</span>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={activeCategory}
                  onChange={(event) =>
                    handleChangeCategory(event.target.value)
                  }
                >
                  {categories.map((category, index) => {
                    return (
                      <MenuItem value={category} key={index}>
                        {category}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Members</span>
                <Button
                  variant="text"
                  size="small"
                  style={{
                    textTransform: 'none',
                    borderRadius: 6,
                  }}
                  onClick={handlePopper}
                >
									Edit member
                </Button>
                <Popper
                  id={open ? 'simple-popper' : undefined}
                  open={open}
                  anchorEl={anchorEl}
                  className="z-[9999]"
                >
                  <ClickAwayListener
                    onClickAway={handleClickAway}
                  >
                    <div className="bg-white py-1 rounded-md shadow-lg max-h-[300px] overflow-auto">
                      <div className="flex flex-col">
                        <div className="py-1 px-3 hover:bg-stone-200 cursor-pointer">
                          <span className="text-xs font-semibold">
														Andrey
                          </span>
                        </div>
                        <div className="py-1 px-3 hover:bg-stone-200 cursor-pointer">
                          <span className="text-xs font-semibold">
														Michael
                          </span>
                        </div>
                        <div className="py-1 px-3 hover:bg-stone-200 cursor-pointer">
                          <span className="text-xs font-semibold">
														Kevin
                          </span>
                        </div>
                      </div>
                    </div>
                  </ClickAwayListener>
                </Popper>
              </div>
              <div className="flex">
                <div className="flex flex-col p-2 bg-stone-100 w-full rounded-lg">
                  <span className="text-xs font-semibold">
										Michael Al Furqon
                  </span>
                </div>
              </div>
            </div>
            <div className="flex mt-5 justify-end">
              <Button
                variant="contained"
                size="medium"
                style={{
                  textTransform: 'none',
                  borderRadius: 6,
                }}
                onClick={handleAddTask}
              >
								Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-lg p-5 rounded-xl">
          <div className="flex justify-between">
            <h1 className="font-semibold">Create new category</h1>
          </div>
          <div className="mt-5">
            <div className="flex flex-col gap-2">
              <FormControl hiddenLabel={true}>
                <TextField
                  placeholder="Enter category name"
                  variant="standard"
                  value={newCategoryName}
                  onChange={(event) =>
                    setNewCategoryName(event.target.value)
                  }
                />
              </FormControl>
            </div>
            <div className="flex mt-5 justify-end">
              <Button
                variant="contained"
                size="medium"
                style={{
                  textTransform: 'none',
                  borderRadius: 6,
                }}
                onClick={handleAddCategory}
              >
								Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
