const mongoose =  require("mongoose");

const Connection = async (USERNAME, PASSWORD) => {
    const URI =    `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.heeeiru.mongodb.net/?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true});
        console.log("DB connected successfully")
    } catch (error) {
        console.log("Error while connecting to DB", error);
    }
}

module.exports = Connection;
