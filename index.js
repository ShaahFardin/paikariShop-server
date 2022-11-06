const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://simpleUser:G0j8ZRJ9Fm23Onad@cluster0.il5mbbt.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log(`Database connected, `, uri);
    } catch (error) {
        console.log(error.name, error.message.bgRed, error.stack);
    }
}
run();

const productCollection = client.db("paikaiShop").collection("orders");

app.post('/products', async (req, res) => {

    try {
        const result = await productCollection.insertOne(req.body);

        if (result.insertedId) {
            res.send({
                success: 'true',
                message: `Successfully created the ${req.body.name} with id ${result.insertedId}`
            })
        } else {
            res.send({
                success: "false",
                message: "Could not create the product"
            })
        }
    } catch (error) {
        console.log(error.name, error.message.bgRed, error.stack);
        res.send({
            success: false,
            error: error.message
        })
    }
})

app.get('/products', async (req, res) => {
    try {
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send({
            success: true,
            message: "Successfully got the data",
            data: products
        })

    } catch (error) {
        console.log(error.name, error.message.bgRed, error.stack);
        res.send({
            success: false,
            error: error.message
        })
    }
})

app.delete('/products/:id', async (req, res) => {

    const { id } = req.params;
    try {
        const product = await productCollection.findOne({ _id: ObjectId(id) });
        if (!product._id) {
            res.send({
                success: false,
                error: "Product does not exist"
            });
            return;
        }
        const result = await productCollection.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `Successfully deleted the product ${product}`
            })
        } else {

        }

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productCollection.findOne({ _id: ObjectId(id) });

        res.send({
            success: true,
            data: product
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

app.patch('/product/:id', async (req, res) => {
    const { id } = req.body
    try {
        const result = await productCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        if (result.modifiedCount) {
            res.send({
                success: true,
                message: `Successfully updated the product`
            })
        } else {
            res.send({
                success: false,
                message: "Could not update the product"
            })
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

app.listen(port, () => console.log(`Server up and runnig on port, ${port}`))