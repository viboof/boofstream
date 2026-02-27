import { Request, Response } from "express";

export function wrap(f: (req: Request, res: Response) => Promise<void>) {
    return async function wrapped(req: Request, res: Response) {
        try {
            await f(req, res);
        } catch (e: any) {
            console.error(e);
            res.json({ error: e.toString() });
            res.status(500);
        }
    }
};
