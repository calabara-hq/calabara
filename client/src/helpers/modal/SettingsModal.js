import React, { useState, useEffect, useRef, useReducer } from 'react'
import { motion } from "framer-motion"
import axios from 'axios'
import Backdrop from './modal-backdrop.js'
import Glyphicon from '@strongdm/glyphicon'
import { SettingsCheckpointBar, FinalizeSettingsCheckpointBar } from '../../features/checkpoint-bar/checkpoint-bar'
import Wallet, { validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signTransaction, connectWallet } from '../../features//wallet/wallet'
import HelpModal from './helpModal.js'
import * as WebWorker from '../../app/worker-client';
import '../../css/modal.css';
import { useParams } from 'react-router-dom'



import { useSelector, useDispatch } from 'react-redux';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../../features/wallet/wallet-reducer';

import {
  selectDashboardInfo, updateDashboardInfo,
} from '../../features/dashboard/dashboard-info-reducer';
import { useForkRef } from '@mui/material'

import {
  populateDashboardRules,
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

import {
  selectInstalledWidgets,
} from '../../features/dashboard/dashboard-widgets-reducer';

import{
  addOrganization,
  deleteOrganization,
} from '../../features/org-cards/org-cards-reducer';


const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };



export default function SettingsModal({mode, handleClose}){
  const [saveVisible, setSaveVisible] = useState(false)
  const dispatch = useDispatch();
  const dashboardInfo = useSelector(selectDashboardInfo)
  const dashboardRules = useSelector(selectDashboardRules)

  // keep a copy that will never change for signing transactions later;
  const lockedAdminAddresses = dashboardInfo.addresses || [];
  

  const [fields, setFields] = useReducer(
    (fields, newFields) => ({...fields, ...newFields}),
    {}
  )

  useEffect(()=>{
    if(mode == 'existing-org'){
      setFields(dashboardInfo)
      setFields({gatekeeper: {
        rules: Object.values(dashboardRules),
        rulesToDelete: []
      }})
    }
    else if (mode == 'new-org'){
      setFields({name: '', logo: '', website: '', discord: '', addresses:[''], gatekeeper: {rules: []}, ens: ''})
    }
  },[])

  return (
    <Backdrop>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="modal white-gradient"
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"

        >
        <div className = "modalContainer">
        <button className="closeModalButton" onClick={handleClose}><Glyphicon glyph="remove"/></button>

        <div className = "modalContent">
        <TabSelector mode={mode} handleClose={handleClose} fields={fields} setFields={setFields} lockedAdminAddresses={lockedAdminAddresses}/>


        </div>
        </div>

        </motion.div>
    </Backdrop>
  );
}


function TabSelector({handleClose, fields, setFields, mode, lockedAdminAddresses}){

  const [progress, setProgress] = useState(0);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  useEffect(()=>{
    if(mode == 'existing-org'){
      setProgress(1)
    }
  },[])

  return(
    <>
    <h2 className="tab-header" style={{fontWeight: "bold"}}> &#x1F680; Create a dashboard </h2>
    <div className="checkpoint">
      <SettingsCheckpointBar percent={progress*25}/>
    </div>
    <div className="settings-checkpoint-labels">
      <span> enter ens </span>
      <span> setup profile </span>
      <span> admin </span>
      <span> gatekeeper </span>
      <span> finalize </span>
    </div>
    {progress == 0 && <OrgEnsTab setProgress={setProgress} fields={fields} setFields={setFields}/>}
    {progress == 1 && <OrgProfileTab hasImageChanged={hasImageChanged} setHasImageChanged={setHasImageChanged} lockedAdminAddresses={lockedAdminAddresses} handleClose={handleClose} setProgress={setProgress} fields={fields} setFields={setFields} mode={mode}/>}
    {progress == 2 && <OrgAdminsTab setProgress={setProgress} fields={fields} setFields={setFields}/>}
    {progress == 3 && <OrgGateKeeperTab setProgress={setProgress} fields={fields} setFields={setFields} mode={mode}/>}
    {progress == 4 && <FinalizeTab lockedAdminAddresses={lockedAdminAddresses} setProgress={setProgress} handleClose={handleClose} fields={fields} setFields={setFields} mode={mode}/>}



    </>
  )
}

