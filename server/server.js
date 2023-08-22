
const mongoose = require("mongoose")
const Document = require("./document.js")

mongoose.connect('mongodb+srv://swatantra1265:alexcosta01@cluster0.heeeiru.mongodb.net/?retryWrites=true&w=majority')

const io = require("socket.io")(3001, {
  cors: {
      origin: "http://localhost:3000",
    methods: ["GET", "POST"],
},
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on("get-document", async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)
        
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
    })
    
    socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
    })
})
})

async function findOrCreateDocument(id) {
    if (id == null) return
    
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
}



// const Document = require('./document.js');
// const mongoose = require('mongoose');

// const USERNAME = process.env.USERNAME;
// const PASSWORD = process.env.PASSWORD;

// const URI = 'mongodb+srv://swatantra1265:alexcosta01@cluster0.heeeiru.mongodb.net/?retryWrites=true&w=majority'
// // //since newer version of mongoose does not accept callbacks
// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect(URI);
// }

// const io = require('socket.io')(3001, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ["GET", "POST"],
//     },
// })

// const defaultValue = ""

// io.on("connection", socket => {
//     socket.on("get-document", async documentId => {
//         const document = findOrCreateDocument(documentId)
//         socket.join(documentId)
//         socket.emit('load-document', document.data)

//         socket.on("send-changes", delta => {
//             //broadcasts the changes to everyone on socket except us
//             socket.broadcast.to(documentId).emit("receive-changes", delta)
//         })

//         socket.on("save-document", async data => {
//             await Document.findByIdAndUpdate(documentId, { data })
//         })
//     })
// })

// async function findOrCreateDocument(id) {
//     if (id == null) return

//     const document = await Document.findById(id)
//     if (document) return document
//     return await Document.create({ _id: id, data: defaultValue})
// }