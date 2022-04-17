import React, { useState, useEffect, useRef, useReducer } from 'react'
import axios from 'axios'
import Glyphicon from '@strongdm/glyphicon'
import { SettingsCheckpointBar, FinalizeSettingsCheckpointBar } from '../../features/checkpoint-bar/checkpoint-bar'
import Wallet, { validAddress, erc20GetSymbolAndDecimal, erc721GetSymbol, signTransaction, connectWallet } from '../../features//wallet/wallet'
import * as WebWorker from '../../app/worker-client';
import { useHistory, useParams } from 'react-router-dom'
import HelpModal from '../../helpers/modal/helpModal'
import '../../css/settings-buttons.css'
import '../../css/status-messages.css'
import '../../css/discord-add-bot.css'



import { useSelector, useDispatch } from 'react-redux';

import {
  selectConnectedBool,
  selectConnectedAddress,
} from '../../features/wallet/wallet-reducer';

import {
  selectDashboardInfo,
  updateDashboardInfo,
  populateDashboardInfo,
} from '../../features/dashboard/dashboard-info-reducer';
import { useForkRef } from '@mui/material'

import {
  applyDashboardRules,
  populateDashboardRules,
  selectDashboardRules,
} from '../../features/gatekeeper/gatekeeper-rules-reducer';

import {
  selectInstalledWidgets,
} from '../../features/dashboard/dashboard-widgets-reducer';

import {
  addOrganization,
  deleteOrganization,
} from '../../features/org-cards/org-cards-reducer';
import { showNotification } from '../notifications/notifications'



export default function Settings() {
  const [saveVisible, setSaveVisible] = useState(false)
  const { ens } = useParams()
  const dispatch = useDispatch();
  const dashboardInfo = useSelector(selectDashboardInfo)
  const dashboardRules = useSelector(selectDashboardRules)
  const history = useHistory();

  
  // keep a copy that will never change for signing transactions later;
  const lockedAdminAddresses = dashboardInfo.addresses || [];


  const [fields, setFields] = useReducer(
    (fields, newFields) => ({ ...fields, ...newFields }),
    {}
  )


  // don't allow direct URL access
  const checkHistory = () => {
    if (history.action === 'POP') {
      if (ens !== 'new') {
        history.push('/' + ens + '/dashboard')
      }
      else {
        history.push('/explore')
      }
    }
  }

  useEffect(() => {
    checkHistory();
    if (ens !== 'new') {
      if (dashboardInfo.name === '') {
        // grab the dashboard info
        dispatch(populateDashboardInfo(ens))
        dispatch(populateDashboardRules(ens))
      }
      else {
        setFields(dashboardInfo)
        setFields({
          gatekeeper: {
            rules: Object.values(dashboardRules),
            rulesToDelete: []
          }
        })
      }
    }
    else if (ens === 'new') {
      setFields({ name: '', logo: '', website: '', discord: '', addresses: [''], gatekeeper: { rules: [] }, ens: '' })
    }
  }, [])




  return (
    <div className="settings-container">
      <TabSelector fields={fields} setFields={setFields} lockedAdminAddresses={lockedAdminAddresses} />
    </div>
  );
}


function TabSelector({ fields, setFields, lockedAdminAddresses }) {

  const [progress, setProgress] = useState(0);
  const { ens } = useParams();
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const history = useHistory();
  const [tabHeader, setTabHeader] = useState('');

  useEffect(() => {
    if (ens !== 'new') {
      setProgress(1)
    }
  }, [])

  const handleExit = () => {
    if (ens === 'new') {
      history.push('/explore')
    }
    else if (ens !== 'new') {
      history.push('dashboard')
    }
  }

  return (
    <div className="settings-tab-selector">
      <div className="settings-top-level">
        <p className="left"></p>
        <p>{tabHeader}</p>
        <div className="right">
          <button className="exit-btn" onClick={handleExit}>exit</button>
        </div>
      </div>
      <div className="checkpoint settings">
        <SettingsCheckpointBar percent={progress * 25} />
      </div>
      {progress == 0 && <OrgEnsTab setProgress={setProgress} fields={fields} setFields={setFields} setTabHeader={setTabHeader} />}

      {progress == 1 && <OrgProfileTab hasImageChanged={hasImageChanged} setHasImageChanged={setHasImageChanged} setTabHeader={setTabHeader} lockedAdminAddresses={lockedAdminAddresses} setProgress={setProgress} fields={fields} setFields={setFields} />}

      {progress == 2 && <OrgAdminsTab setProgress={setProgress} fields={fields} setFields={setFields} setTabHeader={setTabHeader} />}


      {progress == 3 && <OrgGateKeeperTab setProgress={setProgress} fields={fields} setFields={setFields} setTabHeader={setTabHeader} />}
      {progress == 4 && <FinalizeTab lockedAdminAddresses={lockedAdminAddresses} setProgress={setProgress} fields={fields} setFields={setFields} setTabHeader={setTabHeader} />}


    </div>
  )
}