function OrgEnsTab({setProgress, fields, setFields}){
  const [ens, setEns] = useState(fields.ens || "");
  const [validEns, setValidEns] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState({error:false, msg: ""});
  const walletAddress = useSelector(selectConnectedAddress);
  const isConnected = useSelector(selectConnectedAddress);



  useEffect(async()=>{

    // simple check to make sure we don't slow the program down with too many validAddress calls
    // clear the error msg
    setErrorMsg({error:false, msg: ""});
    if(ens.endsWith('.eth')){
      console.log(ens)
      var valid = await validAddress(ens)
      console.log(valid)
      if(valid == false){
        setValidEns(false);
        setResolvedAddress("")
      }
      else{
        // check if this ens already exists in the system
        const doesExist = await axios.get('/doesEnsExist/' + ens)
        if(doesExist.data){
          // already exists. set error msg
          setErrorMsg({error: true, msg: "A dashboard with this ens already exists"})
        }
        else{
          //doesn't exist. good to go
          setValidEns(true)
          setResolvedAddress(valid.substring(0,6) + '...' + valid.substring(35,40))
        }

      }
    }
    else{
      setValidEns(false);
      setResolvedAddress("")
    }

  },[ens])


  const updateInput = (e) =>{
    setEns(e.target.value)
  }


  const handleNext = async() => {
    // check for beta whitelist

    console.log(walletAddress)
    const wl_res = await axios.post('/valid_wl', {address: walletAddress})
    
    if(wl_res.data == false){
      setResolvedAddress('')
      setErrorMsg({error: true, msg: 'sorry, we are only allowing certain wallets to create dashboards at this time. Feel free to look around!'})
    }

    else{
      setFields({ens: ens});
      setProgress(1);
    }

  }


  return(
    <div className="org-ens-tab">
          <h2> Organization ENS </h2>
      <div className={'ens-input'}>
      <p style={{fontSize: "18px"}}>Enter your organization's ENS to initialize a dashboard </p>
      <input disabled={!isConnected}className = {`${errorMsg.error ? "error" : null}`} placeholder="e.g. calabara.eth" value={ens} onChange={updateInput} type="text"/>
      {resolvedAddress != "" && 
        <div className="tab-success-msg">
          <p> {ens} resolves to {resolvedAddress} &#x1F517;</p>
        </div>
      }
      {errorMsg.error &&
        <div className="tab-error-msg">
          <p>{errorMsg.msg}</p>
        </div>}
      </div>
      <button disabled={!validEns} className={"modal-next-btn " + (validEns ? 'enable' : null)} onClick={handleNext}> <i className="fas fa-long-arrow-alt-right"></i></button>
    </div>
  )
}

