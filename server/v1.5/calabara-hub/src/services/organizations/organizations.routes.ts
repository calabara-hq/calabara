import express, { Request, Response } from 'express';
import { clean } from '../../helpers/helpers';
import { QueryParams } from '../../helpers/interfaces';
import { addUserSubscription, doesEnsExist, doesNameExist, fetchOrganizations, getUserSubscriptions, removeUserSubscription } from './organizations.methods';
import { authenticateToken } from '../../middlewares/authentication-middleware';

const router = express();


router.get('/allOrganizations', async (req: Request, res: Response) => {
    let result = await fetchOrganizations()
        .then(clean)
    return res.json(result);
})

router.get('/doesEnsExist/:ens', async (req: Request, res: Response) => {
    const { ens } = req.params;
    let result = await doesEnsExist(ens)
        .then(clean);
    return res.json(result)
});

router.get('/doesNameExist', async (req: Request, res: Response) => {
    const { name, ens } = req.query as QueryParams;
    let result = await doesNameExist(name, ens)
        .then(clean);
    return res.json(result)
});

router.get('/userSubscriptions', async (req: Request, res: Response) => {
    const { address } = req.query as QueryParams;
    let result = await getUserSubscriptions(address)
        .then(clean);
    return res.json(result)
})

router.post('/addSubscription', authenticateToken, async function (req: Request, res: Response) {
    const { ens } = req.body;
    const address = req.session?.user.address;
    if (!address) return
    await addUserSubscription(ens, address)
    return res.json('OK')
});

router.post('/removeSubscription', authenticateToken, async function (req: Request, res: Response) {
    const { ens } = req.body;
    const address = req.session?.user.address;
    if (!address) return
    await removeUserSubscription(ens, address)
    return res.json('OK')

});

export default router;