function OrgEnsTab({ setProgress, fields, setFields, setTabHeader }) {
  const [ens, setEns] = useState(fields.ens || "");
  const [validEns, setValidEns] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState({ error: false, msg: "" });
  const walletAddress = useSelector(selectConnectedAddress);
  const isConnected = useSelector(selectConnectedAddress);

  useEffect(() => {
    setTabHeader('🚀 Create a Dashboard');
  }, [])

  useEffect(() => {

    (async () => {

      // simple check to make sure we don't slow the program down with too many validAddress calls
      // clear the error msg
      setErrorMsg({ error: false, msg: "" });
      if (ens.endsWith('.eth')) {
        
        var valid = await validAddress(ens)
        
        if (valid == false) {
          setValidEns(false);
          setResolvedAddress("")
        }
        else {
          // check if this ens already exists in the system
          const doesExist = await axios.get('/doesEnsExist/' + ens)
          if (doesExist.data) {
            // already exists. set error msg
            setErrorMsg({ error: true, msg: "A dashboard with this ens already exists" })
          }
          else {
            //doesn't exist. good to go
            setValidEns(true)
            setResolvedAddress(valid.substring(0, 6) + '...' + valid.substring(35, 40))
          }

        }
      }
      else {
        setValidEns(false);
        setResolvedAddress("")
      }
    })();


  }, [ens])


  const updateInput = (e) => {
    setEns(e.target.value)
  }


  const handleNext = async () => {
    // check for beta whitelist

    
    const wl_res = await axios.post('/valid_wl', { address: walletAddress })

    if (wl_res.data == false) {
      setResolvedAddress('')
      setErrorMsg({ error: true, msg: 'sorry, we are only allowing certain wallets to create dashboards at this time. Feel free to look around!' })
    }

    else {
      setFields({ ens: ens });
      setProgress(1);
    }

  }


  return (
    <div className="org-ens-tab">
      <div className="tab-message neutral">
        <p>Enter your organization's ENS to initialize a dashboard </p>
      </div>
      <input style={{ width: "80%" }} disabled={!isConnected} className={`${errorMsg.error ? "error" : null}`} placeholder="e.g. calabara.eth" value={ens} onChange={updateInput} type="text" />
      {resolvedAddress != "" &&
        <p className="success"> {ens} resolves to {resolvedAddress} &#x1F517;</p>
      }
      {errorMsg.error &&
        <div className="tab-message error">
          <p>{errorMsg.msg}</p>
        </div>}
      <div className="settings-next-previous-ctr">
        <button disabled={!validEns} className={"next-btn " + (validEns ? 'enable' : null)} onClick={handleNext}> <i className="fas fa-long-arrow-alt-right"></i></button>
      </div>
    </div>
  )
}

