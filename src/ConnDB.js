import mongoose from "mongoose";

export const connDB = async (url,dbName) => {
    try {
        await mongoose.connect(
            url,
            {
                dbName: dbName
            }
        );
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.log(`Error al conectar a la base de datos: ${error.message}`);
    }
}