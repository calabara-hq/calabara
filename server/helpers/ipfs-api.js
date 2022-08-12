const dotenv = require('dotenv')
const asyncfs = require('fs').promises;
const fs_path = require('path')
const fs = require('fs')

dotenv.config();

const pinataSDK = require('@pinata/sdk');
const { tasks } = require('googleapis/build/src/apis/tasks');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)


const testAuthentication = async () => {
    try {
        let res = await pinata.testAuthentication();
        return res
    } catch (err) { return err }
}

const pinFile = async (read_stream, options) => {

    pinata.pinFileToIPFS(read_stream, options).then((result) => {
        console.log(result)
        return result

    }).catch((err) => {
        console.log(err)
        return err
    })

}

const pinFromFs = async (path, options) => {
    let location = fs_path.normalize(fs_path.join(__dirname, '../', path))

    try {
        let result = await pinata.pinFromFS(location, options)
        return result
    } catch (e) { console.log(e) }

}

const pinJSON = async (data, options) => {

    try {
        let result = await pinata.pinJSONToIPFS(data, options);
        return result
    } catch (e) { console.log(e) }
}


module.exports = { testAuthentication, pinFile, pinFromFs, pinJSON }