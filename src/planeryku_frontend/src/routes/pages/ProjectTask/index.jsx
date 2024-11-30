import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
  Popper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ProjectIcon from "../../../components/icon/project";
import HorizontalMenuIcon from "../../../components/icon/horizontal-menu";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useTask from "./useTask";

export default function ProjectTask() {

  const { tasks, setTasks, getCategoryName ,updateStatusTask, addTask,editTask, detailProject, setCategories, categories } = useTask();
  const [modalState, setModalState] = useState({
    category: {
      state: "add",
      open: false,
    },
    task: {
      state: "add",
      open: false,
    },
  });
  const [members, setMembers] = useState([
    { id: 1, name: "Michael Al Furqon", isChecked: false },
    { id: 2, name: "John Doe", isChecked: false },
    { id: 3, name: "Jane Smith", isChecked: false },
  ]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [memberPopper, setMemberPopper] = useState(null);
  const [categoryPopper, setCategoryPopper] = useState(null);
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

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
        task.category === sourceCategory&&
				task.order === source.index + 1,
    );

    if (draggedTask) {
      let updatedTasks = tasks.map((task) => {
        if (
          task.category === sourceCategory&&
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

      draggedTask.category= destinationCategory;
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

  const handleOpenTaskModal = (activeCategory, state, task = null) => {
    if(state == 'edit') {setActiveTask(task);}
		
    setTaskName(state == "edit" ? task.name : "");
    setActiveCategory(activeCategory);
    setModalState({
      ...modalState,
      task: {
        state,
        open: true,
      },
    });
  };

  const handleSaveTask = () => {
    if (!taskName.trim()) {
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      category: activeCategory,
      name: taskName,
      order:
				tasks.filter((task) => task.category === activeCategory)
				  .length + 1,
    };
    const editData = {
      name: taskName,
      description: "",
      category: activeCategory,
    };

    let resultTask = [...tasks];
    if (modalState.task.state == "add") {
      resultTask.push(newTask);
      addTask(newTask);
    } else {
      resultTask = tasks.map((task) => {
        
        if(task.id === activeTask.id) {
          return {...task, ...editData};
        }
        return task;
      },
      
      );
      const dataToEdit = resultTask.find((task) => task.id === activeTask.id);
      editTask(dataToEdit);
    }
		
    setTasks(resultTask);
    setTaskName("");
    setModalState({
      ...modalState,
      task: {
        ...modalState.task,
        open: false,
      },
    });
  };

  const handleOpenCategoryModal = () => {
    setActiveCategory("");
    setModalState({
      ...modalState,
      category: {
        state: "add",
        open: true,
      },
    });
  };

  const handleSaveCategory = () => {
    if (!newCategoryName.trim() || categories.includes(newCategoryName)) {
      return;
    }

    let resultCategory = null;
    if (modalState.category.state === "add") {
      resultCategory = [...categories, newCategoryName];
    } else {
      resultCategory = categories.map((category) =>
        category === activeCategory ? newCategoryName : category,
      );
    }

    setCategories(resultCategory);
    setNewCategoryName("");
    setModalState({
      ...modalState,
      category: {
        ...modalState.category,
        open: false,
      },
    });
  };

  const handleChangeCategory = (value) => {
    setActiveCategory(value);
  };

  const handlePopper = (type, event) => {
    switch (type) {
    case "member":
      setMemberPopper(event.currentTarget);
      break;
    case "category":
      setCategoryPopper(event.currentTarget);
      break;

    default:
      break;
    }
  };

  const handleClickAway = () => {
    setMemberPopper(null);
  };

  const handleCloseCategory = () => {
    setCategoryPopper(null);
  };

  const handleEditCategory = () => {
    setCategoryPopper(null);
    setModalState({
      ...modalState,
      category: {
        state: "edit",
        open: true,
      },
    });
  };

  const handleDeleteCategory = () => {
    setCategoryPopper(null);
    const updatedCategory = categories.filter(category => category !== activeCategory);
    setCategories(updatedCategory);
  };

  const toggleMember = (id) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id
          ? { ...member, isChecked: !member.isChecked }
          : member,
      ),
    );
  };

  const getMemberNames = () => {
    const checkedMembers = members.filter((member) => member.isChecked);
    return checkedMembers.length > 0
      ? checkedMembers.map((member) => member.name).join(", ")
      : "No members selected.";
  };

  const openMember = Boolean(memberPopper);
  const openCategory = Boolean(categoryPopper);

  return (
    <>{
      Object.keys( detailProject).length !== 0 ? (
        <>

          <div className="flex gap-5 items-center p-8 border-b border-slate-200">
            <ProjectIcon />
            <div className="flex flex-col gap-2 ml-auto w-full">
              <span>Project Name</span>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: 15,
                }}
              >
                <Box sx={{ width: "60%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    style={{ height: 7, borderRadius: 10 }}
                    value={75}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
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
                              {category}
                              {/* {getCategoryName(category)} */}
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
                              <IconButton
                                onClick={(event) => {
                                  setActiveCategory(
                                    category,
                                  );
                                  handlePopper(
                                    "category",
                                    event,
                                  );
                                }}
                              >
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
                                      onClick={() => {
                                        handleOpenTaskModal(
                                          category,
                                          "edit",
                                          task,
                                        );
                                      }}
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
                                textTransform: "none",
                                borderRadius: 6,
                                padding: 8,
                                width: "100%",
                              }}
                              onClick={() =>
                                handleOpenTaskModal(
                                  category,
                                  "add",
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
                        textTransform: "none",
                        borderRadius: 6,
                        padding: 8,
                        width: "100%",
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

          {/* Category Menu Popup */}
          <Menu
            anchorEl={categoryPopper}
            open={openCategory}
            onClose={handleCloseCategory}
          >
            <MenuItem onClick={handleEditCategory}>
              <span className="text-sm">Edit</span>
            </MenuItem>
            <MenuItem onClick={handleDeleteCategory}>
              <span className="text-sm text-rose-800">Delete</span>
            </MenuItem>
          </Menu>

          {/* Task Modal */}
          <Modal
            open={modalState.task.open}
            onClose={() =>
              setModalState({
                ...modalState,
                task: {
                  ...modalState.task,
                  open: false,
                },
              })
            }
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-lg p-5 rounded-xl">
              <div className="flex justify-between">
                <h1 className="font-semibold">
                  {modalState.task.state == "add"
                    ? "Create new task"
                    : "Edit task"}
                </h1>
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
                          <MenuItem
                            value={category}
                            key={index}
                          >
                            {category}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <div className="flex items-center justify-between relative">
                    <span className="text-sm">Members</span>
                    <Button
                      variant="text"
                      size="small"
                      style={{
                        textTransform: "none",
                        borderRadius: 6,
                      }}
                      onClick={(event) =>
                        handlePopper("member", event)
                      }
                    >
									Edit member
                    </Button>
                    <Popper
                      id={
                        openMember ? "simple-popper" : undefined
                      }
                      open={openMember}
                      anchorEl={memberPopper}
                      className="z-[9999]"
                    >
                      <ClickAwayListener
                        onClickAway={handleClickAway}
                      >
                        <div className="bg-white py-1 rounded-md shadow-lg max-h-[300px] overflow-auto">
                          <div className="flex flex-col">
                            {members.map(
                              (member, index) => {
                                return (
                                  <div
                                    className="hover:bg-stone-200 cursor-pointer"
                                    key={index}
                                  >
                                    <FormControlLabel
                                      classes={{
                                        label: "!text-sm",
                                        root: "py-1 px-3",
                                      }}
                                      control={
                                        <Checkbox
                                          size="small"
                                          checked={
                                            member.isChecked
                                          }
                                          onChange={() =>
                                            toggleMember(
                                              member.id,
                                            )
                                          }
                                          inputProps={{
                                            "aria-label":
																					"controlled",
                                          }}
                                        />
                                      }
                                      label={
                                        member.name
                                      }
                                    />
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </ClickAwayListener>
                    </Popper>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col p-2 bg-stone-100 w-full rounded-lg">
                      <span className="text-xs font-semibold">
                        {getMemberNames()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex mt-5 justify-end">
                  <Button
                    variant="contained"
                    size="medium"
                    style={{
                      textTransform: "none",
                      borderRadius: 6,
                    }}
                    onClick={handleSaveTask}
                  >
								Save
                  </Button>
                </div>
              </div>
            </div>
          </Modal>

          {/* Category Modal */}
          <Modal
            open={modalState.category.open}
            onClose={() =>
              setModalState({
                ...modalState,
                category: {
                  ...modalState.category,
                  open: false,
                },
              })
            }
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-lg p-5 rounded-xl">
              <div className="flex justify-between">
                <h1 className="font-semibold">
                  {modalState.category.state == "add"
                    ? "Create new category"
                    : `Edit ${activeCategory} category`}
                </h1>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <FormControl hiddenLabel={true}>
                    <TextField
                      placeholder="Enter category name"
                      variant="standard"
                      value={newCategoryName}
                      onChange={(event) => {
                        setNewCategoryName(event.target.value);
                      }}
                    />
                  </FormControl>
                </div>
                <div className="flex mt-5 justify-end">
                  <Button
                    variant="contained"
                    size="medium"
                    style={{
                      textTransform: "none",
                      borderRadius: 6,
                    }}
                    onClick={handleSaveCategory}
                  >
								Save
                  </Button>
                </div>
              </div>
            </div>
          </Modal>

        </>
      ) :(

        <div className="min-h-screen flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">Please Select your Project</span>
        </div>
      )
    }
     
    </>
  );
}
