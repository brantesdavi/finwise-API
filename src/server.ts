import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod'
import fastifyCors from 'fastify-cors'; 

const app = fastify();
const prisma = new PrismaClient();

app.register( fastifyCors, {
    origin: '*'
})


// get all transactions
app.get('/transactions', async (req, res) => {
    try {
      const getTransactionsSchema = z.object({
        userId: z.string().optional(), 
      });
  
      const parsedData = getTransactionsSchema.safeParse(req.query);
  
      if (parsedData.success) {
        const { userId } = parsedData.data;  
        const transactions = await prisma.transaction.findMany({
          where: userId ? { userId } : undefined,
        });
  
        return { transactions };
      } else {
        console.error("Invalid query parameters:", parsedData.error);
        res.status(400).send({ error: "Invalid request parameters" }); // Handle parsing errors
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error); // Handle unexpected errors
    }
  });
  


//Create transaction
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