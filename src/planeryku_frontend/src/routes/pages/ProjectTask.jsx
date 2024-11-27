import {
	Box,
	Button,
	Chip,
	IconButton,
	LinearProgress,
	Typography,
} from "@mui/material";
import ProjectIcon from "../../components/icon/project";
import HorizontalMenuIcon from "../../components/icon/horizontal-menu";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { PlusIcon } from "../../components/icon";

export default function ProjectTask() {
	const [tasks, setTasks] = useState([
		{ id: 1, category: "To Do", name: "Task 1", order: 1 },
		{ id: 2, category: "To Do", name: "Task 2", order: 2 },
		{ id: 3, category: "To Do", name: "Task 3", order: 3 },
		{ id: 4, category: "In Progress", name: "Task 4", order: 1 },
		{ id: 5, category: "Completed", name: "Task 5", order: 1 },
	]);

	const categories = ["To Do", "In Progress", "Completed"];

	const handleDragEnd = (result) => {
		const { source, destination } = result;

		// If dropped outside a droppable area
		if (!destination) return;

		// If dropped in the same location (no change in position)
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		const sourceCategory = source.droppableId;
		const destinationCategory = destination.droppableId;

		// Find the task being dragged
		const draggedTask = tasks.find(
			(task) =>
				task.category === sourceCategory &&
				task.order === source.index + 1
		);

		if (draggedTask) {
			let updatedTasks = tasks.map((task) => {
				// Adjust order for tasks in the source category
				if (
					task.category === sourceCategory &&
					task.order > source.index + 1
				) {
					return { ...task, order: task.order - 1 };
				}

				// Adjust order for tasks in the destination category
				if (
					task.category === destinationCategory &&
					task.order >= destination.index + 1
				) {
					return { ...task, order: task.order + 1 };
				}

				return task;
			});

			// Update the dragged task's category and order
			draggedTask.category = destinationCategory;
			draggedTask.order = destination.index + 1;

			// Add the updated task back to the list
			updatedTasks = [
				...updatedTasks.filter((task) => task.id !== draggedTask.id),
				draggedTask,
			];

			// Sort the tasks by category and order
			updatedTasks.sort(
				(a, b) =>
					a.category.localeCompare(b.category) || a.order - b.order
			);

			setTasks(updatedTasks);
		}
	};

	return (
		<>
			<div className="flex gap-5 items-center p-8">
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
			<div className="bg-stone-50 p-8 min-h-[calc(100vh-70px)]">
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
												</h1>
												<Chip
													label="4"
													onClick={() => {}}
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
															category
													)
													.sort(
														(a, b) =>
															a.order - b.order
													) // Sort by order
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
														textTransform: "none",
														borderRadius: 6,
														padding: 8,
														width: "100%",
													}}
												>
													+ Add a card
												</Button>
											</div>
										</div>
									</div>
								)}
							</Droppable>
						))}
					</div>
				</DragDropContext>
			</div>
		</>
	);
}