function OrgProfileTab({setProgress, fields, setFields, mode, lockedAdminAddresses, handleClose, hasImageChanged, setHasImageChanged}){
  const [name, setName] = useState(fields.name || "");
  const uploadedImage = useRef(null);
  const imageUploader = useRef(null);
  const [logoText, setLogoText] = useState('')
  const walletAddress = useSelector(selectConnectedAddress)
  const [transactionError, setTransactionError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');
  const dispatch = useDispatch();

  const [nameErrorMsg, setNameErrorMsg] = useState({error:false, msg: ""});


  const updateName = (e) =>{
    if(nameErrorMsg.error){
      setNameErrorMsg({error:false, msg: ""});
    }
    setFields({name: e.target.value})
  }

  const updateWebsite = (e) =>{
    setFields({website: e.target.value})
  }

  const updateDiscord = (e) =>{
    setFields({discord: e.target.value})
  }


  const handleImageUpload = e => {
    setHasImageChanged(true)

    const [file] = e.target.files;
      if (file) {
        console.log(file)
        const reader = new FileReader();
        reader.onload = (e) => {
            setFields({logo: e.target.result})
            setLogoText(e.target.result.substring(0,25) + '...' )
          }

        reader.readAsDataURL(file);
      }
  }


  async function handleNext(){
    if(fields.name == ""){
      setNameErrorMsg({error: true, msg: "name field cannot be left blank"})
    }
    else{
      console.log(fields.name, fields.ens)
      const exists = await axios.post('/doesNameExist', {name: fields.name, ens: fields.ens})
      if(exists.data){
        //name already exists
        setNameErrorMsg({error: true, msg: "an organization with this name already exists"})

      }
      else{
        setProgress(2);
      }
    }

  }

/* 
the following needs to be done because when an existing org ('already has logo') is displayed, 
the fields.logo state takes the value of the relative path in order for Webworker to process the images. 
we want the webworker to process the images this way, but we need to update the fields.logo state to point
to the blob returned from webworker, not the relative path. 

tldr;; rel path -> webworker -> blob -> fields.logo = blob
*/
  useEffect(()=>{
    if(mode == 'existing-org' && !hasImageChanged){
      WebWorker.settingsProcessLogo().then(result => {
        const reader = new FileReader();
        reader.onload = () => {
          let base64data = reader.result;
          setFields({logo: base64data})
        }
        reader.readAsDataURL(result);
        setHasImageChanged(true)
      })
    }
  },[])



   const handleImgLoaded = (e) => {
     console.log(e)
   }

   const handleDeleteOrganization = async () => {
    var result = await signTransaction(walletAddress, {mode: 'delete'}, lockedAdminAddresses)
    switch(result){
      case 0:
        setTransactionError('user cancelled signature request');
        setTransactionSuccess('')
        break;
      case 1:
        setTransactionError('metamask error');
        setTransactionSuccess('')
        break;
      case 2:
        setTransactionError('signature request rejected. Wallet is not an organization admin');
        setTransactionSuccess('')
        break;
      case 3:
        setTransactionSuccess('success');
        setTransactionError('')
        dispatch(deleteOrganization(fields.ens));
        handleClose('delete');
        break;
    }
   }

  return(
    <div className="org-profile-tab">
    <h2> Organization Info </h2>
    <div className="profile-content">
     <div>
      <div className="profile-name-input">
      <input className = {`${nameErrorMsg.error ? "error" : null}`} placeholder="e.g. calabara" value={fields.name} onChange={updateName} type="text"/>
      {nameErrorMsg.error &&
        <div className="tab-error-msg">
          <p>{nameErrorMsg.msg}</p>
        </div>}
      </div>

      <div className="profile-website-input">
        <input placeholder="e.g. calabara.com" value={fields.website} onChange={updateWebsite} type="text"/>
      </div>
      <div className="profile-discord-input">
        <input value={fields.discord} onChange={updateDiscord} type="text"/>
      </div>      
    </div>  

      <div>
          <div className="profile-logo-input">
            <input placeholder="Logo" type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} ref={imageUploader}/>
            <button className="logo-upload-btn" type="button" onClick={() => imageUploader.current.click()}>
              <div>
                {!hasImageChanged && <img data-src={fields.logo} onLoad={handleImgLoaded}/>} {/* use webworker to get blob when displaying the logo*/}
                {hasImageChanged && <img src={fields.logo}/>} {/* if they want to change the logo, we switch to non-webworker */}
                {fields.logo == '' && <span style={{fontWeight: "bold"}}>upload</span>}
                {fields.logo != '' && <span style={{fontWeight: "bold", marginLeft: "20px"}}>change</span>}
              </div>
            </button>
            </div>
            {mode == 'existing-org' && 
              <div>
                    <div className="dangerzone">
                      <div className="tab-dangerzone-msg">
                        <p>Danger Zone</p>
                      </div>
                      <div className="danger-contents">
                        <div className="danger-description">
                          <p>Delete organization</p>
                        </div>
                        <button onClick={handleDeleteOrganization}> delete </button>
                      </div>
                    </div>
                    {transactionError != '' && 
                    <div className="tab-error-msg" style={{textAlign: 'center', marginTop: '50px'}}>
                      <p>{transactionError}</p>
                    </div>
                    }
                    {transactionSuccess != '' && 
                    <div className="tab-success-msg" style={{textAlign: 'center', marginTop: '50px'}}>
                      <p>{transactionSuccess}</p>
                    </div>
                    }
              </div>
            }
        </div>                      
                    
            
    </div>

        {/* Only show previous (back to ens) if this is a new org. If it's existing, don't allow nav to ens setup*/}
    {mode == 'new-org' &&  <button className={"modal-previous-btn"} onClick={() => {setProgress(0)}}><i class="fas fa-long-arrow-alt-left"></i></button>}
    <button className={"modal-next-btn " + (fields.name != '' ? 'enable' : 'disabled')} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>

    </div>
  )
}

