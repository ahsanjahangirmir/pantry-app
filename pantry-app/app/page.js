'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, getDoc, getDocs, query, setDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function Header() {
  return (
    <Box component="header" width="100%" bgcolor="#ADD8E6" p={2} display="flex" alignItems="center" position={'absolute'} top={'0%'}>
      <Typography variant="h2" color="#333">
        Pantry Tracker
      </Typography>
    </Box>
  );
}

export default function Home() {

  const [inv, setInv] = useState([]) // store the state of inventory 
  const [open, setOpen] = useState(false) // state variable for the open status of the dialog
  const [item, setItemName] = useState('') // state variable for the item name

  const handleOpen = () => {setOpen(true)}
  const handleClose = () => {setOpen(false)}

  // async (to stop site from freezing while fetching) function to update the inventory 
  const updateInv = async () => 
      
    {
      const snapshot = query(collection(firestore, 'pantry')) 
      const docs = await getDocs(snapshot) 
      const invList = []
      docs.forEach((doc) => invList.push({name:doc.id, ...doc.data(),})) 
      setInv(invList) 
    }

  const removeItem = async (item) => 

    {
      const docReference = doc(firestore, 'pantry', item)
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
            }
        }

      updateInv()
    }

  const addItem = async (item) => 

    {
      const docReference = doc(firestore, 'pantry', item)
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

  const increment = async (item) => 

    {
      const docReference = doc(firestore, 'pantry', item)
      const docSnapshot = await getDoc(docReference)

      if (docSnapshot.exists())

      {
        const {quantity} = docSnapshot.data()
        await updateDoc(docReference, {quantity: quantity + 1})
      }

      updateInv()
    }

  const decrement = async (item) => 

    {
      const docReference = doc(firestore, 'pantry', item)
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
          await updateDoc(docReference, {quantity: quantity - 1})
        }
      }

      updateInv()
    }

  useEffect(() => {

    updateInv()

  }, [])

  return (
    
    <Box width='100vw' height='100vh' display='flex' justifyContent='center' alignItems='center' gap={2} flexDirection={'column'}> 
    
      <Header/>
    
      <Modal open={open} onClose={handleClose}>
        <Box position='absolute' top='50%' sx={{transform:'translate(-50%, -50%)'}} left='50%' width={400} bgcolor={'white'} border={'2px solid #000'} boxShadow={24} gap={2} p={4} display={'flex'} flexDirection={'column'}>
          <Typography variant='h6' color={'black'} alignItems={'center'} justifyContent={'center'} display={'flex'}> Add Item </Typography>
          <Stack width={'100%'} direction={'row'} spacing={2}>
            <TextField variant="outlined" fullWidth value={item} onChange={(e) => {setItemName(e.target.value)}}/>
            <Button variant="outlined" onClick={() => {addItem(item); setItemName(''); handleClose();}}>Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>Add Item</Button>

      <Box border={'2px solid #333'}>
        <Box bgcolor={'#ADD8E6'} width={"60vw"} height={"100px"} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h3" color={"#333"}> Inventory </Typography>

        </Box>
      </Box>
      <Stack direction={'column'} overflow={'auto'} width={'60vw'} height={'300px'}>
      {
        inv.map(({name, quantity}) => ( 
          <Stack direction={'row'} spacing={2} key={name} width={'100%'} minHeight={'150px'} display={'flex'} alignItems={'center'} justifyContent={'center'} bgcolor={'black'} padding={5}>
            <Typography variant="h6" color={'#fff'} textAlign={'center'}> {name.charAt(0).toUpperCase() + name.slice(1)} </Typography>
            <Button variant="outlined" size="small" onClick={() => decrement(name)}>-</Button>
            <Typography variant="h6"> {quantity} </Typography>
            <Button variant="outlined" size="small" onClick={() => increment(name)}>+</Button>
            <Tooltip title="Remove">
              <IconButton onClick={() => removeItem(name)}>
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ))
      }
      </Stack>
    </Box>
  );
}