function OrgProfileTab({ setProgress, fields, setFields, lockedAdminAddresses, hasImageChanged, setHasImageChanged, setTabHeader}) {
  const [name, setName] = useState(fields.name || "");
  const { ens } = useParams();
  const uploadedImage = useRef(null);
  const imageUploader = useRef(null);
  const [logoText, setLogoText] = useState('')
  const walletAddress = useSelector(selectConnectedAddress)
  const [transactionError, setTransactionError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const [nameErrorMsg, setNameErrorMsg] = useState({ error: false, msg: "" });
  const [websiteErrorMsg, setWebsiteErrorMsg] = useState({ error: false, msg: "" });


  const updateName = (e) => {
    if (nameErrorMsg.error) {
      setNameErrorMsg({ error: false, msg: "" });
    }
    setFields({ name: e.target.value })
  }

  const updateWebsite = (e) => {
    if (websiteErrorMsg.error) {
      setWebsiteErrorMsg({ error: false, msg: "" });
    }
    setFields({ website: e.target.value })
  }

  const updateDiscord = (e) => {
    setFields({ discord: e.target.value })
  }


  const handleImageUpload = e => {
    setHasImageChanged(true)

    const [file] = e.target.files;
    if (file) {
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFields({ logo: e.target.result })
        setLogoText(e.target.result.substring(0, 25) + '...')
      }

      reader.readAsDataURL(file);
    }
  }


  async function handleNext() {
    if (fields.name == "") {
      setNameErrorMsg({ error: true, msg: "name field cannot be left blank" })
      return;
    }
    else {
      
      const exists = await axios.post('/doesNameExist', { name: fields.name, ens: fields.ens })
      if (exists.data) {
        //name already exists
        setNameErrorMsg({ error: true, msg: "an organization with this name already exists" })
        return;

      }
    }
    if (fields.website != "") {
      if (fields.website.indexOf("http://") == 0 || fields.website.indexOf("https://") == 0) {
        setWebsiteErrorMsg({ error: true, msg: "please exclude http/https from your webpage link" });
        return;
      }
    }

    setProgress(2);

  }

  /* 
  the following needs to be done because when an existing org ('already has logo') is displayed, 
  the fields.logo state takes the value of the relative path in order for Webworker to process the images. 
  we want the webworker to process the images this way, but we need to update the fields.logo state to point
  to the blob returned from webworker, not the relative path. 
  
  tldr;; rel path -> webworker -> blob -> fields.logo = blob
  */

  useEffect(() => {
    setTabHeader('Organization Profile')
    if (ens !== 'new' && !hasImageChanged) {
      WebWorker.settingsProcessLogo().then(result => {
        const reader = new FileReader();
        reader.onload = () => {
          let base64data = reader.result;
          setFields({ logo: base64data })
        }
        reader.readAsDataURL(result);
        setHasImageChanged(true)
      })
    }
  }, [])

  const handleImgLoaded = (e) => {
    
  }

  const handleDeleteOrganization = async () => {
    var result = await signTransaction(walletAddress, { mode: 'delete' }, lockedAdminAddresses)
    switch (result) {
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
        history.push('/explore')
        break;
    }
  }

  return (
    <div className="org-profile-tab">
      <div className="profile-content">
        <div>
          <div className="profile-name-input">
            <input className={`${nameErrorMsg.error ? "error" : null}`} placeholder="e.g. calabara" value={fields.name} onChange={updateName} type="text" />
            {nameErrorMsg.error &&
              <div className="tab-message error">
                <p>{nameErrorMsg.msg}</p>
              </div>}
          </div>

          <div className="profile-website-input">
            <input placeholder="e.g. calabara.com" value={fields.website} onChange={updateWebsite} type="text" />
            {websiteErrorMsg.error &&
              <div className="tab-message error">
                <p>{websiteErrorMsg.msg}</p>
              </div>}
          </div>
          <div className="profile-discord-input">
            <input value={fields.discord} onChange={updateDiscord} type="text" />
          </div>
        </div>
        <div>
          <div className="profile-logo-input">
            <input placeholder="Logo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} ref={imageUploader} />
            <button className="logo-upload-btn" type="button" onClick={() => imageUploader.current.click()}>
              <div>
                {!hasImageChanged && <img data-src={fields.logo} onLoad={handleImgLoaded} />} {/* use webworker to get blob when displaying the logo*/}
                {hasImageChanged && <img src={fields.logo} />} {/* if they want to change the logo, we switch to non-webworker */}
                {fields.logo == '' && <span style={{ fontWeight: "bold" }}>upload</span>}
                {fields.logo != '' && <span style={{ fontWeight: "bold", marginLeft: "20px" }}>change</span>}
              </div>
            </button>
          </div>
          {ens !== 'new' &&
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
                <div className="tab-message error" style={{ textAlign: 'center', marginTop: '50px' }}>
                  <p>{transactionError}</p>
                </div>
              }
              {transactionSuccess != '' &&
                <div className="tab-success-msg" style={{ textAlign: 'center', marginTop: '50px' }}>
                  <p>{transactionSuccess}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>


      {/* Only show previous (back to ens) if this is a new org. If it's existing, don't allow nav to ens setup*/}
      <div className="settings-next-previous-ctr">
        {ens === 'new' && <button className={"previous-btn"} onClick={() => { setProgress(0) }}><i className="fas fa-long-arrow-alt-left"></i></button>}
        <button disabled={fields.name == ''} className="next-btn" onClick={handleNext}><i className="fas fa-long-arrow-alt-right"></i></button>
      </div>
    </div>
  )
}

function OrgAdminsTab({ setProgress, fields, setFields, setTabHeader }) {

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
    addressErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  async function addBlankAddress() {
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



  async function handleNext() {


    /* 1. error check the addresses.
       2. push addresses to master fields list
       3. move to the next section
    */
    let validChecksumAddresses = []
    for (var i in addresses) {
      if (addresses[i] != '') {
        const valid = await validAddress(addresses[i])
        if (!valid) {
          // if there was a problem, now is the time to tell the user and break from this loop
          setError(i);
          return;
        }
        else {
          validChecksumAddresses.push(valid)
        }
      }
    }
    setFields({
      addresses: validChecksumAddresses.filter((el) => {
        return el != '';
      })
    })
    setProgress(3);

  }


  useEffect(() => {

  }, [addresses])

  useEffect(() => {
    setTabHeader('Add Admins')
  }, [])


  return (
    <div className="org-admins-tab">
      <div className="tab-message neutral">
        <p> Admins will have write permissions to all settings and apps. Your address and the organization ens are automatically included. </p>
      </div>
      <div className="admins-content">

        {addresses.map((address, idx) => {
          return (
            <>
              <AdminAddressInput addressErrors={addressErrors} parentAddress={address} index={idx} updateElementInAddressList={updateElementInAddressList} />
              {addressErrors[idx] == true &&
                <div ref={addressErrorRef} className="tab-message error">
                  <p>This doesn't look like a valid address</p>
                </div>}
            </>
          )
        })}

        <button ref={addressesEndRef} onClick={addBlankAddress}> Add </button>

      </div>
      <div className="settings-next-previous-ctr">
        <button className={"previous-btn"} onClick={() => { setProgress(1) }}><i className="fas fa-long-arrow-alt-left"></i></button>
        <button className={"next-btn enable"} onClick={handleNext}><i className="fas fa-long-arrow-alt-right"></i></button>
      </div>
    </div>
  )
}

function AdminAddressInput({ addressErrors, parentAddress, index, updateElementInAddressList }) {
  const [address, setAddress] = useState(parentAddress || "")

  const handleAddressesChange = (e) => {
    setAddress(e.target.value)
    updateElementInAddressList(e, index)
  }

  return (
    <div className="admin-input">
      <input className={`${addressErrors[index] == true ? "error" : null}`} placeholder="e.g. 0x1234" value={address} onChange={handleAddressesChange} type="text" />
    </div>
  )
}

export function OrgGateKeeperTab({ setProgress, fields, setFields, setTabHeader }) {

  const [gatekeeperInnerProgress, setGatekeeperInnerProgress] = useState(0)
  const installedWidgets = useSelector(selectInstalledWidgets)
  const existingRules = useSelector(selectDashboardRules)



  useEffect(() => {
    setTabHeader('Gatekeeper')
  }, [])




  const removeGatekeeperRule = (array_index) => {
    // If the user is editing an organization and
    // a rule is deleted, we need to check on the widgets in which that rule is applied.
    // if they want to delete, set the gatekeeper.rulesToDelete state in fields and handle the actual deletion when the user saves at the end.
    // we only want to push values to rulesToDelete if the rule in question is an existing gk rule. Otherwise we'll just pretend like we never added it.
    // use existing rules to get a rule_id. If rule_id == undefined, then we'll just splice it from the rules field.
    // if rule_id is defined, we'll add it to our ruleToDelete array

    var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
    const ruleToDelete = JSON.parse(JSON.stringify(gatekeeperCopy[array_index]))

    let isRuleExisting = false;
    let deleteKey;

    Object.keys(existingRules).map((key) => {
      if (existingRules[key].guildId === ruleToDelete.guildId || existingRules[key].gatekeeperAddress === ruleToDelete.gatekeeperAddress) {
        isRuleExisting = true
        deleteKey = key
      }
    })


    if (!isRuleExisting) {
      gatekeeperCopy.splice(array_index, 1)
      setFields({ gatekeeper: { rules: gatekeeperCopy } })

    }
    else {
      gatekeeperCopy.splice(array_index, 1)
      setFields({ gatekeeper: { rules: gatekeeperCopy, rulesToDelete: fields.gatekeeper.rulesToDelete.concat(deleteKey) } })
    }
  }


  return (
    <div className="org-gatekeeper-tab">
      {(gatekeeperInnerProgress == 0) &&
        <div className="tab-message neutral">
          <p> Gatekeepers allow organizations to use token balance or discord role checks to offer different app functionality and displays for users via rules set for each app. <u style={{ cursor: 'pointer' }} onClick={() => { window.open('https://docs.calabara.com/gatekeeper') }}>Learn more</u></p>
        </div>
      }

      {(gatekeeperInnerProgress == 0) &&
        <div className="installed-gatekeepers">
          {fields.gatekeeper.rules.map((el, idx) => {
            return (
              <>
                <div className="gatekeeper-option" key={idx}>
                  {(el.gatekeeperType === 'erc721' || el.gatekeeperType === 'erc20') &&
                    <>
                      <p><b>Type:</b> <span className={el.gatekeeperType}>{el.gatekeeperType}</span></p>
                      <p><b>Symbol:</b> {el.gatekeeperSymbol}</p>
                      <p onClick={() => { window.open('https://etherscan.io/address/' + el.gatekeeperAddress) }}><button className="gatekeeper-address">{el.gatekeeperAddress.substring(0, 6)}...{el.gatekeeperAddress.substring(38, 42)} <i className="fas fa-external-link-alt"></i></button></p>
                      <button className="remove-gatekeeper-rule exit-btn" onClick={() => { removeGatekeeperRule(idx) }}><Glyphicon glyph="trash" /></button>

                    </>
                  }

                  {el.gatekeeperType === 'discord' &&
                    <>
                      <p><b>Type:</b> <span className={el.gatekeeperType}>{el.gatekeeperType}</span></p>
                      <p><b>Server:</b> {el.serverName}</p>
                      <span></span>
                      <button className="remove-gatekeeper-rule exit-btn" onClick={() => { removeGatekeeperRule(idx) }}><Glyphicon glyph="trash" /></button>
                    </>
                  }
                </div>
              </>
            )
          })}

          <button className="add-gatekeeper" onClick={() => { setGatekeeperInnerProgress(1) }}>Add gatekeeper rule</button>
        </div>
      }
      {(gatekeeperInnerProgress == 1) &&
        <GatekeeperOptions setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} />
      }
      {gatekeeperInnerProgress == 0 &&
        <div className="settings-next-previous-ctr">
          <button className={"previous-btn"} onClick={() => { setProgress(2) }}><i className="fas fa-long-arrow-alt-left"></i></button>
          <button className={"next-btn enable"} onClick={() => { setProgress(4) }}><i className="fas fa-long-arrow-alt-right"></i></button>
        </div>
      }
    </div>
  )
}

function GatekeeperOptions({ setGatekeeperInnerProgress, fields, setFields }) {

  const [gatekeeperOptionClick, setGatekeeperOptionClick] = useState('none')

  return (
    <div className="org-gatekeeper-tab">
      {(gatekeeperOptionClick == 'none') &&
        <>
          <h4 style={{ textAlign: "center", marginBottom: "20px" }}>choose a gatekeeper rule option</h4>
          <div className="available-gatekeeper-options">
            <button className="erc20-option" onClick={() => { setGatekeeperOptionClick('erc20') }}>ERC-20 balanceOf</button>
            <button className="discord-roles-option" onClick={() => { setGatekeeperOptionClick('discord-roles') }}>Discord Roles</button>
            <button className="erc721-option" onClick={() => { setGatekeeperOptionClick('erc721') }}>ERC-721 balanceOf</button>

          </div>
          <button className="gk-rule-cancel" onClick={() => { setGatekeeperInnerProgress(0) }}>cancel</button>
        </>
      }
      {gatekeeperOptionClick == 'erc20' &&
        <ERC20gatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} />
      }

      {gatekeeperOptionClick == 'discord-roles' &&
        <DiscordRoleGatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} />
      }

      {gatekeeperOptionClick == 'erc721' &&
        <ERC721gatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} />
      }
    </div>
  )
}


