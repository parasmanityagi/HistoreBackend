
import Products from '../models/productSchema.js'

const products = [
    {
        name: 'Otiumhic youthful elegance anton',
        desc: 'A stylish and elegant youth fashion product for men.',
        image: 'd-1.jpg',
        category: 'Fashion, Men Fashion',
        price: 76.00,
        stock: 10, 
        createdAt: new Date()
    },
    {
        name: 'Blanca lorem reiciendis voluibus',
        desc: 'High-quality mobile and tablet electronics.',
        image: 'd-2.jpg',
        category: 'Electronics, Mobile & Tablet',
        price: 125.51,
        stock: 15,
        createdAt: new Date()
    },
    {
        name: 'Deep patoni repeat predefin',
        desc: 'Affordable and stylish men\'s fashion product.',
        image: 'd-3.jpg',
        category: 'Fashion, Men Fashion',
        price: 40.00,
        stock: 20,
        createdAt: new Date()
    },
    {
        name: 'Deserunt versions have evolved',
        desc: 'Men\'s fashion product with a modern design.',
        image: 'd-4.jpg',
        category: 'Fashion, Men Fashion',
        price: 105.00,
        stock: 12,
        createdAt: new Date()
    },
    {
        name: 'Ligula tortoram labore dolore',
        desc: 'Trendy fashion for men, perfect for casual wear.',
        image: 'd-5.jpg',
        category: 'Fashion, Men Fashion',
        price: 99.00,
        stock: 18,
        createdAt: new Date()
    },
    {
        name: 'Lorem consm asdipes dicapro',
        desc: 'Comfortable and affordable men\'s fashion.',
        image: 'd-6.jpg',
        category: 'Fashion, Men Fashion',
        price: 54.00,
        stock: 22,
        createdAt: new Date()
    },
    {
        name: 'Maciti Aliqua occur thatple',
        desc: 'Luxurious men\'s fashion for special occasions.',
        image: 'd-7.jpg',
        category: 'Fashion, Men Fashion',
        price: 439.00,
        stock: 8,
        createdAt: new Date()
    },
    {
        name: 'Maiores alias conaut perfere',
        desc: 'Affordable and stylish men\'s fashion product.',
        image: 'd-8.jpg',
        category: 'Fashion, Men Fashion',
        price: 46.51,
        stock: 25,
        createdAt: new Date()
    },
    {
        name: 'Mammo diablo except obtain',
        desc: 'A trendy and comfortable men\'s fashion product.',
        image: 'd-9.jpg',
        category: 'Fashion, Men Fashion',
        price: 79.51,
        stock: 14,
        createdAt: new Date()
    },
    {
        name: 'Natus therefore always bolac',
        desc: 'Stylish and high-quality men\'s fashion.',
        image: 'd-10.jpg',
        category: 'Fashion, Men Fashion',
        price: 99.00,
        stock: 16,
        createdAt: new Date()
    },
    {
        name: 'Natus therefore always bolack',
        desc: 'Elegant fashion designed for men.',
        image: 'd-11.jpg',
        category: 'Fashion, Men Fashion',
        price: 142.00,
        stock: 9,
        createdAt: new Date()
    },
    {
        name: 'Omnis passage alias consola',
        desc: 'Classic men\'s fashion with modern flair.',
        image: 'd-12.jpg',
        category: 'Fashion, Men Fashion',
        price: 66.00,
        stock: 19,
        createdAt: new Date()
    }
];






const uploadProducts = async () => {
    try {
        await Products.insertMany(products); 
        console.log('All products have been successfully uploaded');
    } catch (error) {
        console.error('Error uploading products:', error.message);
    }
};




export default uploadProducts
