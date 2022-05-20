import React, { useEffect, useReducer, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import BackButton from '../back-button/back-button'
import axios from 'axios'
import '../../css/settings.css'
import '../../css/discord-add-bot.css'
import { showNotification } from '../notifications/notifications'
import { selectConnectedAddress } from '../wallet/wallet-reducer'
import { selectDashboardInfo } from '../dashboard/dashboard-info-reducer'
import { selectDashboardRules } from '../gatekeeper/gatekeeper-rules-reducer'
import { addOrganization, selectLogoCache } from '../org-cards/org-cards-reducer'
import Glyphicon from '@strongdm/glyphicon'
import DeleteGkRuleModal from './delete-gk-rule-modal'
import { useDiscordAuth } from '../hooks/useDiscordAuth'
import useDashboardRules from '../hooks/useDashboardRules'
import useDashboard from '../hooks/useDashboard'
import useOrganization from '../hooks/useOrganization'
import useCommon from '../hooks/useCommon'
import useWallet from '../hooks/useWallet'

export default function SettingsManager() {
    const [fieldsReady, setFieldsReady] = useState(false)
    const history = useHistory();
    const { ens } = useParams();
    const dashboardInfo = useSelector(selectDashboardInfo);
    const dashboardRules = useSelector(selectDashboardRules)
    const [nameErrorMsg, setNameErrorMsg] = useState({ error: false, msg: "" });
    const [websiteErrorMsg, setWebsiteErrorMsg] = useState({ error: false, msg: "" });
    const [addressErrors, setAddressErrors] = useState([""]);
    const [addresses, setAddresses] = useState([""]);
    const infoRef = useRef(null);
    const adminRef = useRef(null);



    const [fields, setFields] = useReducer(
        (fields, newFields) => ({ ...fields, ...newFields }),
        {}
    )



    const standardProps = {
        fields,
        setFields,
    }

    const infoErrorController = {
        nameErrorMsg,
        setNameErrorMsg,
        websiteErrorMsg,
        setWebsiteErrorMsg,
        infoRef
    }

    const adminErrorController = {
        addressErrors,
        setAddressErrors,
        addresses,
        setAddresses,
        adminRef
    }

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
            setFields(dashboardInfo)
            setAddresses(dashboardInfo.addresses)
            setFields({
                gatekeeper: {
                    rules: Object.values(dashboardRules),
                    rulesToDelete: []
                }
            })
        }
        else if (ens === 'new') {
            setFields({ name: '', logo: '', website: '', discord: '', addresses: [''], gatekeeper: { rules: [] }, ens: '' })
        }
        setFieldsReady(true)
    }, [])
    return (
        <>
            <BackButton link={ens != 'new' ? 'dashboard' : '/explore'} text={"back"} />
            <div className="settings-manager">
                {fieldsReady &&
                    <>
                        <SettingsComponentSelector standardProps={standardProps} infoErrorController={infoErrorController} adminErrorController={adminErrorController} />

                        {fields.ens != '' &&
                            <SaveComponent standardProps={standardProps} infoErrorController={infoErrorController} adminErrorController={adminErrorController} />
                        }
                    </>
                }
            </div>
        </>
    )
}


function SettingsComponentSelector({ standardProps, infoErrorController, adminErrorController }) {
    const { fields, setFields } = standardProps
    const [hasImageChanged, setHasImageChanged] = useState(false);
    const { ens } = useParams();


    return (
        <div className="settings-components">
            {(ens === 'new' && !fields.ens) &&
                <div className="component">
                    <p className="component-header">Organization ENS</p>
                    <OrganizationENSComponent standardProps={standardProps} infoErrorController={infoErrorController} hasImageChanged={hasImageChanged} setHasImageChanged={setHasImageChanged} />
                </div>
            }
            {fields.ens &&
                <>
                    <div className="component">
                        <p className="component-header">Organization Profile</p>
                        <OrganizationInfoComponent standardProps={standardProps} infoErrorController={infoErrorController} hasImageChanged={hasImageChanged} setHasImageChanged={setHasImageChanged} />
                    </div>
                    <div className="component">
                        <p className="component-header">Organization Admins</p>
                        <OrganizationAdminsComponent adminErrorController={adminErrorController} />
                    </div>
                    <div className="component">
                        <p className="component-header">Gatekeeper Rules</p>
                        <OrganizationGatekeeperComponent standardProps={standardProps} />
                    </div>
                </>
            }
        </div>
    )
}