function ERC20gatekeeper({ progress, setProgress, setGatekeeperInnerProgress, fields, setFields }) {
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



  async function handleSave() {
    // do some more error checking. 
    // check if the contract address is valid
    var valid = await validAddress(gatekeeperAddress)
    if (!valid) {
      //set an error
      setAddressError(true)
      return
    }
    else {
      if (gatekeeperSymbol == "") {
        // set an error
        setSymbolError(true)
        return
      }
      if (gatekeeperDecimal == "") {
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



      // add it if there are no rules
      if (fields.gatekeeper.rules.length == 0) {
        var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
        gatekeeperCopy.push(gatekeeperObj)
        setFields({ gatekeeper: { rules: gatekeeperCopy } })
        setGatekeeperInnerProgress(0);
      }
      // check if the contract address is already being used by another rule
      else {
        for (var i in fields.gatekeeper.rules) {

          if (fields.gatekeeper.rules[i].gatekeeperAddress == gatekeeperObj.gatekeeperAddress) {
            setDuplicateAddressError(true)
            break;
          }

          // reached the end of our loop
          if (i == fields.gatekeeper.rules.length - 1 && fields.gatekeeper.rules[i].gatekeeperAddress != gatekeeperObj.gatekeeperAddress) {
            var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
            gatekeeperCopy.push(gatekeeperObj)
            setFields({ gatekeeper: { rules: gatekeeperCopy } })
            setGatekeeperInnerProgress(0);
          }
        }
      }

    }
  }

  // auto fill the decimals and symbol fields
  useEffect(async () => {
    // wait until full address is input
    if (gatekeeperAddress.length == 42) {
      setEnableSave(true)
      // check if it's valid
      var valid = await validAddress(gatekeeperAddress)
      // if it's valid, fill the decimals and symbol
      if (valid != false) {
        try {
          var [symbol, decimal] = await erc20GetSymbolAndDecimal(gatekeeperAddress)
          setGatekeeperDecimal(decimal)
          setGatekeeperSymbol(symbol)
        } catch (e) {
          
        }

      }
    }

  }, [gatekeeperAddress])

  return (

    <>
      <h3> erc-20 balanceOf</h3>
      <div className="gatekeeper-address-input">
        <p>Contract Address </p>
        <input value={gatekeeperAddress} onChange={handleGatekeeperAddressChange} type="text" />
        {addressError &&
          <div className="tab-message error">
            <p>This doesn't look like a valid contract address</p>
          </div>
        }
        {duplicateAddressError &&
          <div className="tab-message error">
            <p>Rule for this contract already exists</p>
          </div>
        }
      </div>

      <div className="gatekeeper-symbol-decimal-input">
        <div>
          <p>Symbol</p>
          <input value={gatekeeperSymbol} onChange={handleGatekeeperSymbolChange} type="text" />
          {symbolError &&
            <div className="tab-message error">
              <p>Please enter a symbol</p>
            </div>
          }
        </div>

        <div>
          <p>Decimal </p>
          <input value={gatekeeperDecimal} onChange={handleGatekeeperDecimalChange} type="text" />
          {decimalError &&
            <div className="tab-message error">
              <p>Please enter a decimal</p>
            </div>
          }
        </div>
      </div>


      <div className="gk-detail-buttons">
        <button className="gk-rule-cancel" onClick={() => { setGatekeeperInnerProgress(0) }}>cancel</button>
        <button className="gk-rule-save" disabled={!enableSave} onClick={handleSave}>save</button>
      </div>

    </>
  )
}

function ERC721gatekeeper({ setGatekeeperInnerProgress, fields, setFields }) {

  const [gatekeeperAddress, setGatekeeperAddress] = useState("")
  const [gatekeeperSymbol, setGatekeeperSymbol] = useState("")
  const [addressError, setAddressError] = useState(false);
  const [symbolError, setSymbolError] = useState(false);
  const [duplicateAddressError, setDuplicateAddressError] = useState(false);



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


  async function handleSave() {
    // do some more error checking. 
    // check if the contract address is valid
    var valid = await validAddress(gatekeeperAddress)
    if (!valid) {
      //set an error
      setAddressError(true)
      return
    }
    else {
      if (gatekeeperSymbol == "") {
        // set an error
        setSymbolError(true)
        return
      }
      const gatekeeperObj = {
        gatekeeperType: 'erc721',
        gatekeeperAddress: gatekeeperAddress,
        gatekeeperSymbol: gatekeeperSymbol,
      }

      // add it if there are no rules
      if (fields.gatekeeper.rules.length == 0) {
        var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
        gatekeeperCopy.push(gatekeeperObj)
        setFields({ gatekeeper: { rules: gatekeeperCopy } })
        setGatekeeperInnerProgress(0);
      }
      // check if the contract address is already being used by another rule
      else {
        for (var i in fields.gatekeeper.rules) {

          if (fields.gatekeeper.rules[i].gatekeeperAddress == gatekeeperObj.gatekeeperAddress) {
            setDuplicateAddressError(true)
            break;
          }

          // reached the end of our loop
          if (i == fields.gatekeeper.rules.length - 1 && fields.gatekeeper.rules[i].gatekeeperAddress != gatekeeperObj.gatekeeperAddress) {
            var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
            gatekeeperCopy.push(gatekeeperObj)
            setFields({ gatekeeper: { rules: gatekeeperCopy } })
            setGatekeeperInnerProgress(0);
          }
        }
      }

    }
  }

  // auto fill the decimals and symbol fields
  useEffect(async () => {
    // wait until full address is input
    if (gatekeeperAddress.length == 42) {
      setEnableSave(true)
      // check if it's valid
      var valid = await validAddress(gatekeeperAddress)
      // if it's valid, fill the decimals and symbol
      if (valid != false) {
        try {
          var symbol = await erc721GetSymbol(gatekeeperAddress)
          setGatekeeperSymbol(symbol)
        } catch (e) {
          
        }

      }
    }

  }, [gatekeeperAddress])

  return (

    <>
      <h3> erc-721 balanceOf</h3>
      <div className="gatekeeper-address-input">
        <p>Contract Address </p>
        <input value={gatekeeperAddress} onChange={handleGatekeeperAddressChange} type="text" />
        {addressError &&
          <div className="tab-message error">
            <p>This doesn't look like a valid contract address</p>
          </div>
        }
        {duplicateAddressError &&
          <div className="tab-message error">
            <p>Rule for this contract already exists</p>
          </div>
        }
      </div>

      <div className="gatekeeper-symbol-decimal-input">
        <div>
          <p>Symbol</p>
          <input value={gatekeeperSymbol} onChange={handleGatekeeperSymbolChange} type="text" />
          {symbolError &&
            <div className="tab-message error">
              <p>Please enter a symbol</p>
            </div>
          }
        </div>

      </div>

      <div className="gk-detail-buttons">
        <button className="gk-rule-cancel" onClick={() => { setGatekeeperInnerProgress(0) }}>cancel</button>
        <button className="gk-rule-save" disabled={!enableSave} onClick={handleSave}>save</button>
      </div>

    </>
  )

}

function DiscordRoleGatekeeper({ setGatekeeperInnerProgress, fields, setFields }) {
  const [guildId, setGuildId] = useState('');
  const [guildName, setGuildName] = useState('');
  const [discordRuleState, setDiscordRuleState] = useState('')
  const [guildRoles, setGuildRoles] = useState('');
  const [popoutFired, setPopoutFired] = useState(false);
  const [isBotVerified, setIsBotVerified] = useState(false);
  const [botFailureMessage, setBotFailureMessage] = useState('');
  const walletAddress = useSelector(selectConnectedAddress)

  const ens = fields.ens;

  // on tab load, check if we already have a guild registered for this ens.
  // if we do, set the guildId and allow them to update if neccessary
  // otherwise, allow them to add one
  useEffect(() => {
    (async () => {
      await fetchGuildInfo();
    })();
  }, [])


  const fetchGuildInfo = async () => {
    const resp = await axios.post('/discord/getGuildProperties', { ens: ens });
    if (resp.data === 'guild does not exist') {
      setDiscordRuleState('no rule')
      return
    }
    else {
      setDiscordRuleState('rule exists')
      
      setGuildId(resp.data.id)
      setGuildName(resp.data.name);
      setGuildRoles(resp.data.roles);
      return
    }
  }



  const addBot = async () => {
    setPopoutFired(true)
    setBotFailureMessage('')
    //pass guildId as autofill
    let popout;
    if (process.env.NODE_ENV === 'development') {
      popout = window.open(`https://discord.com/api/oauth2/authorize?client_id=895719351406190662&permissions=0&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Foauth%2Fdiscord&response_type=code&scope=identify%20bot%20applications.commands&state=${walletAddress},bot,${ens}`, 'popUpWindow', 'height=700,width=600,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')

    }

    else if (process.env.NODE_ENV === 'production') {
      popout = window.open(`https://discord.com/api/oauth2/authorize?client_id=895719351406190662&permissions=0&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Foauth%2Fdiscord&response_type=code&scope=identify%20bot%20applications.commands&state=${walletAddress},bot,${ens}`, 'popUpWindow', 'height=700,width=600,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
    }

    var pollTimer = window.setInterval(async function () {
      if (popout.closed !== false) {
        window.clearInterval(pollTimer);
        setPopoutFired(false);
        await verifyBot();
      }
    }, 1000);

  }


  // if there was a problem adding, let the user know and reset the whole process
  // otherwise, set a success message

  const verifyBot = async () => {
    const resp = await axios.post('/discord/getGuildProperties', { ens: ens })
    switch (resp.data) {
      case 'guild does not exist':
        setIsBotVerified(false);
        setBotFailureMessage('bot was not added')
        return;
      default:
        setIsBotVerified(true);
        setDiscordRuleState('rule exists')
        setGuildId(resp.data.id)
        setGuildName(resp.data.name);
        setGuildRoles(resp.data.roles);
        return
    }

  }
  const calculateColor = (decimal) => {
    if (decimal == 0) {
      return ['rgba(211, 211, 211, 1)', 'rgba(18, 52, 86, 0.3)']
    }
    return ['rgb(' + ((decimal >> 16) & 0xff) + ',' + ((decimal >> 8) & 0xff) + ',' + (decimal & 0xff) + ')',
    'rgba(' + ((decimal >> 16) & 0xff) + ',' + ((decimal >> 8) & 0xff) + ',' + (decimal & 0xff) + ',0.3)']
  }


  const addDiscordRule = () => {
    const gatekeeperObj = {
      gatekeeperType: 'discord',
      serverName: guildName,
      guildId: guildId
    }


    let gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));


    // add it if there are no rules
    if (fields.gatekeeper.rules.length == 0) {
      gatekeeperCopy.push(gatekeeperObj)
      setFields({ gatekeeper: { rules: gatekeeperCopy } })
    }
    // check if discord is already setup. If so, just replace the entry in rules
    else {
      for (var i in fields.gatekeeper.rules) {

        if (fields.gatekeeper.rules[i].gatekeeperType === 'discord') {
          //gatekeeperCopy.splice(i, 1);
          gatekeeperCopy[i] = gatekeeperObj
          break;
        }

        // reached the end of our loop
        if (i == fields.gatekeeper.rules.length - 1 && fields.gatekeeper.rules[i].gatekeeperType !== 'discord') {
          gatekeeperCopy.push(gatekeeperObj)
        }

      }
      setFields({ gatekeeper: { rules: gatekeeperCopy } })
    }
    setGatekeeperInnerProgress(0);
  }




  return (

    <>
      {discordRuleState === 'no rule' &&
        <>
          <div className="discord-add-bot-container">
            <button className={'discord-add-bot ' + (popoutFired ? 'loading' : '')} onClick={addBot}>{popoutFired ? 'check popup window' : 'add bot'}</button>
          </div>

          {(!isBotVerified && botFailureMessage != '') &&
            <div style={{ width: '100%' }} className="tab-message error">
              <p>{botFailureMessage}</p>
            </div>
          }
          <div className="gk-detail-buttons" style={{ width: '100%' }}>
            <button className="gk-rule-cancel" style={{ width: '100%' }} onClick={() => { setGatekeeperInnerProgress(0) }}>cancel</button>
          </div>
        </>
      }
      {(guildRoles != '' && guildName != null) &&
        <>

          <div className="discord-guild-info">
            <div className="discord-guild-name">
              <p className="discord-name-header">server name</p>
              <p>{guildName}</p>
              <button className={'discord-add-bot ' + (popoutFired ? 'loading' : '')} onClick={addBot}>{popoutFired ? 'check popup window' : 'update server link'}</button>
            </div>
            <div className="discord-guild-roles">
              <p className="discord-roles-header">server roles</p>
              {guildRoles.map((val) => {
                return <span style={{ backgroundColor: calculateColor(val.color)[1], color: calculateColor(val.color)[0] }}><p>{val.name}</p></span>
              })}
            </div>
          </div>

          <div className="settings-next-previous-ctr">
            <button className="next-btn enable" disabled={!guildName} onClick={addDiscordRule}><i className="fas fa-long-arrow-alt-right"></i></button>
          </div>
        </>
      }


    </>
  )


}



