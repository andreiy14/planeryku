import { useState } from "react";
import useProject from "../../hooks/use-project";
import ProjectStore from "../../store/project-store";

const useSideBar = () => {

  const [modalProject, setModalProject] = useState(false);
  const {project, loading, addProject} = useProject();
  const {setDetailProject, setCategories} = ProjectStore();


  const handleShowModalProject = () => {
    setModalProject(!modalProject);
  };

  const handleSaveProject = (data) => {
    console.log("data submit", data);
    addProject(data);
    setModalProject(false);
  };
  const getDetailProject = (item => {
    setDetailProject(item);
    setCategories(item.listStatus);
  });

  return {
    modalProject,
    handleShowModalProject,
    handleSaveProject,
    project,
    loading,
    getDetailProject,
  };

};



export default useSideBar;