import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

import { z } from 'zod'

const app = fastify();

const prisma = new PrismaClient();


app.get('/transactions', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany();
        return { transactions }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/transactions', async (req, res) => {
    try {
        const createTransactionSchema = z.object({
            spendOrIncome: z.boolean(),
            title: z.string(),
            price: z.number(),
            date: z.string().pipe(z.coerce.date()),
            categoryId: z.number(),
            userId: z.string(),
            recurrrenceUnit: z.string().nullable(),
            quantity: z.number().nullable(),
            endDate: z.string().pipe(z.coerce.date()).nullable()
        })

        const { 
            spendOrIncome, 
            title, 
            price, 
            date, 
            categoryId, 
            userId, 
            recurrrenceUnit, 
            quantity, 
            endDate 
        } = createTransactionSchema.parse(req.body)

        await prisma.transaction.create({
            data: {
                spendOrIncome,
                title,
                price,
                date,
                categoryId,
                userId,
                recurrrenceUnit,
                quantity,
                endDate
            }
        })

        // const transaction = new Transaction(req.body);
        // await transaction.save();
        res.status(201).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log("Http server running")
})