function OrgAdminsTab({setProgress, fields, setFields}){

  // admins should include current wallet address + ens address + any input addresses
  const [addresses, setAddresses] = useState(fields.addresses);
  const [addressErrors, setAddressErrors] = useState([""]);


  const addressesEndRef = useRef(null);
  const addressErrorRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      addressesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const scrollToError = () => {
    addressErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "end"})
  }

  async function addBlankAddress(){
    setAddresses([...addresses, ''])
    scrollToBottom();
  }

  const updateElementInAddressList = (e, index) => {

    setAddressErrors([""])
    let addressesCopy = JSON.parse(JSON.stringify(addresses));
    let addressToUpdate = e.target.value;
    addressesCopy[index] = addressToUpdate;
    setAddresses(addressesCopy);

  }

  const setError = (index) => {
    let errorsCopy = JSON.parse(JSON.stringify(addressErrors));
    errorsCopy[index] = true;
    setAddressErrors(errorsCopy);
    scrollToError();
  }



  async function handleNext(){


    /* 1. error check the addresses.
       2. push addresses to master fields list
       3. move to the next section
    */
    let validChecksumAddresses = []
    for(var i in addresses){
      if(addresses[i] != ''){
      const valid = await validAddress(addresses[i])
        if(!valid){
          // if there was a problem, now is the time to tell the user and break from this loop
            setError(i);
            return;
        }
        else{
          validChecksumAddresses.push(valid)
        }
      }
    }
        setFields({addresses: validChecksumAddresses.filter((el) => {
          return el != '';
        })})
      setProgress(3);

    }


    useEffect(() => {

    },[addresses])

  return(
    <div className="org-admins-tab">
      <div>
        <h2> Add admins </h2>
        <div className="tab-message">
          <p> Admins will have write permissions to all settings and apps. Your address and the organization ens is automatically included. </p>
        </div>
    </div>
    <div className="admins-container">

    {addresses.map((address, idx) => {
      return(
        <>
        <AdminAddressInput addressErrors= {addressErrors} parentAddress={address} index={idx} updateElementInAddressList={updateElementInAddressList}/>
        {addressErrors[idx] == true &&
          <div ref={addressErrorRef} className="tab-error-msg">
            <p>This doesn't look like a valid address</p>
          </div>}
        </>
      )
    })}

    <button ref={addressesEndRef} onClick={addBlankAddress}> Add </button>

    </div>
    <button className={"modal-previous-btn"} onClick={() => {setProgress(1)}}><i class="fas fa-long-arrow-alt-left"></i></button>
    <button className={"modal-next-btn enable"} onClick={handleNext}><i class="fas fa-long-arrow-alt-right"></i></button>
    </div>
  )
}

function AdminAddressInput({addressErrors, parentAddress, index, updateElementInAddressList}){
  const [address, setAddress] = useState(parentAddress || "")

  const handleAddressesChange = (e) => {
    setAddress(e.target.value)
    updateElementInAddressList(e, index)
  }

  return(
    <div className="admin-input">
    <input className = {`${addressErrors[index] == true ? "error" : null}`}  placeholder="e.g. 0x1234" value={address} onChange={handleAddressesChange} type="text"/>
    </div>
  )
}

  // add a gatekeeper button
  // on click, show gatekeeper options
  // on option click, show respective inputs for erc721/erc20
  // save to fields