export function FinalizeTab({ setProgress, fields, setFields, lockedAdminAddresses, setTabHeader }) {

  const walletAddress = useSelector(selectConnectedAddress);
  const isConnected = useSelector(selectConnectedBool)
  const existingGatekeeperRules = useSelector(selectDashboardRules);
  const [transactionError, setTransactionError] = useState('');
  const { ens } = useParams();
  const history = useHistory();


  const dispatch = useDispatch();

  useEffect(() => {
    setTabHeader('Finalize')
  }, [])

  const postData = async (submission) => {
    var out = await axios.post('/updateSettings', submission);
  }

  const handleClose = () => {
    history.push('/' + fields.ens + '/dashboard')
  }

  const handleSave = async () => {
    var finalSubmission = JSON.parse(JSON.stringify(fields));

    let whitelist = [];
    if (ens === 'new') {
      // add wallet address to whitelist if this is a new org. 
      // this will allow user to write data on initial setup.
      whitelist = [walletAddress]
    }

    else if (ens !== 'new') {
      // DO NOT push wallet address to whitelist. Only use the locked addresses.
      whitelist = lockedAdminAddresses;
    }


    // in both cases for new and existing orgs, we want to push the resolved ens and walletAddress, then remove duplicates
    const resolvedEns = await validAddress(fields.ens);
    finalSubmission.addresses.push(resolvedEns, walletAddress)
    
    // now remove the duplicates
    finalSubmission.addresses = [...new Set(finalSubmission.addresses)]

    // set the fields in case user wants to go backwards

    setFields({ addresses: finalSubmission.addresses })

    // we only want to send the new rules to the db


    let ruleDuplicates = fields.gatekeeper.rules.filter(({ gatekeeperAddress: gk_addy1, guildId: gid1 }) => !Object.values(existingGatekeeperRules).some(({ gatekeeperAddress: gk_addy2, guildId: gid2 }) => (gk_addy2 === gk_addy1 && gid1 === gid2)))
    //let discordDuplicates = fields.gatekeeper.rules.filter(({ guildId: gid1 }) => !Object.values(existingGatekeeperRules).some(({ guildId: gid2 }) => gid1 === gid2))


    

    finalSubmission.gatekeeper.rules = ruleDuplicates

    var compressedSubmission = JSON.parse(JSON.stringify(finalSubmission))
    compressedSubmission.logo = compressedSubmission.logo.substring(0, 25) + '...';





    var result = await signTransaction(compressedSubmission, whitelist);
    switch (result) {
      case 0:
        showNotification('error', 'error', 'user cancelled signature request');

        break;
      case 1:
        showNotification('error', 'error', 'metamask error');
        break;
      case 2:
        showNotification('error', 'error', 'signature request rejected. Wallet is not an organization admin');

        break;
      case 3:
        await postData(finalSubmission);
        if (ens === 'new') dispatch(addOrganization({ name: fields.name, members: 0, logo: fields.logo, verified: false, ens: fields.ens }));
        else if (ens !== 'new') {
          dispatch(updateDashboardInfo({ name: fields.name, website: fields.website, discord: fields.discord, addresses: finalSubmission.addresses }))
          dispatch(populateDashboardRules(fields.ens))
        }
        showNotification('saved successfully', 'success', 'your changes were successfully saved')
        handleClose();
        break;
      case 4:
        showNotification('error', 'error', 'please connect your wallet to write data');

        

    }
  }

  return (

    <div className="org-finalize-tab">
      <div>
        <h1>🎉🎉🎉</h1>
        <h2>That was easy. Click <b>finish</b> to save your changes.</h2>
      </div>
      <div className="settings-next-previous-ctr">
        <button className={"previous-btn"} onClick={() => {setProgress(3)}}><i class="fas fa-long-arrow-alt-left"></i></button>
        <button className={"finish-btn enable"} onClick={handleSave}>Finish</button>
      </div>
    </div>
  )
}

