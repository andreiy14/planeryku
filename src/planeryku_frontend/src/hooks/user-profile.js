import useModalStore from '../store/user-profile-store'; 

const userProfile = () => {
  const { isModalOpen, modalType, openModal, closeModal  } = useModalStore();

  const isModalVisible = isModalOpen && modalType !== null;
  
  return {
    isModalVisible,
    modalType,
    openModal,
    closeModal,

  };
};

export default userProfile;
