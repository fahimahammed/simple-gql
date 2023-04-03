import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';
import { productsData, categoriesData } from "./db.js";

const typeDefs = `#graphql
    type Query {
        message: String
        id: Int
        products: [Product]
        product(productId: ID): Product
        categories: [Category]
        category (catId: ID): Category
    }

    type Product {
        id: ID
        name: String
        description: String
        quantity: Int
        price: Float
        image: String
        onSale: Boolean
        categoryId: ID
        category: Category
    }

    type Category{
        id: ID
        name: String
    }
`

const resolvers = {
    Query: {
        message: ()=> "Hello everyone!",
        id: ()=> 1,
        products: ()=> productsData,
        product: (parent, args, context)=> {
            console.log(args)
            const productById = productsData.find(item => item.id === args.productId);
            return productById;
        },
        categories: ()=> categoriesData,
        category: (parent, args, context)=>{
            console.log(args.catId)
            const catById = categoriesData.find(item => item.id === args.catId);
            return catById;
        }
    },
    Product: {
        category: (parent, args, context)=>{
            const productByCat = categoriesData.find(cat => cat.id === parent.categoryId)
            return productByCat
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const {url} = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log("server started at ", url);