function OrganizationENSComponent({ standardProps }) {
    const { fields, setFields } = standardProps
    const [ens, setEns] = useState("");
    const [validEns, setValidEns] = useState(false);
    const [resolvedAddress, setResolvedAddress] = useState("");
    const [errorMsg, setErrorMsg] = useState({ error: false, msg: "" });
    const walletAddress = useSelector(selectConnectedAddress);
    const isConnected = useSelector(selectConnectedAddress);
    const history = useHistory();
    const { validAddress } = useWallet();

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
                    const doesExist = await axios.get('/organizations/doesEnsExist/' + ens)
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


        const wl_res = await axios.post('/user/valid_wl', { address: walletAddress })

        if (wl_res.data == false) {
            setResolvedAddress('')
            setErrorMsg({ error: true, msg: 'sorry, we are only allowing certain wallets to create dashboards at this time. Feel free to look around!' })
        }
        else {
            setFields({ ens: ens });
        }

    }


    return (
        <div className="org-ens-tab">
            <div className="tab-message neutral">
                <p>Enter your organization's ENS to initialize a dashboard </p>
            </div>
            <input style={{ width: "80%" }} disabled={!isConnected} className={`${errorMsg.error ? "error" : null}`} placeholder="e.g. calabara.eth" value={ens} onChange={updateInput} type="text" />
            {resolvedAddress != "" &&
                <div className="tab-message success">
                    <p className="success"> {ens} resolves to {resolvedAddress} &#x1F517;</p>
                </div>
            }
            {errorMsg.error &&
                <div className="tab-message error" style={{ width: '80%' }}>
                    <p>{errorMsg.msg}</p>
                </div>
            }
            <div className="settings-next-previous-ctr" style={{ width: '80%', marginTop: '1em' }}>
                <button disabled={!validEns} className={"next-btn " + (validEns ? 'enable' : null)} onClick={handleNext}> <i className="fas fa-long-arrow-alt-right"></i></button>
            </div>
        </div>
    )
}

function OrganizationInfoComponent({ standardProps, hasImageChanged, setHasImageChanged, infoErrorController }) {
    const { fields, setFields } = standardProps
    const { nameErrorMsg, setNameErrorMsg, websiteErrorMsg, setWebsiteErrorMsg, infoRef } = infoErrorController;
    const imageUploader = useRef(null);
    const walletAddress = useSelector(selectConnectedAddress);
    const dispatch = useDispatch();
    const { ens } = useParams();
    const history = useHistory();
    const logoCache = useSelector(selectLogoCache);
    const [logo, setLogo] = useState(logoCache[fields.logo])
    const [logoPath, setLogoPath] = useState(fields.logo);
    const { deleteOrganization } = useOrganization();
    const { authenticated_post } = useCommon();


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


    function b64toBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }


    const handleImageUpload = e => {
        setHasImageChanged(true)

        const [file] = e.target.files;
        if (file) {

            const reader = new FileReader();
            reader.onload = (e) => {

                const blob = b64toBlob(e.target.result);
                const blobUrl = URL.createObjectURL(blob);

                setFields({ logo: e.target.result, logoPath: fields.logo, logoBlob: blobUrl })
                setLogo(blobUrl)
            }

            reader.readAsDataURL(file);
        }
    }



    const handleDeleteOrganization = async () => {

        let deleteResult = await authenticated_post('/settings/deleteOrganization', { ens: fields.ens });
        if (deleteResult) {
            deleteOrganization(fields.ens);
            showNotification('success', 'success', 'organization successfully deleted')
            history.push('/explore')
        }
    }


    return (
        <div className="org-profile-tab" ref={infoRef}>
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
                    <div className="profile-logo-input">
                        <input placeholder="Logo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} ref={imageUploader} />
                        <button className="logo-upload-btn" type="button" onClick={() => imageUploader.current.click()}>
                            <div>
                                <img src={logo} /> {/* use webworker to get blob when displaying the logo*/}
                            </div>
                        </button>
                    </div>

                </div>
                <div>

                    {ens !== 'new' &&
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
                    }
                </div>
            </div>


        </div>
    )
}


