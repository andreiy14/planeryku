import * as React from 'react';

import Button from '@mui/material/Button';


import * as PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, Slide } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CancelIcon from '@mui/icons-material/Cancel';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProfileModal = ({ open, handleClose }) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [inputUsername, setInputUsernme] = React.useState('');

  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        TransitionComponents={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle fontWeight={600}>
                    User Profile
        </DialogTitle>


        <ul>

          <li className='hover:bg-indigo-100 p-2  transition duration-300 cursor-pointer'>

            <div className='flex gap-4 px-4'>
              <span className='font-medium'>Naruto</span>
              {!isEdit && <ModeEditIcon className='cursor-pointer' onClick={() => setIsEdit(true)} />}
              {isEdit && <CancelIcon className='cursor-pointer' onClick={() => setIsEdit(false)} />}
            </div>
            
            {isEdit &&    
                            <input
                              onChange={(e) => setInputUsernme(e.target.value)}
                              value={inputUsername}
                              type="text"
                              id="username"
                              className="shadow mt-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6"
                              placeholder="Enter your username"
                            />
            }
          </li>
          <li className='mt-2 mb-2'>

            <Divider />
          </li>

          <li className='hover:bg-indigo-100 p-2  transition duration-300 cursor-pointer px-6'>

            <span className='font-medium'>
                            Log out
            </span>

          </li>

          <li className='mt-2 mb-2'>

            <Divider />
          </li>
        </ul>

        <DialogActions>
          <Button style={{ textTransform: 'none', borderRadius: 6 }} variant='contained' onClick={handleClose}>{isEdit ? 'Save' : 'Close'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UserProfileModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleOpen: PropTypes.func,
};

UserProfileModal.defaultProps = {
  open: false,
  handleClose: () => { },
  handleOpen: () => { },
};


export default UserProfileModal;