function OrgGateKeeperTab({setProgress, fields, setFields, mode}){

  const [gatekeeperInnerProgress, setGatekeeperInnerProgress] = useState(0)
  const installedWidgets = useSelector(selectInstalledWidgets)
  const dashboardRules = useSelector(selectDashboardRules)
  const [ruleToDelete, setRuleToDelete] = useState('')

  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const close = (choice) => {
    // this is where we digest the choice from the warning message and either delete or do nothing.
    if(choice == 'delete'){
      //axios.post('/removeGatekeeperDependencies', {ens: fields.ens, rule_id: ruleIdToDelete})
      var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
      gatekeeperCopy.splice(ruleToDelete.index, 1)
      setFields({gatekeeper: {rules: gatekeeperCopy, rulesToDelete: fields.gatekeeper.rulesToDelete.concat(ruleToDelete.rule_id)}})

    }
    setHelpModalOpen(false);
  }

  const open = () => setHelpModalOpen(true);

  async function showHelpModal(){
    (helpModalOpen ? close() : open())
  }

  const removeGatekeeperRule = (array_index) => {
    // If the user is editing an organization and
    // a rule is deleted, we need to check on the widgets in which that rule is applied.
    // we need to grab this orgs widgets and see if any are affected and let them know before allowing a delete.
    // if they want to delete, set the gatekeeper.rulesToDelete state in fields and handle the actual deletion when the user saves at the end.
      var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper));
      gatekeeperCopy.rules.splice(array_index, 1)
      setFields({gatekeeper: gatekeeperCopy})
      
  }


  return(
    <div className="org-gatekeeper-tab">
      <h2> Gatekeeper Configuration </h2>
      {(gatekeeperInnerProgress == 0) && 
      <div className="tab-message">
        <p> Gatekeeper allows organizations to use ERC-20 and/or ERC-721 token balance checks to offer different app functionality and displays for users on either side of a threshold set for each app. <u onClick={() => {window.open('https://docs.calabara.com/gatekeeper')}}>Learn more</u></p>
      </div>
      }
      
      <div className="gatekeeper-content">
        {(gatekeeperInnerProgress == 0) && 
        <div className="installed-gatekeepers">
        {fields.gatekeeper.rules.map((el, idx) => {
          return(
            <div className="gatekeeper-option">
              <button className="remove-gatekeeper-rule" onClick={() => {removeGatekeeperRule(idx)}}><Glyphicon glyph="trash"/></button>

              <p>type: {el.gatekeeperType} -- </p>
              <p>symbol: {el.gatekeeperSymbol} -- </p>
              <p>contract: {el.gatekeeperAddress.substring(0,6)}...{el.gatekeeperAddress.substring(38,42)}</p>
              {helpModalOpen && <HelpModal tab={'deleteGatekeeper'} handleClose={close}/>}
            </div>
         )
        })}
        
        <button className="add-gatekeeper" onClick={() => {setGatekeeperInnerProgress(1)}}>Add gatekeeper rule</button>
        </div>
      }
      {(gatekeeperInnerProgress == 1) && 
        <GatekeeperOptions setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields}/>
      }
      {gatekeeperInnerProgress == 0 &&
        <>
          <button className={"modal-previous-btn"} onClick={() => {setProgress(2)}}><i class="fas fa-long-arrow-alt-left"></i></button>
          <button className={"modal-next-btn enable"} onClick={() => {setProgress(4)}}><i class="fas fa-long-arrow-alt-right"></i></button>
        </>
      }
      </div>
    </div>
  )
}

function GatekeeperOptions({setGatekeeperInnerProgress, fields, setFields}){
  const [gatekeeperOptionClick, setGatekeeperOptionClick] = useState('none')

  return(
    <>
    {(gatekeeperOptionClick == 'none') && 
    <>
      <h4 style={{textAlign: "center", marginBottom: "20px"}}>choose a gatekeeper rule option</h4>
      <div className="available-gatekeeper-options">
        <button className="erc20-option" onClick={()=>{setGatekeeperOptionClick('erc20')}}>ERC-20 balanceOf</button>
        <button className="erc721-option" onClick={()=>{setGatekeeperOptionClick('erc721')}}>ERC-721 balanceOf</button>
      </div>
      <div className="option-cancel">
        <button onClick={() => {setGatekeeperInnerProgress(0)}}>cancel</button>
      </div>
    </>
    }
    {gatekeeperOptionClick == 'erc20' && 
      <ERC20gatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields}/>
    }
    {gatekeeperOptionClick == 'erc721' && 
      <ERC721gatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields}/>
    }
    </>
  )
}