function OrganizationAdminsComponent({ adminErrorController }) {
    const { addressErrors, setAddressErrors, addresses, setAddresses, adminRef } = adminErrorController;



    async function addBlankAddress() {

        setAddresses(addresses.concat(''))
    }

    const updateElementInAddressList = (e, index) => {

        setAddressErrors([""])
        let addressesCopy = JSON.parse(JSON.stringify(addresses));
        let addressToUpdate = e.target.value;
        addressesCopy[index] = addressToUpdate;

        setAddresses(addressesCopy);

    }



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
                                <div ref={adminRef} className="tab-message error" style={{ width: '100%', margin: '0 auto' }}>
                                    <p>This doesn't look like a valid address</p>
                                </div>}
                        </>
                    )
                })}

                <button onClick={addBlankAddress}> Add </button>

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

function OrganizationGatekeeperComponent({ standardProps }) {
    const { fields, setFields } = standardProps;
    const [gatekeeperInnerProgress, setGatekeeperInnerProgress] = useState(0);
    const existingRules = Object.keys(useSelector(selectDashboardRules));
    const [addGatekeeperOptionClick, setAddGatekeeperOptionClick] = useState('none')
    const [doesDiscordExist, setDoesDiscordExist] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalIndex, setDeleteModalIndex] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);

    const [botAuth, setBotAuth] = useState(null)
    const [userAuth, setUserAuth] = useState(null)

    const { onOpen: userOnOpen, authorization: userAuthorization, error: userError, isAuthenticating: userIsAuthenticating } = useDiscordAuth("identify", userAuth, setUserAuth)
    const { onOpen: botOnOpen, authorization: botAuthorization, error: botError, isAuthenticating: botIsAuthenticating } = useDiscordAuth('bot', botAuth, setBotAuth, selectedServer)


    let discordIntegrationProps = {
        userOnOpen,
        userAuthorization,
        userError,
        userIsAuthenticating,
        botOnOpen,
        botAuthorization,
        botError,
        botIsAuthenticating,
        userAuth,
        setUserAuth,
        botAuth,
        setBotAuth,
        selectedServer,
        setSelectedServer
    }

    useEffect(() => {
        fields.gatekeeper.rules.map((el) => {
            if (el.gatekeeperType === 'discord')
                setDoesDiscordExist(true)
            return;
        })
    }, [])



    const removeGatekeeperRule = (array_index) => {
        // if they want to delete, set the gatekeeper.rulesToDelete state in fields and handle the actual deletion when the user saves at the end.
        // we only want to push values to rulesToDelete if the rule in question is an existing gk rule (from prior settings state). Otherwise we'll just pretend like we never added it.
        // use existing rules to get a rule_id. If rule_id == undefined, then we'll just splice it from the rules field.
        // if rule_id is defined, we'll add it to our ruleToDelete array

        var gatekeeperCopy = JSON.parse(JSON.stringify(fields.gatekeeper.rules));
        const ruleToDelete = JSON.parse(JSON.stringify(gatekeeperCopy[array_index]))

        if (gatekeeperCopy[array_index].gatekeeperType === 'discord') setDoesDiscordExist(false)


        // if array_index for existing rules is undefined, we know it's a new rule

        if (existingRules[array_index] != null) {
            // rule exists, need to keep track of the rule we want to delete
            gatekeeperCopy.splice(array_index, 1)
            setFields({ gatekeeper: { rules: gatekeeperCopy, rulesToDelete: fields.gatekeeper.rulesToDelete.concat(existingRules[array_index]) } })
        }

        else {
            // rule doesn't exist. don't have to worry about existing rules
            gatekeeperCopy.splice(array_index, 1)
            setFields({ gatekeeper: { rules: gatekeeperCopy } })
        }
    }

    const handleAddGatekeeperClick = (type) => {
        setAddGatekeeperOptionClick(type)
        setGatekeeperInnerProgress(1)
    }

    const handleDeleteGkRule = (idx) => {
        removeGatekeeperRule(idx)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }


    return (
        <div className="org-gatekeeper-tab">
            {(gatekeeperInnerProgress == 0) &&
                <>
                    <div className="tab-message neutral">
                        <p> Gatekeepers allow organizations to use token balance or discord role checks to offer different app functionality and displays for users via rules set for each app. <u style={{ cursor: 'pointer' }} onClick={() => { window.open('https://docs.calabara.com/gatekeeper') }}>Learn more</u></p>
                    </div>



                    <div className="installed-gatekeepers">
                        {fields.gatekeeper.rules.map((el, idx) => {
                            return (
                                <>
                                    <div className="gatekeeper-option" key={idx}>
                                        {(el.gatekeeperType === 'erc721' || el.gatekeeperType === 'erc20') &&
                                            <>
                                                <button className="remove-gatekeeper-rule exit-btn" onClick={() => { setModalOpen(true); setDeleteModalIndex(idx) }}><Glyphicon glyph="trash" /></button>
                                                <p><b>Type:</b> <span className={el.gatekeeperType}>{el.gatekeeperType}</span></p>
                                                <p><b>Symbol:</b> {el.gatekeeperSymbol}</p>
                                                <button onClick={() => { window.open('https://etherscan.io/address/' + el.gatekeeperAddress) }} className="gatekeeper-config">{el.gatekeeperAddress.substring(0, 6)}...{el.gatekeeperAddress.substring(38, 42)} <i className="fas fa-external-link-alt"></i></button>
                                            </>
                                        }

                                        {el.gatekeeperType === 'discord' &&
                                            <>
                                                <button className="remove-gatekeeper-rule exit-btn" onClick={() => { setModalOpen(true); setDeleteModalIndex(idx) }}><Glyphicon glyph="trash" /></button>
                                                <p><b>Type:</b> <span className={el.gatekeeperType}>{el.gatekeeperType}</span></p>
                                                <p><b>Server:</b> {el.serverName}</p>
                                                <button className="gatekeeper-config" onClick={() => handleAddGatekeeperClick('discord-roles')}>view config</button>
                                            </>
                                        }
                                    </div>
                                </>
                            )
                        })}

                    </div>
                    {modalOpen && <DeleteGkRuleModal modalOpen={modalOpen} handleClose={handleModalClose} handleDeleteGkRule={handleDeleteGkRule} idx={deleteModalIndex} />}
                    <div className="gatekeeper-option-buttons">
                        <button className="erc20-option" onClick={() => { handleAddGatekeeperClick('erc20') }}>erc20</button>
                        <button className="erc721-option" onClick={() => { handleAddGatekeeperClick('erc721') }}>erc721</button>
                        {!doesDiscordExist && <button className="discord-roles-option" onClick={() => { handleAddGatekeeperClick('discord-roles') }}>discord</button>}

                    </div>
                </>
            }
            {gatekeeperInnerProgress === 1 &&
                <GatekeeperOptions discordIntegrationProps={discordIntegrationProps} setGatekeeperInnerProgress={setGatekeeperInnerProgress} standardProps={standardProps} addGatekeeperOptionClick={addGatekeeperOptionClick} />
            }

        </div>
    )
}


