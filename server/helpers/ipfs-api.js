const dotenv = require('dotenv')
const asyncfs = require('fs').promises;
const fs_path = require('path')
const fs = require('fs')
const FormData = require('form-data')
dotenv.config();
const axios = require('axios')

const ipfs_gateway = 'https://gateway.pinata.cloud/ipfs/'
const pinataSDK = require('@pinata/sdk');
const { Transform } = require('stream');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)


const testAuthentication = async () => {
    try {
        let res = await pinata.testAuthentication();
        return res
    } catch (err) { return err }
}




const pinFileStream = async (stream, filename, options) => {


    var data = new FormData();
    data.append('file', stream, {
        filepath: filename,
    });

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: {
            'Authorization': `Bearer ${process.env.PINATA_JWT}`,
            ...data.getHeaders()
        },
        data: data
    };

    return axios(config).then((res, err) => {
        if (err) return err
        return fs_path.normalize(fs_path.join(ipfs_gateway, res.data.IpfsHash))

    });



    /*
    
        let end = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('sleep over')
            }, 5000)
        })
        await end
        return end;
    
        return stream
    */
}

const pinFromFs = async (path, options) => {
    let location = fs_path.normalize(fs_path.join(__dirname, '../', path))

    try {
        let result = await pinata.pinFromFS(location, options)
        return fs_path.normalize(fs_path.join(ipfs_gateway, result.IpfsHash))
    } catch (e) { console.log(e) }

}

const pinJSON = async (data, options) => {

    try {
        let result = await pinata.pinJSONToIPFS(data, options);
        return fs_path.normalize(fs_path.join(ipfs_gateway, result.IpfsHash))
    } catch (e) { console.log(e) }
}


module.exports = { testAuthentication, pinFileStream, pinFromFs, pinJSON }