function ERC20gatekeeper({progress, setProgress, setGatekeeperInnerProgress, fields, setFields}){
  const [gatekeeperAddress, setGatekeeperAddress] = useState("")
  const [gatekeeperDecimal, setGatekeeperDecimal] = useState("")
  const [gatekeeperSymbol, setGatekeeperSymbol] = useState("")
  const [addressError, setAddressError] = useState(false);
  const [duplicateAddressError, setDuplicateAddressError] = useState(false);
  const [decimalError, setDecimalError] = useState(false);
  const [symbolError, setSymbolError] = useState(false);

  
  const [enableSave, setEnableSave] = useState(false)



  const handleGatekeeperAddressChange = (e) => {
    setAddressError(false)
    setEnableSave(false)
    setGatekeeperAddress(e.target.value)
    setGatekeeperDecimal("")
    setGatekeeperSymbol("")
  }

  const handleGatekeeperDecimalChange = (e) => {
    setDecimalError(false)
    setGatekeeperDecimal(e.target.value)
  }

  const handleGatekeeperSymbolChange = (e) => {
    setSymbolError(false)
    setGatekeeperSymbol(e.target.value)
  }



  async function handleSave(){
    // do some more error checking. 
    // check if the contract address is valid
    var valid = await validAddress(gatekeeperAddress)
    if(!valid){
      //set an error
      setAddressError(true)
      return
    }
    else{
      if(gatekeeperSymbol == ""){
        // set an error
        setSymbolError(true)
        return
      }
      if(gatekeeperDecimal == ""){
        // set an error 
        setDecimalError(true)
        return
      }
     
      const gatekeeperObj = {
        gatekeeperType: 'erc20',
        gatekeeperAddress: gatekeeperAddress,
        gatekeeperSymbol: gatekeeperSymbol,
        gatekeeperDecimal: gatekeeperDecimal,
      }

            console.log(1)
            console.log(fields.gatekeeper.rules)

            // add it if there are no rules
            if(fields.gatekeeper.rules.length == 0){
              var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
                gatekeeperCopy.push(gatekeeperObj)
                setFields({gatekeeper: {rules :gatekeeperCopy}})
                setGatekeeperInnerProgress(0);
            }
            // check if the contract address is already being used by another rule
            else{
            for(var i in fields.gatekeeper.rules){
              console.log(2)
              console.log(fields.gatekeeper.rules[i])
              if(fields.gatekeeper.rules[i].gatekeeperAddress == gatekeeperObj.gatekeeperAddress){
                setDuplicateAddressError(true)
                break;
              }

              // reached the end of our loop
              if(i == fields.gatekeeper.rules.length -1 && fields.gatekeeper.rules[i].gatekeeperAddress != gatekeeperObj.gatekeeperAddress){
                console.log(3)
                var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
                gatekeeperCopy.push(gatekeeperObj)
                setFields({gatekeeper: {rules :gatekeeperCopy}})
                setGatekeeperInnerProgress(0);
              }
            }
          }

    }
  }

  // auto fill the decimals and symbol fields
useEffect(async() =>{
  // wait until full address is input
  if(gatekeeperAddress.length == 42){
    setEnableSave(true)
    // check if it's valid
    var valid = await validAddress(gatekeeperAddress)
    // if it's valid, fill the decimals and symbol
    if(valid != false){
      try{
        var [symbol, decimal] = await erc20GetSymbolAndDecimal(gatekeeperAddress)
        setGatekeeperDecimal(decimal)
        setGatekeeperSymbol(symbol)
    }catch(e){
        console.log("can't autofill symbol and decimals for this address")
    }

    }
  }

},[gatekeeperAddress])

return(

  <>
        <h3> erc-20 balanceOf</h3>
        <div className="gatekeeper-address-input">
          <p>Contract Address </p>
          <input value={gatekeeperAddress} onChange={handleGatekeeperAddressChange} type="text"/>
          {addressError && 
          <div className="tab-error-msg">
            <p>This doesn't look like a valid contract address</p>
          </div>
          }
          {duplicateAddressError && 
          <div className="tab-error-msg">
            <p>Rule for this contract already exists</p>
          </div>
          }
        </div>

        <div className="gatekeeper-symbol-decimal-input">
          <div>
            <p>Symbol</p>
            <input value={gatekeeperSymbol} onChange={handleGatekeeperSymbolChange} type="text"/>
            {symbolError && 
            <div className="tab-error-msg">
              <p>Please enter a symbol</p>
            </div>
          }
          </div>

          <div>
            <p>Decimal </p>
            <input value={gatekeeperDecimal} onChange={handleGatekeeperDecimalChange} type="text"/>
            {decimalError && 
            <div className="tab-error-msg">
              <p>Please enter a decimal</p>
            </div>
          }
          </div>
        </div>
        
       
        <div className="gk-detail-buttons">
          <button className="gk-rule-cancel" onClick={() => {setGatekeeperInnerProgress(0)}}>cancel</button>
          <button className="gk-rule-save" disabled={!enableSave} onClick={handleSave}>save</button>
        </div>

</>
)
}