function GatekeeperOptions({ setGatekeeperInnerProgress, standardProps, addGatekeeperOptionClick, discordIntegrationProps }) {
    const { fields, setFields } = standardProps
    const [gatekeeperOptionClick, setGatekeeperOptionClick] = useState('none')

    const handleClick = (type) => {
        setGatekeeperOptionClick(type)
        setGatekeeperInnerProgress(1)
    }

    return (
        <div className="org-gatekeeper-options">
            {addGatekeeperOptionClick == 'erc20' &&
                <ERC20gatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} />
            }

            {addGatekeeperOptionClick == 'discord-roles' &&
                <DiscordRoleGatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} discordIntegrationProps={discordIntegrationProps} />
            }

            {addGatekeeperOptionClick == 'erc721' &&
                <ERC721gatekeeper setGatekeeperInnerProgress={setGatekeeperInnerProgress} fields={fields} setFields={setFields} />
            }
        </div>
    )
}


function ERC20gatekeeper({ setGatekeeperInnerProgress, fields, setFields }) {
    const [gatekeeperAddress, setGatekeeperAddress] = useState("")
    const [gatekeeperDecimal, setGatekeeperDecimal] = useState("")
    const [gatekeeperSymbol, setGatekeeperSymbol] = useState("")
    const [addressError, setAddressError] = useState(false);
    const [duplicateAddressError, setDuplicateAddressError] = useState(false);
    const [decimalError, setDecimalError] = useState(false);
    const [symbolError, setSymbolError] = useState(false);
    const { validAddress, erc20GetSymbolAndDecimal } = useWallet();


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
            <div>
                <h3> erc-20 balanceOf</h3>
                <div className="gatekeeper-address-input">
                    <p>Contract Address </p>
                    <input className={`${addressError || duplicateAddressError ? "error" : null}`} value={gatekeeperAddress} onChange={handleGatekeeperAddressChange} type="text" />
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
    const { validAddress, erc721GetSymbol } = useWallet();



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
            <div>
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

                    <div></div>

                </div>
            </div>

            <div className="gk-detail-buttons">
                <button className="gk-rule-cancel" onClick={() => { setGatekeeperInnerProgress(0) }}>cancel</button>
                <button className="gk-rule-save" disabled={!enableSave} onClick={handleSave}>save</button>
            </div>

        </>
    )

}

