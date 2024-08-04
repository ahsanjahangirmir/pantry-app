'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, getDoc, getDocs, query, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Home() {

  const [inv, setInv] = useState([]) // store the state of inventory 
  const [open, setOpen] = useState(false) // state variable for the open status of the dialog
  const [item, setItemName] = useState('') // state variable for the item name

  const handleOpen = () => {setOpen(true)}
  const handleClose = () => {setOpen(false)}

  // async (to stop site from freezing while fetching) function to update the inventory 
  const updateInv = async () => 
      
    {
      const snapshot = query(collection(firestore, 'pantry')) // query the collection 'pantry', collection is a db 
      const docs = await getDocs(snapshot) // docs are objects in db (schema)
      const invList = []
      docs.forEach((doc) => invList.push({name:doc.id, ...doc.data(),})) // push each doc into the invList
      setInv(invList) // set the state of inv to the invList
    }

  const removeItem = async (item) => 

    {
      docReference = doc(collection(firestore, 'pantry', item))
      const docSnapshot = await getDoc(docReference)

      if (docSnapshot.exists())

        {
          const {quantity} = docSnapshot.data()

          if (quantity === 1)

            {
              await deleteDoc(docReference)
            }

          else 
            
            {
              await setDoc(docReference, {quantity: quantity - 1})
              // await updateDoc(docReference, {quantity: quantity - 1})
            }
        }

      updateInv()
    }

  const addItem = async (item) => 

    {
      docReference = doc(collection(firestore, 'pantry', item))
      const docSnapshot = await getDoc(docReference)

      if (docSnapshot.exists())

      {
        const {quantity} = docSnapshot.data()
        await updateDoc(docReference, {quantity: quantity + 1})
      }

      else 

      {
        await setDoc(docReference, {quantity: 1})
      }

      updateInv()
    }

  // useEffect hook to update the inventory when the page loads
  useEffect(() => {

    updateInv()

  }, [])

  return (
    
    <Box width='100vw' height='100vh' display='flex' justifyContent='center' alignItems='center' gap={2}> 
    
      <Modal open={open} onClose={handleClose}>
        <Box position='absolute' top='50%' left='50%' sx{{transform='(-50%, -50%)'}} width={400} bgcolor={white} border={'2px solid #000'} boxShadow={24} gap={2} p={4} display={'flex'} flexDirection={'column'}>
          <Typography variant='h6'> Add Item </Typography>
          <Stack width={'100%'} direction={'row'} spacing={2}>
            <TextField variant="outlined" fullWidth value={item} onChange={(e) => {setItemName(e.target.value)}}>
            <Button variant="outlined" onClick={() => {addItem(item); setItemName(''); handleClose()}}>Add</Button>
            </TextField>
          </Stack>
        </Box>
      </Modal>

      <Button variant="outlined" onClick={handleOpen}>Add Item</Button>
      
      <Modal open={open} onClose={handleClose}>
        <Box position='absolute' top='50%' left='50%' sx{{transform='(-50%, -50%)'}} width={400} bgcolor={white} border={'2px solid #000'} boxShadow={24} gap={2} p={4} display={'flex'} flexDirection={'column'}>
          <Typography variant='h6'> Add Item </Typography>
          <Stack width={'100%'} direction={'row'} spacing={2}>
            <TextField variant="outlined" fullWidth value={item} onChange={(e) => {setItemName(e.target.value)}}>
            <Button variant="outlined" onClick={() => {addItem(item); setItemName(''); handleClose()}}>Add</Button>
            </TextField>
          </Stack>
        </Box>
      </Modal>
      
      <Typography variant="h1"> Welcome to Pantry </Typography>
    
    </Box>
  );
}
