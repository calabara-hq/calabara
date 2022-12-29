//const logger = console//require('../logger').child({ service: 'middleware:authentication' })

import { NextFunction, Request, Response } from "express";


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // TURTLES need to reimplement auth verification
    /*
    let session = JSON.parse(req.get('Cookie'))
    //if (!session || !session?.user?.address) return res.sendStatus(401)
    //req.session = session
    */

    req.session = { user: { address: '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C' } }
    next();
}