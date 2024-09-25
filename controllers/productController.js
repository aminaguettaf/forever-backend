import productModel from "../models/productModel.js";

const addProduct = async(req, res)=>{
    try {
        const {name, description, price, category, subCategory, sizes, bestSeller} = req.body;

        //  Récupérer les images téléchargées
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        //  Filtrer et ne garder que les images existantes
        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined);

        let imagesUrl = images.map((item) => {
            return `${item.filename}`; // Ici, vous générez l'URL d'accès pour chaque image
        });

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }
        const product = new productModel(productData);
        await product.save();

        res.json({success:true, message:'Product added'});

    } catch (error) {
        res.json({success:false, message:error.message});
    }

}

const removeProduct = async(req, res)=>{
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:'Product deleted'});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

const productsList = async(req, res)=>{
    try {
        const products = await productModel.find({});
        res.json({success:true, products});
    } catch (error) {
        res.json({success:false, message:error.message});
    }  
}

const singleProduct = async(req, res)=>{
    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({success:true, product});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export {addProduct, removeProduct, productsList, singleProduct};