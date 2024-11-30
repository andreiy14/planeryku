import {create} from 'zustand';

const userProfileStore = create((set) => ({
  isModalOpen: false,           
  modalType: null,              


  openModal: (modalType) => set({ isModalOpen: true, modalType }),


  closeModal: () => set({ isModalOpen: false, modalType: null }),

}));

export default userProfileStore;
