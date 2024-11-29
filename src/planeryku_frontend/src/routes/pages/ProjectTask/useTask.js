import { useEffect, useState } from 'react';
import { planeryku_task_backend } from '../../../../../declarations/planeryku_task_backend';

const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCategoryName = (category) => {
    switch (category) {
    case 'readyToTest':
      return 'Ready to Test';
    case 'readyToDeploy':
      return 'Ready to Deploy';
    case 'open':
      return 'Open';
    case 'inProgress':
      return 'In Progress';
    default:
      return 'Unknown';
    }
  };

  const updateStatusTask = async (taskId, newStatus) => {
    try {
      setIsLoading(true);
      await planeryku_task_backend.updateTaskStatus(taskId, newStatus);
      console.log('Task status updated successfully');
    } catch (error) {
      console.log('Error updating task status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getListTask = async () => {
    try {
      setIsLoading(true);
      const response = await planeryku_task_backend.getTasks();
      const readyToTest = response.readyToTest;
      const readyToDeploy = response.readyToDeploy;
      const open = response.open;
      const inProgress = response.inProgress;

      const dataMapping = [
        ...readyToTest,
        ...readyToDeploy,
        ...open,
        ...inProgress,
      ];

      const result = dataMapping.map((task, index) => ({
        ...task,
        order: index + 1,
        name: task.name,
        category: task.status,

      }));



      console.log('RESPONSE', result);
      setTasks(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    // getListTask();
  }, []);


  return {
    isLoading,
    tasks,
    setTasks,
    getCategoryName,
    updateStatusTask,
  };
};

export default useTask;