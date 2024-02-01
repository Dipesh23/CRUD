const express = require("express")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect("mongodb://localhost:27017/Sample", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected with MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())


const ProductSchema = new mongoose.Schema({
    product:String,
    description:String,
    price:Number,

})

const Product = new mongoose.model("Product",ProductSchema);

//Create API

app.post("/api/product/new", async(req,res)=>{
    const product = await Product.create(req.body);
    res.status(200).json({
        success:true,
        product
    })
})

//READ API

app.get("/api/product",async(req,res)=>{
    const product = await Product.find();

    res.status(200).json({
        success:true,
        product
    })
})

app.put("/api/product/:id",async(req,res)=>{

    let product = await Product.findById(req.params.id);
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{neq:true,
        useFindAndModify:false,
        runValidators:true

    })
    if(!product)
    {
        res.status(500).json({
            success:false,
            message:"Product is not there"
        })
    }

    res.status(200).json({
        success:true,
        product
    })
})

app.delete("/api/product/:id", async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});


app.listen(3000,()=>{
    console.log("server is connected");
})

