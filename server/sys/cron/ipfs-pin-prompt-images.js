const cron = require('node-cron');
const { clean, asArray, parallelLoop, serializedLoop } = require('../../helpers/common.js');
const db = require('../../helpers/db-init.js');
const { EVERY_10_SECONDS, EVERY_30_SECONDS } = require('./schedule');
const { pinFromFs, pinFileStream } = require('../../helpers/ipfs-api.js');



const getPrompts = async () => {
    try {
        let result = await db.query('update contests set locked = true where pinned = false and locked = false returning id, prompt_data')
            .then(clean)
            .then(asArray)
        return result
    } catch (e) { console.log(e) }
}


const updateDB = async (prompt) => {
    try {
        let result = await db.query('update contests set locked = false, pinned = true, prompt_data = $1 where id = $2', [prompt.prompt_data, prompt.id])
        return result
    } catch (e) { console.log(e) }
}



const parseBlocks = async (blocks) => {
    await serializedLoop(blocks, async (block) => {
        if (block.type === 'image') {
            let hash = await pinFromFs(block.data.file.url)
            block.data.file.url = hash
        }
    })
    return blocks
}



const mainLoop = async () => {
    let prompts = await getPrompts();
    await parallelLoop(prompts, async (prompt) => {
        if (prompt.prompt_data.coverImage) {
            let hash = await pinFromFs(prompt.prompt_data.coverImage);
            prompt.prompt_data.coverImage = hash;
        }
        let parsedBlocks = await parseBlocks(prompt.prompt_data.editorData.blocks)
        prompt.prompt_data.editorData.blocks = parsedBlocks
        await updateDB(prompt)
    })
}



const pin_prompt_assets = () => {
    cron.schedule(EVERY_10_SECONDS, () => {
        console.log('pinning prompt images')
        mainLoop();
    })
}

module.exports = pin_prompt_assets