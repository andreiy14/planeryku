import * as React from 'react';
import { InboxIcon } from './icon';

import userProfile from '../hooks/user-profile';
import { USER_PROFILE_MODAL } from '../constants';
import UserProfileModal from './user-profile-modal';

export default function Navbar() {
  const {
    isModalVisible,
    openModal,
  } = userProfile();


  return (
    <>
      <UserProfileModal  open={isModalVisible} handleClose={() => openModal(null)} />

      <div className="">
        <div className="p-5 border-b border-slate-200 flex h-[70px] max-h-[70px]">
          <div onClick={() => openModal(USER_PROFILE_MODAL)} className="flex gap-2 items-center ml-auto cursor-pointer">
            <InboxIcon />
            <span>
						Hi, Michael
            </span>
          </div>
        </div>
      </div>

    </>
  );
}