function ERC721gatekeeper({setGatekeeperInnerProgress, fields, setFields}){
  
  const [gatekeeperAddress, setGatekeeperAddress] = useState("")
  const [gatekeeperSymbol, setGatekeeperSymbol] = useState("")
  const [addressError, setAddressError] = useState(false);
  const [symbolError, setSymbolError] = useState(false);

  
  const [enableSave, setEnableSave] = useState(false)



  const handleGatekeeperAddressChange = (e) => {
    setAddressError(false)
    setEnableSave(false)
    setGatekeeperAddress(e.target.value)
    setGatekeeperSymbol("")
  }


  const handleGatekeeperSymbolChange = (e) => {
    setSymbolError(false)
    setGatekeeperSymbol(e.target.value)
  }



  async function handleSave(){
    // do some more error checking. 
    // check if the contract address is valid
    var valid = await validAddress(gatekeeperAddress)
    if(!valid){
      //set an error
      setAddressError(true)
      return
    }
    else{
      if(gatekeeperSymbol == ""){
        // set an error
        setSymbolError(true)
        return
      }

      const gatekeeperObj = {
        gatekeeperType: 'erc721',
        gatekeeperAddress: gatekeeperAddress,
        gatekeeperSymbol: gatekeeperSymbol,
      }
            // check if the contract address is already being used by another rule
            for(var i in fields.gatekeeper.rules){
              if(fields.gatekeeper.rules[i].gatekeeperAddress == gatekeeperObj.gatekeeperAddress){
                break;
              }
      
              // reached the end of our loop
              
              if(i == fields.gatekeeper.rules.length -1 && fields.gatekeeper.rules[i].gatekeeperAddress != gatekeeperObj.gatekeeperAddress){
                var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
                gatekeeperCopy.push(gatekeeperObj)
                setFields({gatekeeper: {rules: gatekeeperCopy}})
                setGatekeeperInnerProgress(0);
              }
            }

    }
  }

  // auto fill the decimals and symbol fields
useEffect(async() =>{
  // wait until full address is input
  if(gatekeeperAddress.length == 42){
    setEnableSave(true)
    // check if it's valid
    var valid = await validAddress(gatekeeperAddress)
    // if it's valid, fill the decimals and symbol
    if(valid != false){
      try{
        var symbol = await erc721GetSymbol(gatekeeperAddress)
        setGatekeeperSymbol(symbol)
    }catch(e){
        console.log("can't autofill symbol for this address")
    }

    }
  }

},[gatekeeperAddress])

return(

  <>
        <h3> erc-721 balanceOf</h3>
        <div className="gatekeeper-address-input">
          <p>Contract Address </p>
          <input value={gatekeeperAddress} onChange={handleGatekeeperAddressChange} type="text"/>
          {addressError && 
          <div className="tab-error-msg">
            <p>This doesn't look like a valid contract address</p>
          </div>
          }
        </div>

        <div className="gatekeeper-symbol-decimal-input">
          <div>
            <p>Symbol</p>
            <input value={gatekeeperSymbol} onChange={handleGatekeeperSymbolChange} type="text"/>
            {symbolError && 
            <div className="tab-error-msg">
              <p>Please enter a symbol</p>
            </div>
          }
          </div>

        </div>
        
        <div className="gk-detail-buttons">
          <button className="gk-rule-cancel" onClick={() => {setGatekeeperInnerProgress(0)}}>cancel</button>
          <button className="gk-rule-save" disabled={!enableSave} onClick={handleSave}>save</button>
        </div>

</>
)

}

