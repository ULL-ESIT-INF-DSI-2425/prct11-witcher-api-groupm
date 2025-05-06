import { describe, test, expect } from "vitest";
import mongoose from "mongoose";
import { connectDB } from "../src/config/database.js"; 

describe("Conexión a la base de datos", () => {

  test("Conectar a MongoDB", async () => {
    await connectDB();
    const isConnected = mongoose.connection.readyState === 1; // 1 significa que está conectado
    expect(isConnected).toBe(true);
  });

  test("Desconectar de MongoDB", async () => {
    await mongoose.connection.close();
    const isConnected = mongoose.connection.readyState === 0; // 0 significa que está desconectado
    expect(isConnected).toBe(true);
  });
});