import React from "react";
import { Button, FormControl, Modal, TextField } from "@mui/material";

const ProjectModal = ({ open = false, onClose = () => {}, onSave= () => {} }) => {

  const [formData, setFormData] = React.useState({
    name :"",
    description :"",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  return (
    <Modal
      open={open}  
      onClose={onClose}
      
      
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-lg p-5 rounded-xl">
        <div className="flex justify-between">
          <h1 className="font-semibold">
            {/* {modalState.category.state == "add"
              ? "Create new category"
              : `Edit ${activeCategory} category`} */}
          </h1>
        </div>
        <div className="mt-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Project Name</span>
            <FormControl hiddenLabel={true}>
              <TextField
                onChange={handleChange}
                name="name"
                placeholder="Enter project name"
                variant="standard"
                value={formData.name}
                
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
              onClick={() => onSave(formData)}
            >
								Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};


export default ProjectModal;