const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const products = require('./products.json');

// Carrega o arquivo .proto
const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

// Cria o servidor gRPC
const server = new grpc.Server();

// Implementa os métodos do InventoryService
server.addService(inventoryProto.InventoryService.service, {
    // Retorna todos os produtos
    SearchAllProducts: (_, callback) => {
        callback(null, {
            products: products,
        });
    },

    // 🔹 Nova função adicionada (Tarefa Prática #1)
    SearchProductByID: (payload, callback) => {
        const product = products.find((p) => p.id == payload.request.id);
        callback(null, product);
    },
});

// Inicializa o servidor
server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
    server.start();
});
