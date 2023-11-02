"use client";
import React, { useState, useRef } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { address , abi } from "../../constant"
import { ethers } from 'ethers';
import Style from "./issueCertificate.module.css"
import {
  FormControl,
  FormLabel,
  Center,
  Stack,
  VStack,
  Heading,
  Card,
  CardBody,
  Button
} from '@chakra-ui/react'
import { Box, Input } from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import Navbar from '@/components/Navbar/Navbar';
// import ConnectButtonWrapper from '@/buttonWrapper';
import { Select } from '@chakra-ui/react';
import images from "../../img"


const IssueCertificate = () => {

  // definign all states 
  const [name, setname] = useState("");
  const [remarks, setremarks] = useState("");
  const [useraddress , setaddress] = useState("");
  const [validity , setvalidity] = useState("")
  const [url, seturl] = useState('')
  const [isuploaded, setuploaded] = useState();
  const [loading, setloading] = useState(false)
  const [showUploadAlert, setShowUploadAlert] = useState(false);
  const [showMintAlert, setShowMintAlert] = useState(false);
  const [showMetamaskAlert, setShowMetamaskAlert] = useState(false);
  const [status,setstatus] = useState('')
  // defining  useRef for all inputes
  const fileRef = useRef(null);

  // upload image function
  const uploadImage = async (imageData) => {
    setloading(true)
    const nftstorage = new NFTStorage({ token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAzM2Y5Mzc1ZEQ5ODY1YzhmN2FiODVENGRiRTM3NDhERWI4NTljRkYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NTc3MTE1MDk5NiwibmFtZSI6IlBBUkszIn0.eHLoAl-RBIxAqXmHm_KTQ553Ha-_18sZrnoxuXpGxMI` })

    // Send request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description : remarks,
      issuedTo : address
    })

    // Save the URL
    // const NFturl = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
    seturl(ipnft)
    setuploaded(true);
    setloading(false);
    setShowUploadAlert(true); // Set showUploadAlert to true after uploadImage function is completed
    setTimeout(() => {
      setShowUploadAlert(false); // Set showUploadAlert back to false after 5 seconds
    }, 5000);
    return ipnft

  }

  const mintnfthandler = async (ipnft , Useraddress ,validitydate) => {
    try {
      setloading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
        
      let contract = new ethers.Contract(address , abi, signer)
  
      // alert( "user address " ,Useraddress)
      // alert( "tokenuri " ,ipnft)
      // alert("validity",validitydate)
      let transaction = await contract.mintCertificate(Useraddress, ipnft, Number(validitydate));
      await transaction.wait()
      setuploaded(true);
      setloading(false)
      setShowMintAlert(true); // Set showMintAlert to true after mintnfthandler function is completed
      setTimeout(() => {
        setShowMintAlert(false); // Set showMintAlert back to false after 5 seconds
      }, 5000);
    } catch (error) {
       console.log("mint nft handelr error ",error)
    }

  }

  // handle upload Function
  const handleUpload = async (event) => {
    try {
      event.preventDefault();
    //   const files = fileRef.current.files[0];
    //   console.log(files);
      console.log(name, remarks, validity,useraddress ,fileRef);

      if(name == "" || remarks == "" || validity == "" || useraddress == ""){
        alert("Please Fill All The Details")       
      }else{   
      const ipnft = await uploadImage(images.cert1);
      console.log(ipnft);
      await mintnfthandler(ipnft , useraddress , validity); 

      }
  
    } catch (error) {
      console.error(error.code); // Print the error on the consol
        // // Display a generic error message for other types of errors
        console.log(" handleUpload  error -> " + error)
      
    }
  };


  return (

    <>
    <Navbar />
    <div className={Style.uploadassets}>
      {showUploadAlert && (
        <Alert status='success' transition={'ease-in-out'}>
          <AlertIcon style={{maxWidth:'0.6rem',maxHeight:'0.8rem'}} />
          Data Uploaded to IPFS. Now Minting the Certificate...
        </Alert>
      )}
      {showMintAlert && (
        <Alert status='success'>
          <AlertIcon style={{maxWidth:'0.6rem',maxHeight:'0.8rem'}} />
          Certificate Minted Successfully
        </Alert>
      )}
      {showMetamaskAlert&&
        <Alert className=' w-10/12  ' status='error'><AlertIcon />{status}</Alert>
      }
      <Box className={Style.main} >
        <Center>
          <VStack spacing='4'>
            <VStack as='header' spacing='6' mt='8'>
              <Heading
                as='h1'
                fontWeight='600'
                fontSize='2.5rem'
                letterSpacing='-0.5px'
                color='#4c5773'
                className={Style.mainheading}
              >
                Issue Certificate
              </Heading>
            </VStack>
            <Card bg='#ecf0f3' variant='outline' color="#4c5773"  borderColor='#4c5773' style={{border:'2px solid #4c5773' ,borderRadius:'1rem' , margin:'1rem 0 0 0 '}} w='308px'>
              <CardBody style={{ }} >
                  <VStack spacing='4'>
                    <FormControl style={{padding:'1rem 0.5rem'}}>
                      <FormLabel style={{fontWeight:'600', fontSize:'1.1rem'}} color={'#4c5773'}>Certificate Name:</FormLabel>
                      <Input
                        type='text'
                        onChange={(event) => setname(event.target.value)}
                        placeholder='Blockchain Bootcamp 2021.....'
                        bg='white'
                        borderColor='#4c5773'
                        style={{padding:'0.4rem 0.8rem', margin:".7rem 0 0 0 "}}
                        borderRadius='6px'
                        required
                      />
                    </FormControl>
                    <FormControl style={{padding:'1rem 0.5rem'}}>
                      <FormLabel size='2xl' style={{fontWeight:'600'}} color={'#4c5773'}>Remarks:</FormLabel>
                      <Input
                        type='text'
                        bg='white'
                        style={{padding:'0.4rem 0.8rem', margin:".7rem 0 0 0 "}}
                        onChange={(event) => setremarks(event.target.value)}
                        placeholder='A Little Description... About it '
                        borderColor='#4c5773'
                        size='sm'
                        borderRadius='6px'
                        required
                      />
                    </FormControl>
                    <FormControl style={{padding:'1rem 0.5rem'}}>
                      <FormLabel size='2xl' style={{fontWeight:'600'}} color={'#4c5773'}>Duration of Validity:(In Days)</FormLabel>
                      <Input
                        type='number'
                        bg='white'
                        style={{padding:'0.4rem 0.8rem', margin:".7rem 0 0 0 "}}
                        onChange={(event) => setvalidity(event.target.value)}
                        placeholder='1'
                        borderColor='#4c5773'
                        size='sm'
                        required
                        borderRadius='6px'
                      />
                    </FormControl>

                    <FormControl style={{padding:'1rem 0.5rem'}}>
                      <FormLabel size='2xl' style={{fontWeight:'600'}} color={'#4c5773'}>Address Of Candidate:</FormLabel>
                      <Input
                        type='text'
                        bg='white'
                        style={{padding:'0.4rem 0.8rem', margin:".7rem 0 0 0 "}}
                        onChange={(event) => setaddress(event.target.value)}
                        placeholder='0xbuq827280.....'
                        borderColor='#4c5773'
                        size='sm'
                        required
                        borderRadius='6px'
                      />
                    </FormControl>

                    <FormControl style={{padding:'1rem' }}>
                    <Select placeholder='Select Certificate' size='lg' style={{padding:'0.4rem 3rem' , border:'2px solid #4c5773' , borderRadius:'1rem'}}  >
                        <option value='option1'>American Crypto Academy</option>
                        <option value='option2'>Mentorland</option>
                    </Select>
                  
                    </FormControl>

                    <Button
                      bg='#4c5773'
                      color='#fff'
                      style={{padding:'0.5rem 5rem', borderRadius:'0.4rem' , margin:'0 0 1rem 0 '}}
                      size='md'
                      _active={{ bg: '#fff' }}
                      onClick={(e) => handleUpload(e)}
                    >
                      Issue Certs
                    </Button>
                    
                  </VStack>                
              </CardBody>
            </Card>
          </VStack>
        </Center>
      </Box>
    </div>

    </>
  );
}
export default IssueCertificate;
