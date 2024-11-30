import {create} from 'zustand';

const ProjectStore = create((set) => ({
  isModalOpen: false,           
  modalType: null,              
  listProject : [],
  detailProject : {},
  categories : [],


  setProject: (listProject) => set({listProject}),
  setCategories : (categories) => set({categories}),
  setDetailProject: (detailProject) => set({detailProject}),  
  openModal: (modalType) => set({ isModalOpen: true, modalType }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),

  

  

}));

export default ProjectStore;
