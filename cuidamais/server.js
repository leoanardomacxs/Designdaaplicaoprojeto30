const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Configurações e Middlewares
app.use(cors()); // Libera o acesso para o Lovable não dar erro de segurança
app.use(express.json());
app.use(express.static("public"));

// ==========================================
// 1. ROTAS DE AUTENTICAÇÃO (User)
// ==========================================

// Cadastro de usuário
app.post("/api/auth/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Verifica se o usuário já existe
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }

        const newUser = await prisma.user.create({
            data: { email, password, name } // Nota: Em produção, o ideal é usar bcrypt para a senha
        });

        res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar usuário.", details: error.message });
    }
});

// Login de usuário
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar login.", details: error.message });
    }
});


// ==========================================
// 2. ROTAS DE PACIENTES (Patient)
// ==========================================

// Criar Paciente
app.post("/api/patients", async (req, res) => {
    try {
        const { name, age, phone, condition } = req.body;
        const newPatient = await prisma.patient.create({
            data: { name, age: parseInt(age) || null, phone, condition }
        });
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar paciente.", details: error.message });
    }
});

// Listar Pacientes
app.get("/api/patients", async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            orderBy: { id: "desc" }
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar pacientes.", details: error.message });
    }
});

// Deletar Paciente
app.delete("/api/patients/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.patient.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensagem: "Paciente removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar paciente.", details: error.message });
    }
});


// ==========================================
// 3. ROTAS DE PRONTUÁRIOS (Record)
// ==========================================

// Criar Prontuário/Registro
app.post("/api/records", async (req, res) => {
    try {
        const {
            patientId,
            date,
            bloodPressure,
            glucose,
            temperature,
            mood,
            notes
        } = req.body;

        const newRecord = await prisma.record.create({
            data: {
                patientId: parseInt(patientId),
                date,
                bloodPressure,
                glucose: glucose ? parseFloat(glucose) : null,
                temperature: temperature ? parseFloat(temperature) : null,
                mood,
                notes
            }
        });

        res.status(201).json({
            mensagem: "Registro salvo com sucesso!",
            id: newRecord.id
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar registro.", details: error.message });
    }
});

// Listar todos os Prontuários (com os dados do Paciente inclusos)
app.get("/api/records", async (req, res) => {
    try {
        const records = await prisma.record.findMany({
            include: { patient: true }, // Traz junto as informações do paciente vinculado
            orderBy: { id: "desc" }
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar registros.", details: error.message });
    }
});

// Atualizar Prontuário
app.put("/api/records/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            date,
            bloodPressure,
            glucose,
            temperature,
            mood,
            notes
        } = req.body;

        await prisma.record.update({
            where: { id: parseInt(id) },
            data: {
                date,
                bloodPressure,
                glucose: glucose ? parseFloat(glucose) : null,
                temperature: temperature ? parseFloat(temperature) : null,
                mood,
                notes
            }
        });

        res.json({ mensagem: "Registro atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar registro.", details: error.message });
    }
});

// Deletar Prontuário
app.delete("/api/records/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.record.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensagem: "Registro removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar registro.", details: error.message });
    }
});

// Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor moderno rodando em http://localhost:${PORT}`);
});