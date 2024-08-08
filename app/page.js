'use client'
import { Box, Stack, Typography, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { firestore } from './firebase';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f5f5f5',  // Light gray for modal background
  borderRadius: 12,
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  p: 4,
};

const containerStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#112A46",  // Dark blue background
  padding: 3,
};

const headerStyle = {
  width: "800px",
  bgcolor: "#EAEAEB",  // Slightly darker gray for header
  color: "#000000",    // Black text for better contrast
  borderRadius: 12,
  padding: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  marginBottom: 3, // Added margin for spacing
};

const headingStyle = {
  width: "100%",
  bgcolor: "#ffffff", // White background for the heading
  color: "#000000",   // Black text for contrast
  borderRadius: 12,
  padding: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  marginBottom: 3, // Space between heading and main content
};

const buttonStyle = {
  borderRadius: 20,
  textTransform: 'none',
  padding: '8px 16px',
};

const textFieldStyle = {
  borderRadius: 20,
  bgcolor: "#ffffff",
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [editItemName, setEditItemName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = docs.docs.map(doc => ({ name: doc.id, ...doc.data() }));
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  useEffect(() => {
    const filteredItems = pantry.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPantry(filteredItems);
  }, [searchQuery, pantry]);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const editItemQuantity = async () => {
    const docRef = doc(collection(firestore, 'pantry'), editItemName);
    await setDoc(docRef, { count: Number(newQuantity) });
    setNewQuantity('');
    setEditItemName('');
    handleEditClose();
    await updatePantry();
  };

  const deleteItem = async (item) => {
    await deleteDoc(doc(collection(firestore, 'pantry'), item));
    await updatePantry();
  };

  return (
    <Box sx={containerStyle}>
      {/* Heading */}
      <Box sx={headingStyle}>
        <Typography variant="h4" fontWeight="bold">
          WELCOME TO THE INVENTORY MANAGER
        </Typography>
      </Box>

      {/* Search Field */}
      <TextField
        id="search-field"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={textFieldStyle}
        InputProps={{ style: { color: '#000000' } }}  // Text color in the text field
        InputLabelProps={{ style: { color: '#000000' } }}  // Label color in the text field
        margin="normal"
      />

      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom fontWeight="bold" color="#000000">
            Add Item
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={textFieldStyle}
              InputProps={{ style: { color: '#000000' } }}  // Text color in the text field
              InputLabelProps={{ style: { color: '#000000' } }}  // Label color in the text field
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={buttonStyle}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Edit Quantity Modal */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-edit-title"
        aria-describedby="modal-edit-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-edit-title" variant="h6" component="h2" gutterBottom fontWeight="bold" color="#000000">
            Edit Quantity
          </Typography>
          <Stack direction="column" spacing={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
              sx={textFieldStyle}
              InputProps={{ style: { color: '#000000' } }}  // Text color in the text field
              InputLabelProps={{ style: { color: '#000000' } }}  // Label color in the text field
            />
            <TextField
              id="outlined-basic"
              label="New Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              sx={textFieldStyle}
              InputProps={{ style: { color: '#000000' } }}  // Text color in the text field
              InputLabelProps={{ style: { color: '#000000' } }}  // Label color in the text field
            />
            <Button
              variant="contained"
              color="primary"
              onClick={editItemQuantity}
              sx={buttonStyle}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Main Content */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={buttonStyle}>
        Add Item
      </Button>
      <Box sx={headerStyle}>
        <Typography variant="h4" fontWeight="bold">
          Pantry Items
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ width: "800px", mt: 2, backgroundColor: '#ffffff', color: '#000000' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Item</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Quantity</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPantry.map((item, index) => (
              <TableRow key={item.name} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }}>
                <TableCell>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</TableCell>
                <TableCell align="right">{item.count}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      setEditItemName(item.name);
                      setNewQuantity(item.count);
                      handleEditOpen();
                    }}
                    sx={buttonStyle}
                  >
                    Edit Quantity
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeItem(item.name)}
                    sx={{ ...buttonStyle, ml: 1 }}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteItem(item.name)}
                    sx={{ ...buttonStyle, ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