function FinalizeTab({setProgress, handleClose, fields, setFields, mode, lockedAdminAddresses}){

  const walletAddress = useSelector(selectConnectedAddress);
  const existingGatekeeperRules = useSelector(selectDashboardRules);
  const [transactionError, setTransactionError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');

  const dispatch = useDispatch();


  const postData = async(submission) =>{
    var out = await axios.post('/updateSettings', submission);    
  }



 const handleSave = async() => {
  var finalSubmission = JSON.parse(JSON.stringify(fields));

  let whitelist = [];
  console.log(walletAddress)
  if(mode === 'new-org'){
    // add wallet address to whitelist if this is a new org. 
    // this will allow user to write data on initial setup.
    whitelist = [walletAddress]
  }

  else if(mode === 'existing-org'){
    // DO NOT push wallet address to whitelist. Only use the locked addresses.
    whitelist = lockedAdminAddresses;
  }

  
  // in both cases for new and existing orgs, we want to push the resolved ens and walletAddress, then remove duplicates
    const resolvedEns = await validAddress(fields.ens);
    finalSubmission.addresses.push(resolvedEns, walletAddress)
    console.log(finalSubmission)
    // now remove the duplicates
    finalSubmission.addresses = [...new Set(finalSubmission.addresses)]
    
    // set the fields in case user wants to go backwards

    setFields({addresses: finalSubmission.addresses})

    // we only want to send the new rules to the db
  finalSubmission.gatekeeper.rules = fields.gatekeeper.rules.filter(({ gatekeeperAddress: x }) => !Object.values(existingGatekeeperRules).some(({ gatekeeperAddress: y }) => y === x))
  var compressedSubmission = JSON.parse(JSON.stringify(finalSubmission))
  compressedSubmission.logo = compressedSubmission.logo.substring(0,25) + '...';

  var result = await signTransaction(walletAddress, compressedSubmission, whitelist);
  console.log(result)
  switch(result){
    case 0:
      setTransactionError('user cancelled signature request');
      setTransactionSuccess('')
      break;
    case 1:
      setTransactionError('metamask error');
      setTransactionSuccess('')
      break;
    case 2:
      setTransactionError('signature request rejected. Wallet is not an organization admin');
      setTransactionSuccess('')
      break;
    case 3:
      setTransactionSuccess('success');
      setTransactionError('')
      await postData(finalSubmission);
      if(mode == 'new-org') dispatch(addOrganization({name: fields.name, members: 0, logo: fields.logo, verified: false, ens: fields.ens}));
      else if(mode=='existing-org') {
        dispatch(updateDashboardInfo({name: fields.name, website: fields.website, discord: fields.discord, addresses: finalSubmission.addresses}))
        dispatch(populateDashboardRules(fields.ens))
      }
      handleClose();
      break;
  }
 }

  return(
    
    <div className="org-finalize-tab">
      <h2>All good! Hit save to finalize your dashboard.</h2>
      {transactionError != '' && 
      <div className="tab-error-msg" style={{textAlign: 'center'}}>
        <p>{transactionError}</p>
      </div>
      }
      {transactionSuccess != '' && 
      <div className="tab-success-msg" style={{textAlign: 'center'}}>
        <p>{transactionSuccess}</p>
      </div>
      }

      <button className={"modal-previous-btn"} onClick={() => {setProgress(3)}}><i class="fas fa-long-arrow-alt-left"></i></button>
      <button className={"modal-save-btn"} onClick={handleSave}>save</button>
    </div>
  )
}