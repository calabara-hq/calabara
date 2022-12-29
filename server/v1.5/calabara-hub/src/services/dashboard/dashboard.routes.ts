import express, { Request, Response } from 'express';
import { QueryData, QueryParams } from '../../helpers/interfaces';
import { getDashboardInfo, getDashboardRules, getDashboardWidgets } from './dashboard.methods';
const router = express();


router.get('/dashboardBatchData', async (req: Request, res: Response) => {
    const { ens } = req.query as QueryParams;
    const [orgInfo, rules, widgets] = await Promise.all([
        getDashboardInfo(ens),
        getDashboardRules(ens),
        getDashboardWidgets(ens)
    ])
    res.json({ dashboardData: { orgInfo, rules, widgets } })
})

router.get('/dashboardInfo', async (req: Request, res: Response) => {
    const { ens } = req.query as QueryParams;
    const result = await getDashboardInfo(ens)
    res.json({ orgInfo: result })

})

router.get('/dashboardRules', async (req: Request, res: Response) => {
    const { ens } = req.query as QueryParams;
    const result = await getDashboardRules(ens);
    res.json(result)

})

router.get('/calendarMetaData', async (req: Request, res: Response) => {
    // TURTLES
})

router.get('/calendarEvents', async (req: Request, res: Response) => {
    // TURTLES
})

router.post('/addWidget', async (req: Request, res: Response) => {
    // TURTLES
})

router.post('/removeWidget', async (req: Request, res: Response) => {
    // TURTLES
})

router.post('/updateWidgetMetadata', async (req: Request, res: Response) => {
    // TURTLES
})

router.post('/updateWidgetGatekeeperRules', async (req: Request, res: Response) => {
    // TURTLES
})

export default router;