function DiscordRoleGatekeeper({ setGatekeeperInnerProgress, fields, setFields, discordIntegrationProps }) {
    const [guildId, setGuildId] = useState(null);
    const [guildName, setGuildName] = useState(null);
    const [userDiscordId, setUserDiscordId] = useState(null)
    const [discordRuleState, setDiscordRuleState] = useState('')
    const [guildRoles, setGuildRoles] = useState('');
    const [isBotVerified, setIsBotVerified] = useState(false);
    const [botFailureMessage, setBotFailureMessage] = useState('');
    const [authTimerActive, setAuthTimerActive] = useState(false);
    const [discordIntegrationStep, setDiscordIntegrationStep] = useState(0);
    const [userServers, setUserServers] = useState(null)

    let {
        userOnOpen,
        userAuthorization,
        userError,
        userIsAuthenticating,
        botOnOpen,
        botAuthorization,
        botError,
        botIsAuthenticating,
        userAuth,
        setUserAuth,
        botAuth,
        setBotAuth,
        selectedServer,
        setSelectedServer
    } = discordIntegrationProps


    const ens = fields.ens;

    // on tab load, check if we already have a guild registered for this ens.
    // if we do, set the guildId and allow them to update if neccessary
    // otherwise, allow them to add one
    useEffect(() => {
        (async () => {
            await fetchGuildInfo();
        })();
    }, [])



    useEffect(() => {
        (async () => {
            if (!userAuth) {
                if (authTimerActive) {
                    setDiscordIntegrationStep(0)
                    setAuthTimerActive(false);
                    return
                }
            }
            else {
                console.log('running again')
                let result = await axios.post('/discord/getUserServers', { token_type: userAuth.token_type, access_token: userAuth.access_token })
                console.log(result.data)
                setUserServers(result.data)
                setUserDiscordId(userAuth.userId)
                setDiscordRuleState('configure rule')
                setAuthTimerActive(true);
                setDiscordIntegrationStep(1)
                return
            }
        })();

    }, [userAuth])


    useEffect(() => {
        (async () => {
            if (botAuth) {
                let guild_info = await verifyBot(botAuth.guild.id)
                if (guild_info) {
                    addDiscordRule(guild_info);
                    setDiscordIntegrationStep(0)
                }
            }
        })();

    }, [botAuth])


    // parse gk rules and see if we have a guild_id already
    const getGuildId = async () => {
        let guild_id = fields.gatekeeper.rules.map((rule) => {
            if (rule.gatekeeperType === 'discord') return rule.guildId
        })


        if (guild_id[0]) return guild_id[0]
        return null
    }


    const fetchGuildInfo = async () => {
        // only run this if user hasn't updated discord server data

        let guild_id = await getGuildId();
        if (guild_id) {
            const resp = await axios.post('/discord/verifyBotAdded', { guild_id: guild_id });

            setDiscordRuleState('configure rule')
            setGuildId(resp.data.id)
            setGuildName(resp.data.name);
            setGuildRoles(resp.data.roles);
            return
        }
        else {
            setDiscordRuleState('no rule')
            return
        }


    }

    // start here

    const discordAuthenticateUser = async () => {

        if (!userAuth) return userOnOpen();
        let result = await axios.post('/discord/getUserServers', { token_type: userAuth.token_type, access_token: userAuth.access_token })
        setUserServers(result.data)
        setDiscordIntegrationStep(1)

    }


    // if there was a problem adding, let the user know and reset the whole process
    // otherwise, set a success message

    const verifyBot = async (guild_id) => {
        const resp = await axios.post('/discord/verifyBotAdded', { guild_id: guild_id })
        switch (resp.data) {
            case 'unable to read roles':
                setIsBotVerified(false);
                setBotFailureMessage('bot was not added')
                return null;
            default:
                setIsBotVerified(true);
                setDiscordRuleState('configure rule')
                if (guildId !== resp.data.id) {
                    setGuildId(resp.data.id)
                    setGuildName(resp.data.name)
                    setGuildRoles(resp.data.roles)
                    return { guildId: resp.data.id, guildName: resp.data.name, guildRoles: resp.data.roles }
                }
                // user attempting to add already assigned server. Just re-route them to the roles section
                setDiscordIntegrationStep(0)

        }

    }



    const addDiscordRule = (guild_info) => {
        const gatekeeperObj = {
            gatekeeperType: 'discord',
            serverName: guild_info.guildName,
            guildId: guild_info.guildId,
            userId: userDiscordId
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
    }




    return (

        <>
            {discordRuleState === 'no rule' &&
                <>
                    {/*
                    <div className="discord-add-bot-container">
                        <button className={'discord-add-bot ' + (userIsAuthenticating ? 'loading' : '')} onClick={discordAuthenticateUser}>{userIsAuthenticating ? 'check popup window' : 'add bot'}</button>
                    </div>
                */}

                    <div className="discord-guild-info">
                        <p className="discord-name-header">server</p>
                        <GuildTopLevel guildName={guildName} userIsAuthenticating={userIsAuthenticating} discordAuthenticateUser={discordAuthenticateUser} discordIntegrationStep={discordIntegrationStep} />
                    </div>

                    <div className="settings-next-previous-ctr">
                        <button className="previous-btn enable" onClick={() => { setGatekeeperInnerProgress(0) }}><i className="fas fa-long-arrow-alt-left"></i></button>
                    </div>
                </>
            }
            {discordRuleState === 'configure rule' &&
                <>

                    <div className="discord-guild-info">
                        <p className="discord-name-header">server</p>
                        <GuildTopLevel guildName={guildName} userIsAuthenticating={userIsAuthenticating} discordAuthenticateUser={discordAuthenticateUser} discordIntegrationStep={discordIntegrationStep} />

                        {(discordIntegrationStep === 0 && guildRoles.length > 0) &&

                            <>

                                <p className="discord-roles-header">server roles</p>
                                <GuildRolesDisplay guildRoles={guildRoles} />


                            </>
                        }

                        {discordIntegrationStep === 1 &&
                            <>
                                <p className="discord-roles-header">select a server</p>
                                <GuildServersDisplay selectedServer={selectedServer} setSelectedServer={setSelectedServer} userServers={userServers} />
                            </>
                        }
                    </div>



                    {discordIntegrationStep === 0 &&
                        <div className="settings-next-previous-ctr">
                            <button className="previous-btn enable" onClick={() => { setGatekeeperInnerProgress(0) }}><i className="fas fa-long-arrow-alt-left"></i></button>
                        </div>
                    }
                    {discordIntegrationStep === 1 &&
                        <div className="settings-next-previous-ctr">
                            <button className="previous-btn enable" onClick={() => { setDiscordIntegrationStep(0) }}><i className="fas fa-long-arrow-alt-left"></i></button>
                            {selectedServer && <button className="add-discord-bot-btn enable" onClick={botOnOpen}>add bot</button>}
                        </div>
                    }
                </>
            }

        </>
    )


}

function GuildTopLevel({ guildName, userIsAuthenticating, discordAuthenticateUser, discordIntegrationStep }) {
    return (
        <div className="discord-guild-name">
            <div>
                <p style={{ margin: 0 }}>{guildName || 'none'}</p>
            </div>
            <button disabled={discordIntegrationStep !== 0} className={'discord-add-bot ' + (userIsAuthenticating || discordIntegrationStep === 1 ? 'loading' : '')} onClick={discordAuthenticateUser}>{userIsAuthenticating ? 'check popup window' : (discordIntegrationStep === 1 ? 'select a server' : 'new server link')}</button>
        </div>
    )
}

function GuildRolesDisplay({ guildRoles }) {
    const calculateColor = (decimal) => {
        if (decimal == 0) {
            return 'rgba(211, 211, 211, 1)'
        }
        return 'rgb(' + ((decimal >> 16) & 0xff) + ',' + ((decimal >> 8) & 0xff) + ',' + (decimal & 0xff) + ')'
    }

    const calculateBackgroundColor = (decimal) => {
        if (decimal == 0) {
            return 'rgba(18, 52, 86, 0.3)'
        }
        return 'rgba(' + ((decimal >> 16) & 0xff) + ',' + ((decimal >> 8) & 0xff) + ',' + (decimal & 0xff) + ',0.3)'
    }

    return (
        <div className="discord-guild-roles">
            {guildRoles.map((val, key) => {
                return <span key={key} style={{ backgroundColor: calculateBackgroundColor(val.color), color: calculateColor(val.color) }}><p>{val.name}</p></span>
            })}
        </div>
    )
}

function GuildServersDisplay({ userServers, selectedServer, setSelectedServer }) {
    return (
        <div className="discord-user-servers">
            {userServers.map((server) => {
                return (
                    <div key={server.id} className={"discord-server " + (selectedServer === server.id ? 'selected' : 'undefined')} onClick={() => { setSelectedServer(server.id) }}>
                        <img src={server.img}></img>
                        <p>{server.name}</p>
                    </div>

                )
            })}
        </div>
    )
}


function SaveComponent({ standardProps, infoErrorController, adminErrorController }) {
    const { fields, setFields } = standardProps;
    const { setNameErrorMsg, setWebsiteErrorMsg, infoRef } = infoErrorController;
    const { addressErrors, setAddressErrors, addresses, setAddresses, adminRef } = adminErrorController;
    const walletAddress = useSelector(selectConnectedAddress)
    const existingGatekeeperRules = useSelector(selectDashboardRules);
    const dispatch = useDispatch();
    const history = useHistory();
    const { ens } = useParams();
    const { populateDashboardRules } = useDashboardRules();
    const { updateDashboardInfo } = useDashboard();
    const { authenticated_post } = useCommon();
    const { validAddress } = useWallet();


    const errorCheckInfo = async () => {
        if (fields.name == "") {
            setNameErrorMsg({ error: true, msg: "name field cannot be left blank" })
            return 'error';
        }
        else {

            const exists = await axios.post('/organizations/doesNameExist', { name: fields.name, ens: fields.ens })
            if (exists.data) {
                //name already exists
                setNameErrorMsg({ error: true, msg: "an organization with this name already exists" })
                return 'error';

            }
        }
        if (fields.website != "") {
            if (fields.website.indexOf("http://") == 0 || fields.website.indexOf("https://") == 0) {
                setWebsiteErrorMsg({ error: true, msg: "please exclude http/https from your webpage link" });
                return 'error';
            }
        }
    }

    const errorCheckAdmins = async (finalSubmission) => {
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
                    let errorsCopy = JSON.parse(JSON.stringify(addressErrors));
                    errorsCopy[i] = true;
                    setAddressErrors(errorsCopy);
                    return 'error';
                }
                else {
                    validChecksumAddresses.push(valid)
                }
            }
        }

        finalSubmission.addresses = validChecksumAddresses.filter((el) => {
            return el != '';
        })

        return
    }


    const handleClose = () => {
        history.push('/' + fields.ens + '/dashboard')
    }

    const saveSequence = async () => {
        let finalSubmission = JSON.parse(JSON.stringify(fields));
        let infoErrors = await errorCheckInfo();
        if (infoErrors === 'error') {
            infoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        let adminErrors = await errorCheckAdmins(finalSubmission);
        if (adminErrors === 'error') {
            adminRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }


        // in both cases for new and existing orgs, we want to push the resolved ens and walletAddress, then remove duplicates
        const resolvedEns = await validAddress(fields.ens);
        finalSubmission.addresses.push(resolvedEns)

        // set the fields in case user wants to go backwards

        setFields({ addresses: finalSubmission.addresses })

        // we only want to send the new rules to the db

        let ruleDuplicates = fields.gatekeeper.rules.filter(({ gatekeeperAddress: gk_addy1, guildId: gid1 }) => !Object.values(existingGatekeeperRules).some(({ gatekeeperAddress: gk_addy2, guildId: gid2 }) => (gk_addy2 === gk_addy1 && gid1 === gid2)))

        finalSubmission.gatekeeper.rules = ruleDuplicates


        let settingsResult = await authenticated_post('/settings/updateSettings', { ens: fields.ens, fields: finalSubmission, walletAddress: walletAddress });
        if (settingsResult) {
            if (ens === 'new') dispatch(addOrganization({ name: fields.name, members: 0, logo: fields.logo, verified: false, ens: fields.ens }));
            else if (ens !== 'new') {
                updateDashboardInfo({ name: fields.name, website: fields.website, logo: fields.logoPath || fields.logo, logoBlob: fields.logoBlob, discord: fields.discord, addresses: settingsResult.data.adminAddresses })
                populateDashboardRules(fields.ens)
            }
            showNotification('saved successfully', 'success', 'your changes were successfully saved')
            handleClose();
        }
    }


    return (
        <div className="save-settings-container">
            <button className="next-btn enable" onClick={saveSequence}>Save</button>
        </div>
    )
}